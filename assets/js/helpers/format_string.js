/**
 * Convert a time from milliseconds to hours, minutes, seconds.
 * @param {number} time Time in milliseconds to convert.
 * @returns A string with the time converted to hours, minutes, seconds.
 */
export function timeToString(time) {
    const seconds = time / 1000;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours >= 1) {
        return hours + " hr " + (minutes - hours * 60) + " min";
    }
    if (minutes >= 1) {
        return minutes + " min " + Math.floor(seconds - minutes * 60) + " sec";
    }
    return seconds.toFixed(2) + " sec";
}

/**
 * Convert x / y to percent and format it to 2 digits after the decimal.
 * @param {number} x The numerator.
 * @param {number} y The denominator.
 * @returns A string with the percent formatted to 2 digits after the decimal.
 */
export function toPercent(x, y) {
    return x == 0 || y == 0 ? "0.00%" : (x / y * 100).toFixed(2) + "%";
}