import {useSelector} from "react-redux";
import List from "@mui/material/List";
import * as React from "react";
import {CustomContract, SharesContract, StoredContract} from "../../../declarations/user_canister/user_canister.did";
import {logger} from "../../dev_utils/log_data";
import {CustomContract} from "../../components/contracts/custom_contract/custom_contract";


function ContractsHistory(props: any) {
    const {contracts} = useSelector((state: any) => state.filesReducer);


    return (
        <List dense>
            {Object.values(contracts).map((contract: CustomContract) => <CustomContract contract={contract}/>)}

        </List>
    );
}

export default ContractsHistory