import React from 'react';
import {CColumn, CContract, CustomContract} from '../../../../../declarations/user_canister/user_canister.did';
import {updateContractColumn} from "../utls";
import BasicMenu from "../../../genral/drop_down";

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
    const {colDef, updateContract, current_contract, contract} = props;
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
            {state}
        </BasicMenu>
    );
};

export default ChangeType;
