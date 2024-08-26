import {useDispatch, useSelector} from "react-redux";
import List from "@mui/material/List";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import {Principal} from "@dfinity/principal";
import {CustomContractComponent} from "../../components/ContractTable";
import {custom_contract, randomString} from "../../DataProcessing/dataSamples";
import {handleRedux} from "../../redux/store/handleRedux";
import {CustomContract} from "../../../declarations/backend/backend.did";


function ContractsHistory(props: any) {
    const dispatch = useDispatch();
    const {contracts, profile} = useSelector((state: any) => state.filesState);
    const handleClick = () => {
        let newContract = {
            ...custom_contract,
            id:randomString(),
            creator: profile && Principal.fromText(profile.id),
            date_created: Date.now() * 1e6
        }
        dispatch(handleRedux("ADD_CONTRACT", {contract: newContract}));
    }
    return (
        <List dense>
            <Button
                onClick={handleClick}
                variant={'outlined'}
            >Create new contract</Button>
            {
                Object.values(contracts).map((contract: CustomContract | any) => {
                    if (contract) {
                        return <ListItem><CustomContractComponent contract={contract}/></ListItem>
                    }
                })
            }
        </List>
    );
}

export default ContractsHistory
