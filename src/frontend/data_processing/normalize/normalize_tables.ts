function random_id() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function process_row(rows) {
    let res = []
    rows.map((data) => {
        let column = {}
        data.map((row) => {
            let cell = {};
            let name = row[0];
            let value = row[1];
            column[name] = value;
            column["id"] = random_id();

        })
        res.push(column);
    })
    return res

}