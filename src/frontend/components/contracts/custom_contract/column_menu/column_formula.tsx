import React, {useEffect, useState} from 'react';
import {
    CColumn,
    CContract,
    CPayment,
    CustomContract, StoredContract
} from '../../../../../declarations/user_canister/user_canister.did';
import CodeEditor from "../formula_parser/code_editor";
import {
    serialize_contract_column,
    updateCContractColumn,
    updateContractColumn
} from "../utls";
import useParser from "../formula_parser/use_parser";
import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import CustomDialog from "../../../genral/custom_dialog";
import {logger} from "../../../../dev_utils/log_data";
import {handleRedux} from "../../../../redux/main";

interface Props {
    updateContract: (content: CustomContract) => void;
    current_contract: CContract;
    colDef: CColumn;
    contract: CustomContract;


}

function ChangeColumnFormula(props: Props) {
    const {enqueueSnackbar} = useSnackbar();
    const {wallet} = useSelector((state: any) => state.filesReducer);
    const {current_contract, colDef, contract, updateContract} = props;
    // const {evaluate, addVarsToParser} = useParser({contract: current_contract});
    const dispatch = useDispatch();
    const [formatter, setFormatter] = useState<string>(String(colDef["formula_string"]));

    const onFormatter = (code: string) => setFormatter(code);
    const handleSave = () => {
        // let [_, promises]: [Array<CColumn>, Array<CPayment>] = serialize_contract_column(current_contract, addVarsToParser, evaluate)
        // TODO
        //     const amount = ev.formula?.amount || 0;
        //     if (wallet.balance < amount) {
        //         enqueueSnackbar("Insufficient balance.", {variant: "error"});
        //         return;
        //     }
        // console.log({promises});
        if (formatter !== colDef.formula_string) {
            const updatedColumn: CColumn = {...colDef, formula_string: String(formatter)};
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

    return (
        <CustomDialog handleSave={handleSave} content={<CodeEditor onChange={onFormatter} code={formatter}/>}>
            Formula
        </CustomDialog>
    );
}

export default ChangeColumnFormula;
