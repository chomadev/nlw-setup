import { generateDatesFromStartOfYear } from "../utils/generate-dates-from-start-of-year";
import { HabitDay } from "./HabitDay";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromStartOfYear();

type SummaryEntry = {
    id: string,
    date: string,
    amount: number,
    completed: number,
};

export function SummaryTable() {
    const [summary, setSummary] = useState<SummaryEntry[]>();

    useEffect(() => {
        api.get('api/summary')
            .then(response => {
                setSummary(response.data);
            })
    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {
                    weekDays.map((weekDay, i) =>
                        <div
                            key={`weekday-${i}`}
                            className="text-zinc-400 text-xl w-10 h-10 flex items-center justify-center font-bold"
                        >
                            {weekDay}
                        </div>)
                }
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {
                    summaryDates.length > 0 && summaryDates.map((date, i) => {
                        const dayInSummary = summary?.find(day => dayjs(date).isSame(day.date, 'day'))
                        return <HabitDay
                            key={`habitDay_${i}`}
                            date={date}
                            amount={dayInSummary?.amount}
                            defaultCompleted={dayInSummary?.completed} />
                    })
                }
            </div>
        </div>
    )
}

