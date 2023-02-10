import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const drinkWaterHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const drinkWaterCreationDate = new Date('2022-12-31T03:00:00.000')

const exerciseHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const exerciseHabitCreationDate = new Date('2023-01-03T03:00:00.000')

const sleepHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const sleepHabitCreationDate = new Date('2023-01-08T03:00:00.000')

async function run() {
  await prisma.habit.deleteMany()
  await prisma.day.deleteMany()

  /**
   * Create habits
   */
  await Promise.all([
    prisma.habit.create({
      data: {
        id: drinkWaterHabitId,
        title: 'Beber 2L água',
        created_at: drinkWaterCreationDate,
        week_days: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
          ]
        }
      }
    }),

    prisma.habit.create({
      data: {
        id: exerciseHabitId,
        title: 'Exercitar',
        created_at: exerciseHabitCreationDate,
        week_days: {
          create: [
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    }),

    prisma.habit.create({
      data: {
        id: sleepHabitId,
        title: 'Dormir 8h',
        created_at: sleepHabitCreationDate,
        week_days: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    })
  ])

  await Promise.all([
    /**
     * Habits (Complete/Available): 1/1
     */
    prisma.day.create({
      data: {
        /** Monday */
        date: new Date('2023-01-02T03:00:00.000z'),
        dayHabits: {
          create: {
            habit_id: drinkWaterHabitId,
          }
        }
      }
    }),

    /**
     * Habits (Complete/Available): 1/1
     */
    prisma.day.create({
      data: {
        /** Friday */
        date: new Date('2023-01-06T03:00:00.000z'),
        dayHabits: {
          create: {
            habit_id: exerciseHabitId,
          }
        }
      }
    }),

    /**
     * Habits (Complete/Available): 2/2
     */
    prisma.day.create({
      data: {
        /** Wednesday */
        date: new Date('2023-01-04T03:00:00.000z'),
        dayHabits: {
          create: [
            { habit_id: drinkWaterHabitId },
            { habit_id: exerciseHabitId },
          ]
        }
      }
    }),
  ])
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })