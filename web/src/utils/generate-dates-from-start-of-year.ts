import dayjs from 'dayjs'

export function generateDatesFromStartOfYear() {
    const firstDayOfYear = dayjs().startOf('year')
    const today = dayjs().endOf('month')

    const dates: Date[] = []
    let compareDate = firstDayOfYear

    while (compareDate.isBefore(today)) {
        dates.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
    }

    return dates
}