interface HabitProps {
    title: string
    count: number
    isFuture: boolean
}
export function HabitDay(props: HabitProps) {
    return <div className={`w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg ${props.isFuture && "opacity-40"}`}>

    </div>
}