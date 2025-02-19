const microsecondsToDate = (time) => {
  return new Date(Number(time) / 1e6);
};
const formatTime = (time: bigint, hour12 = false): string => {
  const date = new Date(Number(time) / 1e6); // Convert microseconds to milliseconds
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  });
};

const parseTime = (timeStr: string): bigint => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return BigInt(date.getTime() * 1e3); // Changed from *1000 to *1e3 (since we're starting from milliseconds)
};
export { formatTime, parseTime, microsecondsToDate };
