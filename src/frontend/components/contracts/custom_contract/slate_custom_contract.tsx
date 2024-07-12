import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {CustomContract, StoredContract} from "../../../../declarations/backend/backend.did";
import {actor} from "../../../App";
import {handleRedux} from "../../../redux/main";
import {CustomContractComponent} from "./custom_contract";

export default function SlateCustomContract(props: any) {
    const {contracts, current_file} = useSelector((state: any) => state.filesReducer);
    // const contract: CustomContract = contracts[props.id];
    const dispatch = useDispatch();
    const [contract, setContract] = useState<CustomContract>(contracts[props.id]);
    useEffect(() => {


        (async () => {

            // if (window.location.pathname.split("/").pop() === "share") {
            if (!contract) {
                let contract: undefined | { Ok: StoredContract } | { Err: string } = actor && current_file && await actor.get_contract(current_file.author, props.id);
                if (contract && "Ok" in contract) {
                    setContract(contract.Ok.CustomContract);
                    dispatch(handleRedux("UPDATE_CONTRACT", {contract: contract.Ok}));
                }
            } else {
                setContract(contracts[props.id]);

            }
        })()
    }, [contracts])

    return (contracts && <CustomContractComponent contract={contract}/>);
}