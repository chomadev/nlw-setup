import * as Checkbox from "@radix-ui/react-checkbox";
import * as PopOver from "@radix-ui/react-popover"
import clsx from "clsx";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { AxiosResponse } from "axios"
import { ProgressBar } from "./ProgressBar"

interface HabitProps {
    date: Date
    completed: number
    amount: number
}

interface Habit {
    id: string,
    title: string,
    created_at: Date
}

interface HabitRequest {
    data: {
        possibleHabits: Array<Habit>,
        completedHabits?: Array<string>
    }
}

export function HabitDay({ date, completed, amount }: HabitProps) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const completionLevel = amount > 0 ? Math.floor(completed / amount) * 100 : 0;

    const dayAndMonth = dayjs(date).format('DD/MM');
    const dayOfWeek = dayjs(date).format('dddd');

    const isFuture = dayjs().isBefore(date);

    const loadHabits = (open: boolean) => {
        if (open) {
            api.get('/api/day', {
                params: {
                    date
                }
            }).then((response: AxiosResponse<HabitRequest>) => {
                    const { possibleHabits, completedHabits } = response.data.data;
                    setHabits(possibleHabits)
                })
        }
    }

    return (
        <PopOver.Root onOpenChange={loadHabits}>
            <PopOver.Trigger
                className={clsx(`w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg ${isFuture && "opacity-25"}`, {
                    'bg-violet-900 border-violet-700': completionLevel > 0 && completionLevel < 20,
                    'bg-violet-800 border-violet-600': completionLevel >= 20 && completionLevel < 40,
                    'bg-violet-700 border-violet-500': completionLevel >= 40 && completionLevel < 60,
                    'bg-violet-600 border-violet-500': completionLevel >= 60 && completionLevel < 80,
                    'bg-violet-500 border-violet-400': completionLevel >= 80,
                })} />
            <PopOver.Portal>
                <PopOver.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
                    <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
                    <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>
                    <ProgressBar progress={70} />

                    {habits && habits.map(habit => (
                        <div className="mt-6 flex flex-col gap-3"
                            key={habit.id}
                        >
                            <Checkbox.Root
                                className="flex items-center gap-3 group"
                            >
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
                                    <Checkbox.Indicator>
                                        <Check size={20} className="text-white" />
                                    </Checkbox.Indicator>
                                </div>
                                <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                                    {habit.title}
                                </span>
                            </Checkbox.Root>
                        </div>
                    ))}
                    <PopOver.Arrow height={8} width={16} className="fill-zinc-900" />
                </PopOver.Content>
            </PopOver.Portal>
        </PopOver.Root>
    )
}