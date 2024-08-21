import {compile, EvalFunction} from "mathjs";

interface Props {
    children: React.ReactNode;
    column: any,
    props: any,
}

function FormulaCell(props: Props) {
    const formula = props.column.formula;
    let values = props.row;
    // Object.keys(props.row).forEach(key => {
    //     values[key] = props.row[key]
    // })
    // console.log({values})
    // const contract = {};
    // const main_contract = {};
    const parsedFormula: EvalFunction = compile(formula);
    const value: any = parsedFormula.evaluate(values);

    return <>
        <div>{value}</div>
    </>
}

export default FormulaCell
