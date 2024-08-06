import {useSelector} from "react-redux";
import List from "@mui/material/List";
import * as React from "react";
import {CustomContractComponent} from "../../components/Contracts/CustomContract/CustomContract";
import SharesContractComponent from "../../components/Contracts/SharesContract";
import {shares_contract} from "../../data_processing/data_samples";
import {Divider} from "@mui/material";
import ListItem from "@mui/material/ListItem";


function ContractsHistory(props: any) {
    const {contracts} = useSelector((state: any) => state.filesReducer);

    return (
        <List dense>
            {Object.values(contracts).map((contract: CustomContractComponent | any) => {
                if (contract.contracts) {
                    return <ListItem>
                        <CustomContractComponent contract={contract}/>
                    </ListItem>
                } else {
                    let c = {...shares_contract, contract_id: contract.contract_id}
                    return <ListItem>
                        <SharesContractComponent {...c} />
                    </ListItem>
                }

            })}

        </List>
    );
}

export default ContractsHistory
