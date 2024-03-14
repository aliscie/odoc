import {useSelector} from "react-redux";
import List from "@mui/material/List";
import * as React from "react";
import {CustomContractComponent} from "../../components/contracts/custom_contract/custom_contract";


function ContractsHistory(props: any) {
    const {contracts} = useSelector((state: any) => state.filesReducer);


    return (
        <List dense>
            {Object.values(contracts).map((contract: CustomContractComponent) => <CustomContractComponent contract={contract}/>)}

        </List>
    );
}

export default ContractsHistory