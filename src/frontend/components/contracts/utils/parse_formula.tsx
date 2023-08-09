import {GridValueGetterParams} from "@mui/x-data-grid";
import {Parser} from "hot-formula-parser";

export function getFormula(tableParams: GridValueGetterParams, formula: string) {
    let parser = new Parser();

    parser.setFunction("COL", (params: any) => {
        let res = tableParams.row[params[0]];
        return Number(res) || String(res);
    });

    let res = parser.parse(formula);
    return res.error || res.result;
}