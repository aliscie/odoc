function replacer(key: string, value: any) {
    if (typeof value === "bigint") {
        return value.toString(); // Convert BigInt to string
    }
    return value;
}

export function logger(data: any) {
    console.log("---------------logger---------------");
    console.log(JSON.stringify(data, replacer));
}