import React from 'react';
// import {CustomContractComponent} from "../../../components/contracts/custom_contract/custom_contract";
// import {createCContract} from "../../../components/contracts/custom_contract/utls";
// import {CContract} from "../../../../declarations/backend/backend.did";
// import {newContract} from "../../backend/data_samples";
// import {createCContract} from "../../../components/ContractTable/utils";
import {CustomContractComponent} from "../../../components/ContractTable";
// import {custom_contract} from "../../../DataProcessing/dataSamples";
// import {CustomContractComponent} from "../../../components/ContractTable";

export interface ButtonProps {
    /**
     * Is this the principal call to action on the page?
     */
    primary?: boolean;
    /**
     * What background color to use
     */
    backgroundColor?: string;
    /**
     * How large should the button be?
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Button contents
     */
    label: string;
    /**
     * Optional click handler
     */
    onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Contract = ({
                             primary = false,
                             size = 'medium',
                             backgroundColor,
                             label,
                             ...props
                         }: ButtonProps) => {

    // const {custom_contract, promise} = newContract();

    // custom_contract.creator = global.user.getPrincipal();
    // let new_c_contract: CContract = createCContract();
    // custom_contract.creator = global.user.getPrincipal();
    // new_c_contract.rows[0].cells[0].value = "INIT VALUE"
    // custom_contract.contracts = [new_c_contract];


    // const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

    return (<CustomContractComponent/>)
};
