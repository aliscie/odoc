function formatTimestamp(timestampNanoseconds: bigint) {
    // Convert nanoseconds to milliseconds (1 second = 1,000,000,000 nanoseconds)
    const timestampMilliseconds = Number(timestampNanoseconds) / 1e6;

    // Create a Date object using the timestamp in milliseconds
    const date = new Date(timestampMilliseconds);

    // Format the date as a string
    const formattedDate = date.toLocaleString(); // Adjust formatting as needed

    return formattedDate;
}

export function formatRelativeTime(timestampNanoseconds: bigint): string {
    const timestampMilliseconds = Number(timestampNanoseconds) / 1e6;
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - timestampMilliseconds;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 4);
    const years = Math.floor(months / 12);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
}


export default formatTimestamp;
