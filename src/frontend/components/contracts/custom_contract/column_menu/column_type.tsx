import React from 'react';
import {CColumn, CContract, CustomContract} from '../../../../../declarations/backend/backend.did';
import {updateContractColumn} from "../utls";
import BasicMenu from "../../../genral/drop_down";
import {logger} from "../../../../dev_utils/log_data";
import {PROMISES} from "../types";

enum ColumnType {
    User = "user",
    Number = "number",
    String = "string",
    Date = "date",
};

const types: string[] = [ColumnType.User, ColumnType.Number, ColumnType.String, ColumnType.Date];

interface Props {
    type: ColumnType;
    current_contract: CContract;


}

function ChangeType(props: Props) {
    const {view, colDef, updateContract, current_contract, contract} = props;

    if (view?.type == PROMISES && ['amount', 'sender', 'receiver', 'status'].includes(colDef.field)) {
        return null
    }


    let state: string = colDef.column_type || ColumnType.String;

    const mainOptions: any[] = types.map((type: string) => {
        return {content: type, value: type}
    })
    const selectOption = async (option: any) => {

        const updatedColumn: CColumn = {...colDef, column_type: option.content};
        const updatedContract: CustomContract = updateContractColumn(contract, updatedColumn, current_contract);
        updateContract(updatedContract);

        state = option.content;
    };

    return (
        <BasicMenu SelectOption={selectOption} options={mainOptions}>
            Type:{state}
        </BasicMenu>
    );
};

export default ChangeType;
