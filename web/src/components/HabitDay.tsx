import * as PopOver from "@radix-ui/react-popover"
import clsx from "clsx";
import dayjs from "dayjs";
import { ProgressBar } from "./ProgressBar"
import { HabitsList } from "./HabitsList";
import { useState } from "react";

interface HabitProps {
    date: Date
    defaultCompleted?: number
    amount?: number
}

export function HabitDay({ date, defaultCompleted = 0, amount = 0 }: HabitProps) {
    const [completed, setCompleted] = useState(defaultCompleted);
    const completionLevel = amount > 0 ? Math.round((completed / amount) * 100) : 0;

    const dayAndMonth = dayjs(date).format('DD/MM');
    const dayOfWeek = dayjs(date).format('dddd');

    const isFuture = dayjs().isBefore(date);

    function handleCompletedChanged(completed: number) {
        setCompleted(completed);
    }

    if (amount === 0) console.log(completionLevel);

    return (
        <PopOver.Root>
            <PopOver.Trigger
                className={clsx(`w-10 h-10 rounded-lg ${isFuture && "bg-zinc-900 border border-zinc-900"}`, {
                    'bg-zinc-900 border-zinc-800': completionLevel === 0,
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
                    <ProgressBar progress={completionLevel} />

                    <HabitsList date={date} onCompletedChanged={handleCompletedChanged} />
                    
                    <PopOver.Arrow height={8} width={16} className="fill-zinc-900" />
                </PopOver.Content>
            </PopOver.Portal>
        </PopOver.Root>
    )
}