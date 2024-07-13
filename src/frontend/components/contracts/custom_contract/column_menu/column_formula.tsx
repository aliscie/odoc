import React from 'react';
import {CColumn, CContract, CustomContract, StoredContract} from '../../../../../declarations/backend/backend.did';
import CodeEditor from "../formula_parser/code_editor";
import {PROMISES_CONTRACT_FIELDS, updateContractColumn} from "../utls";
import {useDispatch} from "react-redux";
import CustomDialog from "../../../genral/custom_dialog";
import {handleRedux} from "../../../../redux/main";
import {PROMISES} from "../types";

interface Props {
    updateContract: (content: CustomContract) => void;
    current_contract: CContract;
    colDef: CColumn;
    contract: CustomContract;


}

function ChangeColumnFormula(props: Props) {
    const {view, current_contract, colDef, contract, updateContract} = props;
    if (view?.type == PROMISES && PROMISES_CONTRACT_FIELDS.includes(colDef.field)) {
        return null
    }

    // const {evaluate, addVarsToParser} = useParser({contract: current_contract});
    const dispatch = useDispatch();
    const formatter = String(colDef["formula_string"]);
    let code = "";
    const handleSave = () => {
        // let [_, promises]: [Array<CColumn>, Array<CPayment>] = serialize_contract_column(current_contract, addVarsToParser, evaluate)
        // TODO
        //     const amount = ev.formula?.amount || 0;
        //     if (wallet.balance < amount) {
        //         enqueueSnackbar("Insufficient balance.", {variant: "error"});
        //         return;
        //     }
        // console.log({promises});
        if (code !== colDef.formula_string) {
            const updatedColumn: CColumn = {...colDef, formula_string: String(code)};
            const updatedContract: CustomContract = updateContractColumn(contract, updatedColumn, current_contract);
            // const updated_promises = [...updatedContract.promises.filter((p) => !promises.map((p) => p.id).includes(p.id)), ...promises];
            // console.log({promises});
            // const updated_promises = [...updatedContract.promises.filter((p) => !promises.map((p) => p.id).includes(p.id)), ...promises];
            // updateContract({...updatedContract, promises: updated_promises});
            // updateContract({...updatedContract});
            const storedContract: StoredContract = {CustomContract: updatedContract};
            dispatch(handleRedux("UPDATE_CONTRACT", {contract: storedContract}));
            dispatch(handleRedux("CONTRACT_CHANGES", {changes: storedContract}));
        }

    };
    const content = <CodeEditor onChange={(c) => {
        code = c;
        // console.log("code is here:  "+code);
        // setFormatter(code);
        // dispatch(handleRedux("TOP_DIALOG", {...top_dialog, code: code}));
    }} code={formatter}/>;

    return (
        <CustomDialog handleSave={handleSave} content={content}>
            Formula
        </CustomDialog>
    );
}

export default ChangeColumnFormula;
