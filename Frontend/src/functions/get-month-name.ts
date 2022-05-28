export function getMonthName(date: Date | null) {
    const names = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "Desember",
    ];

    if (!date) {
        return "";
    }

    return names[date.getMonth()];
}
