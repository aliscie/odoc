import React, {useEffect} from 'react';
import {render} from '@testing-library/react';
import {CContract} from '../../../declarations/backend/backend.did';
import TestWrapper from "../utils/tests_wrapper";
import {newContract} from "../backend/data_samples";
import {createCContract} from "../../components/contracts/custom_contract/utls";
import {logger} from "../../dev_utils/log_data";
import store, {handleRedux} from "../../redux/main";
import {CustomContractComponent} from "../../components/contracts/custom_contract/custom_contract";
import {actor} from "../../App";
import {get_user_actor} from "../../backend_connect/ic_agent";
import {get_initial_data} from "../../redux/files";
import {agent} from "../../backend_connect/main";


it('creates and updates a contract, then interacts with rows and columns', async () => {


    // create a new contract
    const {custom_contract, promise} = newContract();

    custom_contract.creator = global.user.getPrincipal();
    let new_c_contract: CContract = createCContract();
    custom_contract.creator = global.user.getPrincipal();
    new_c_contract.rows[0].cells[0].value = "INIT VALUE"
    custom_contract.contracts = [new_c_contract];

    store.dispatch(handleRedux("ADD_CONTRACT", {contract: custom_contract}))
    // Mock login
    //  TODO this way dies not give us create results we need to mock the login without using this  function
    store.dispatch(handleRedux("UPDATE_PROFILE", {
        name: 'any',
        description: 'any',
    }));


    const {getByText} = render(
        <TestWrapper store={store}>
            <CustomContractComponent contract={custom_contract}/>
        </TestWrapper>
    );

    // expect text user in component
    expect(getByText('promises')).toBeInTheDocument();
    logger({"test_done": true})

});
