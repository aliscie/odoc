import React, {useState} from 'react';
import {CColumn, CContract, CustomContract} from '../../../../../declarations/user_canister/user_canister.did';
import CodeEditor from "../formula_parser/code_editor";
import {serialize_contract_column, updateCContractColumn, updateContractColumn} from "../utls";
import useParser from "../formula_parser/use_parser";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import CustomDialog from "../../../genral/custom_dialog";

interface Props {
    updateContract: (content: CustomContract) => void;
    setView: (view: any) => void;
    view: CContract;
    colDef: CColumn;
    contract: CustomContract;


}

function ChangeColumnFormula(props: Props) {
    const {enqueueSnackbar} = useSnackbar();
    const {wallet} = useSelector((state: any) => state.filesReducer);
    const {view, colDef, contract, updateContract, setView} = props;
    const {evaluate, addVarsToParser, ref} = useParser({contract: view});
    const [formatter, setFormatter] = useState<string>(String(colDef["formula_string"]));

    const onFormatter = (code: string) => setFormatter(code);

    const handleSave = () => {
        const ev = evaluate(formatter);
        const amount = ev.formula?.amount || 0;

        if (wallet.balance < amount) {
            enqueueSnackbar("Insufficient balance.", {variant: "error"});
            return;
        }

        if (formatter !== colDef.formula_string) {
            const updatedColumn: CColumn = {...colDef, formula_string: String(formatter)};
            const updatedContract: CustomContract = updateContractColumn(contract, updatedColumn, view);
            updatedContract.promises = updatedContract.promises.filter((p) => !ref.current.map((p) => p.id).includes(p.id));
            updatedContract.promises.push(...ref.current);
            updateContract(updatedContract);

            const updatedView = updateCContractColumn(view, updatedColumn);
            const serializedColumns = serialize_contract_column(updatedView, addVarsToParser, evaluate);
            setView((prev) => ({...prev, columns: serializedColumns}));
        }
    };

    return (
        <CustomDialog handleSave={handleSave} content={<CodeEditor onChange={onFormatter} code={formatter}/>}>
            Formula
        </CustomDialog>
    );
}

export default ChangeColumnFormula;
