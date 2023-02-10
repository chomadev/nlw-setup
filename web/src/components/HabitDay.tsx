import * as PopOver from "@radix-ui/react-popover"
import clsx from "clsx";
import { ProgressBar } from "./ProgressBar"

interface HabitProps {
    title: string
    completed: number
    amount: number
    isFuture: boolean
}

export function HabitDay({ completed, amount, isFuture, title }: HabitProps) {
    const completionLevel = Math.floor(completed / amount) * 100;
    return (
        <PopOver.Root>
            <PopOver.Trigger
                className={clsx(`w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg ${isFuture}`, {
                    'bg-violet-900 border-violet-700': completionLevel > 0 && completionLevel < 20,
                    'bg-violet-800 border-violet-600': completionLevel >= 20 && completionLevel < 40,
                    'bg-violet-700 border-violet-500': completionLevel >= 40 && completionLevel < 60,
                    'bg-violet-600 border-violet-500': completionLevel >= 60 && completionLevel < 80,
                    'bg-violet-500 border-violet-400': completionLevel >= 80,
                })} />
            <PopOver.Portal>
                <PopOver.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
                    <span className="font-semibold text-zinc-400">segunda-feira</span>
                    <span className="mt-1 font-extrabold leading-tight text-3xl">16/01</span>
                    <ProgressBar progress={70} />
                    <PopOver.Arrow height={8} width={16} className="fill-zinc-900" />
                </PopOver.Content>
            </PopOver.Portal>
        </PopOver.Root>
    )
}