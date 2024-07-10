import React, {useEffect} from 'react';
import {createEvent, render} from '@testing-library/react';
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


    const items = render(
        <TestWrapper store={store}>
            <CustomContractComponent contract={custom_contract}/>
        </TestWrapper>
    );


    const cellElement = items.container.querySelector(`[role="cell"]`);
    let rows = items.container.querySelectorAll(`[role="row"]`);
    expect(rows.length).toBe(2);
    if (cellElement) {
        // select item by class name add-column-left
        let addCol = document.querySelector('.add-column-left');
        expect(addCol).toBeNull();
        const contextMenuEvent = createEvent.contextMenu(cellElement);
        let addCol2 = document.querySelector('.add-column-left');
        expect(addCol2).not.toBeNull();
        createEvent.click(addCol2)
        let rows2 = items.container.querySelectorAll(`[role="row"]`);
        expect(rows2.length).toBe(3);

    } else {
        console.error(`Element with role "${role}" not found.`);
    }


});
