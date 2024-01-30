import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    CColumn,
    CPayment,
    Execute,
    Formula,
    Operation,
    Trigger
} from '../../../../declarations/user_canister/user_canister.did';
import {GridColumnMenuItemProps} from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import BasicPopover from "../../genral/pop_over";
import {Principal} from "@dfinity/principal";
import {randomString} from "../../../data_processing/data_samples";
import CodeEditor from "./formula_parser/code_editor";
import {updateContractColumn} from "./utls";
import useParser from "./formula_parser/parser";


function ChangeColumnFormula(props: GridColumnMenuItemProps) {

    let column_id = props.colDef.id;
    const {view, contract, menuProps} = props;

    const {parser, addVarsToParser, FORMULA} = useParser({...props});

    const [value, setValue] = React.useState<Formula | undefined>(undefined);
    // console.log(props.colDef)
    const [formatter, setFormatter] = React.useState<string>(String(props.colDef["formula_string"]))


    const onFormatter = (code: string) => {
        setFormatter(code);
        // let formula: Formula = {
        //     'trigger_target': column_id,
        //     'trigger': Trigger,
        //     'operation': Operation,
        //     'column_id': string,
        //     'execute': Execute,
        // }
        // setValue(formula);
    };
    const onCLickAway = () => {

        // props.colDef.valueGetter = (params: any) => {
        //     addVarsToParser(parser, params, view);
        //     return parser.parse(formatter).result
        // };

        let result = parser.parse(formatter).result
        console.log({result, FORMULA})

        // if (value) {
        //
        //     //     props.setContract((prevContract) => {
        //     //             let formulas;
        //     //             let old_formula = prevContract.formulas.find((f) => f.column_id == value.column_id)
        //     //             if (old_formula) {
        //     //                 formulas = prevContract.formulas.map((f: Formula) => {
        //     //                     if (f.column_id == value.column_id) {
        //     //                         return value
        //     //                     }
        //     //                     return f
        //     //                 })
        //     //             } else {
        //     //                 formulas = [...prevContract.formulas, value]
        //     //             }
        //     //             return {...prevContract, formulas}
        //     //         }
        //     //     )
        //     //     ;
        //     //     setValue(undefined)
        //     // }
        //     if (formatter) {
        //         let updated_column: CColumn = {
        //             ...props.colDef,
        //             formula_string: String(formatter)
        //         };
        //         props.setContract((prevContract) => {
        //             return updateContractColumn(prevContract, updated_column, props.view)
        //         })
        //     }
        // }

        if (formatter) {
            let updated_column: CColumn = {
                ...props.colDef,
                formula_string: String(formatter)
            };
            props.setContract((prevContract) => {
                return updateContractColumn(prevContract, updated_column, props.view)
            })
        }
    }

    return (
        <MenuItem>
            <BasicPopover
                style={{minWidth: '500px'}}
                onClickAway={onCLickAway}
                content={<CodeEditor onChange={onFormatter} code={formatter}/>}
            >Formula</BasicPopover>
        </MenuItem>
    );

}

export default ChangeColumnFormula;

