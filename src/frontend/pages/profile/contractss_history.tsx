import {useDispatch, useSelector} from "react-redux";
import List from "@mui/material/List";
import * as React from "react";
import {CustomContractComponent} from "../../components/contracts/custom_contract/custom_contract";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import {custom_contract} from "../../data_processing/data_samples";
import {Principal} from "@dfinity/principal";
import {StoredContract} from "../../../declarations/backend/backend.did";
import {handleRedux} from "../../redux/main";


function ContractsHistory(props: any) {
    const dispatch = useDispatch();
    const {contracts, profile} = useSelector((state: any) => state.filesReducer);
    const handleClick = () => {
        custom_contract.creator = Principal.fromText(profile.id)
        custom_contract.date_created = Date.now() * 1e6
        let stored_custom: StoredContract = {"CustomContract": custom_contract}
        dispatch(handleRedux("ADD_CONTRACT", {contract: custom_contract}))
        dispatch(handleRedux("CONTRACT_CHANGES", {changes: stored_custom}));
    }

    return (
        <List dense>
            <Button
                onClick={handleClick}
                variant={'outlined'}
            >Create new contract</Button>
            {
                Object.values(contracts).map((contract: CustomContractComponent | any) => {
                    if (contract.contracts) {
                        return <ListItem>
                            <CustomContractComponent contract={contract}/>
                        </ListItem>
                    }
                })
            }

        </List>
    );
}

export default ContractsHistory
