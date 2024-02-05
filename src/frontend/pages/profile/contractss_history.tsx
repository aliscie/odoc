import {useSelector} from "react-redux";
import List from "@mui/material/List";
import * as React from "react";
import {StoredContract} from "../../../declarations/user_canister/user_canister.did";


function ContractsHistory(props: any) {
    const {contracts} = useSelector((state: any) => state.filesReducer);


    return (
        <List dense
        >
            {Object.keys(contracts).map((key) => {
                let contract: StoredContract = contracts[key];
                if (contract.SharesContract) {
                    return <div>render share contract</div>
                    // return <SharesContractComponent id={key} {...contract}/>
                } else if (contract.CustomContract) {
                    return <div>render custom contract</div>
                } else {
                    return <div>Unknown</div>
                }
            })};

        </List>
    );
}

export default ContractsHistory