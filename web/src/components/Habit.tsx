interface HabitProps {
    title: string
    count: number
}
export function Habit(props: HabitProps) {
    return <p className="bg-zinc-900 w-10 h-10 text-white rounded m-2 text-center flex items-center justify-center" title={props.title}>{props.count}</p>
}