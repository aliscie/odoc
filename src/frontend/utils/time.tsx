function formatTimestamp(timestampNanoseconds: bigint) {
    // Convert nanoseconds to milliseconds (1 second = 1,000,000,000 nanoseconds)
    const timestampMilliseconds = Number(timestampNanoseconds) / 1e6;

    // Create a Date object using the timestamp in milliseconds
    const date = new Date(timestampMilliseconds);

    // Format the date as a string
    const formattedDate = date.toLocaleString(); // Adjust formatting as needed

    return formattedDate;
}


// export function getCurrentTimeZone() {
//     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     return timeZone;
// }

// export function convertUtcToTimeZone(utcTimestamp, targetTimeZone = getCurrentTimeZone()) {
//     console.log({targetTimeZone})
//     // Convert UTC timestamp to Date object
//     const utcDate = new Date(utcTimestamp);
//
//     // Get target time zone offset
//     const targetTimeZoneOffset = utcDate.getTimezoneOffset();
//
//     // Calculate the target time by adding the target time zone offset
//     const targetDate = new Date(utcDate.getTime() + (targetTimeZoneOffset * 60 * 1000));
//
//     // Format the date as a string in the target time zone
//     const formattedDate = targetDate.toLocaleString('en', {timeZone: targetTimeZone});
//
//     return formattedDate;
// }


export default formatTimestamp;
