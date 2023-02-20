import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { api } from "../lib/axios";
import { AxiosResponse } from "axios"
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface HabitListProps {
    date: Date;
    onCompletedChanged: (amount: number) => void;
}

interface Habit {
    id: string,
    title: string,
    created_at: Date
}

interface HabitRequest {
    data: {
        possibleHabits: Array<Habit>,
        completedHabits: Array<string>
    }
}

export function HabitsList({ date, onCompletedChanged } : HabitListProps) {
    const [possibleHabits, setPossibleHabits] = useState<Habit[]>([]);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    useEffect(() => {
        api.get('/api/day', {
            params: {
                date: date.toISOString()
            }
        }).then((response: AxiosResponse<HabitRequest>) => {
            const { possibleHabits, completedHabits } = response.data.data;
            setPossibleHabits(possibleHabits);
            setCompletedHabits(completedHabits);
        })
    }, []);

    const markHabitAsCompleted = (id: string) => {
        api.patch(`api/habits/${id}/toggle`, { date }).then(() => {
            let newCompletedHabits: string[] = [];
            if (completedHabits.includes(id)) {
                newCompletedHabits = completedHabits.filter(completedHabitId => completedHabitId !== id);
            } else {
                newCompletedHabits = [...completedHabits, id];
            }
            setCompletedHabits(newCompletedHabits);
            onCompletedChanged(newCompletedHabits.length)
        });
    };

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

    return (<>
        {possibleHabits && possibleHabits.map(habit => (
            <div className="mt-6 flex flex-col gap-3"
                key={habit.id}
            >
                <Checkbox.Root
                    className="flex items-center gap-3 group"
                    checked={completedHabits.includes(habit.id)}
                    // disabled={isDateInPast}
                    onCheckedChange={(e) => markHabitAsCompleted(habit.id)}
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
    </>)
}