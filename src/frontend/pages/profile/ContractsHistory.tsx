import {useDispatch, useSelector} from "react-redux";
import List from "@mui/material/List";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import {Principal} from "@dfinity/principal";
import {StoredContract} from "../../../declarations/backend/backend.did";
import {CustomContractComponent} from "../../components/ContractTable";
import {custom_contract} from "../../DataProcessing/dataSamples";
import {handleRedux} from "../../redux/store/handleRedux";


function ContractsHistory(props: any) {
    const dispatch = useDispatch();
    const {contracts, profile} = useSelector((state: any) => state.filesReducer);
    const handleClick = () => {
        custom_contract.creator = Principal.fromText(profile.id)
        custom_contract.date_created = Date.now() * 1e6
        let stored_custom: StoredContract = {"CustomContract": custom_contract}
        dispatch(handleRedux("ADD_CONTRACT", {contract: custom_contract}))
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
