import React from 'react';
import store from "../../../redux/main";
import {CustomContractComponent} from "../../../components/contracts/custom_contract/custom_contract";
import TestWrapper from "../../utils/tests_wrapper";
import {newContract} from "../../backend/data_samples";
import {CContract} from "../../../../declarations/backend/backend.did";
import {createCContract} from "../../../components/contracts/custom_contract/utls";

interface ContractProps {

}

/**
 * Primary UI component for user interaction
 */
export const CustomContractStory = ({}: ContractProps) => {
    const {custom_contract, promise} = newContract();

    // custom_contract.creator = global.user.getPrincipal();
    let new_c_contract: CContract = createCContract();
    // custom_contract.creator = global.user.getPrincipal();
    new_c_contract.rows[0].cells[0].value = "INIT VALUE"
    custom_contract.contracts = [new_c_contract];

    return (
        <TestWrapper store={store}>
            <CustomContractComponent contract={custom_contract}/>
        </TestWrapper>
    );
};
