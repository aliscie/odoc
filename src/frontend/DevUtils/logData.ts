import chalk from 'chalk';

export function logger(data: any) {
    const jsonStringifiableData = JSON.parse(
        JSON.stringify(data, (key, value) => {
            if (typeof value === "bigint") {
                return value.toString();
            }
            return value;
        }),
    );

    // Stringify the JSON data with the BigInt values as strings
    const jsonString = JSON.stringify(jsonStringifiableData, null, 2);

    // Create a styled console log
    console.log("---------------logger---------------" + '\ln' + chalk.green(jsonString));
}
