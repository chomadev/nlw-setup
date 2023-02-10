import { FastifyInstance } from "fastify"
import { prisma } from "./prisma"
import { z } from "zod"
import dayjs from "dayjs"

export async function appRoutes(server: FastifyInstance) {
    server.get('/api/habits', async (request, reply) => {
        const habits = await prisma.habit.findMany()

        reply.send({
            status: 200,
            data: { habits }
        })
    })

    server.get('/api/summary', async (request, reply) => {
        return await prisma.$queryRaw`
            select
                d.id,
                d.date,
                (
                    select cast(count(*) as float)
                    from day_habits DH
                    where d.id = DH.day_id
                ) as completed,
                (
                    select cast(count(*) as float)
                    from habit_week_days HWD
                    join habits H on H.id = HWD.habit_id
                    where
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                        and H.created_at <= D.date
                ) as amount
            from days D
        `
    })

    server.get('/api/habits_dashboard', async (request, reply) => {
        const days = await prisma.day.findMany({
            select: {
                date: true,
                _count: {
                    select: { dayHabits: true }
                },
                dayHabits: {
                    select: {
                        // habit: true,
                        habit: {
                            select: {
                                week_days: true,
                                _count: {
                                    select: {
                                        week_days: true,
                                    },
                                }
                            }
                        }
                    },
                    // include: {
                    //     habit: true,
                    //     include: {
                    //         habit: true,
                    //     }
                    // }
                },
            },
        })
        reply.send({
            status: 200,
            data: { days }
        })
    })

    server.get('/api/habit/:id', async (request, reply) => {
        const getByIdParam = z.object({
            id: z.string(),
        })
        const { id } = getByIdParam.parse(request.params);
        const habit = await prisma.habit.findFirst({
            where: {
                id
            },
            include: { week_days: true },
        })

        reply.send({
            status: 200,
            data: { habit }
        })
    })

    server.post('/api/habits', async (request, reply) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(7)
            ),
        })

        const { title, weekDays } = createHabitBody.parse(request.body);

        const habit = await prisma.habit.create({
            data: {
                title,
                week_days: {
                    create: weekDays.map(day => ({ week_day: day }))
                },
            }
        })

        return reply.send({
            status: 201,
            data: {
                habit
            }
        })
    })

    server.get('/api/day', async (request, reply) => {
        const dayParams = z.object({
            date: z.coerce.date().optional()
        })
        const { date } = dayParams.parse(request.query)

        const parsedDate = (date ? dayjs(date) : dayjs()).startOf('day')
        const weekDay = parsedDate.get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: parsedDate.toDate()
                },
                week_days: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true,
            }
        })

        return reply.send({
            status: 200,
            data: {
                completedHabits: day?.dayHabits.map(h => h.id),
                possibleHabits
            }
        })
    })

    server.post('/api/day', async (request, reply) => {
        const createDay = z.object({
            date: z.date(),
        })

        const { date } = createDay.parse(request.body);
        const day = await prisma.day.create({
            data: {
                date
            }
        })

        return reply.send({
            status: 201,
            data: { day }
        })
    })

    server.patch('/api/habits/:id/toggle', async (request, reply) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParams.parse(request.params)
        const today = await dayjs().startOf('day').toDate()
        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                }
            }
        });

        if (!dayHabit) {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                }
            })
        } else {
            await prisma.dayHabit.delete({
                where: {
                    day_id_habit_id: {
                        day_id: day.id,
                        habit_id: id,
                    }
                }
            })
        }
    })

    server.post('/api/day_habit', async (request, reply) => {
        const createDayHabit = z.object({
            habit_id: z.string(),
            day_id: z.string(),
            remove: z.boolean()
        })

        const { habit_id, day_id, remove } = createDayHabit.parse(request.body);

        if (!remove) {
            let dayHabit = await prisma.dayHabit.findUnique({
                where: {
                    day_id_habit_id: {
                        habit_id,
                        day_id
                    }
                }
            })

            if (!dayHabit) {
                dayHabit = await prisma.dayHabit.create({
                    data: {
                        habit_id,
                        day_id,
                    }
                })
            }
            return reply.send({
                status: 201,
                data: { dayHabit }
            })

        } else {
            await prisma.dayHabit.delete({
                where: {
                    day_id_habit_id: {
                        habit_id,
                        day_id
                    }
                }
            })

            return reply.send({
                status: 204,
            })
        }
    })
}
