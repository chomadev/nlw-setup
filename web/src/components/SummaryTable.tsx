import { generateDatesFromStartOfYear } from "../utils/generate-dates-from-start-of-year"
import { HabitDay } from "./HabitDay"
import dayjs from "dayjs"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const summaryDates = generateDatesFromStartOfYear()
const today = dayjs();

export function SummaryTable() {
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
                    summaryDates.map((date, i) =>
                        <HabitDay
                            key={`habitDay_${i}`}
                            isFuture={dayjs(date).isAfter(today)}
                            title="Beber agua"
                            count={3} />
                    )
                }
            </div>
        </div>
    )
}

