export function getMinutes(startDate, endDate) {
    if (startDate && endDate) {
        var diff = endDate.getTime() - startDate.getTime();
        return (diff / 60000);
    } else {
        return 0;
    }
}