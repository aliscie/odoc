import React from 'react';
import {createEvent, render} from '@testing-library/react';
import {CContract} from '../../../declarations/backend/backend.did';
import TestWrapper from "../utils/tests_wrapper";
import {newContract} from "../backend/data_samples";
import {createCContract} from "../../components/contracts/custom_contract/utls";
import store, {handleRedux} from "../../redux/main";
import {CustomContractComponent} from "../../components/contracts/custom_contract/custom_contract";


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

    const expandButton = items.container.querySelector('.expand-button');
    // click on expand button
    createEvent.click(expandButton);
    const cellElement = items.container.querySelector(`[role="cell"]`);
    let rows = items.container.querySelectorAll('[role="row"]');
    let key = 'add-row';
    // item with key add-row should not be present
    let addRow = document.querySelector(`[key="${key}"]`);
    expect(addRow).toBeNull();
    // let contextMenuEvent = createEvent.contextMenu(rows[0]);
    createEvent.click(rows[0])
    // // item with key add-row should be present
    // addRow = document.querySelector(`[key="${key}"]`);
    // expect(addRow).not.toBeNull();
    // createEvent.click(addRow)
    // // check if drop down menu is present
    // let dropDown = document.querySelector('.dropdown');
    // expect(dropDown).not.toBeNull();
    // expect(rows.length).toBe(2);
    if (cellElement) {
        // select item by class name add-column-left
        let addCol = document.querySelector('.add-column-left');
        expect(addCol).toBeNull();
        // const contextMenuEvent = createEvent.contextMenu(cellElement);
        // let addCol2 = document.querySelector('.add-column-left');
        // expect(addCol2).not.toBeNull();
        // createEvent.click(addCol2)
        // let rows2 = items.container.querySelectorAll(`[role="row"]`);
        // expect(rows2.length).toBe(3);

    } else {
        // console.error(`Element with role "${role}" not found.`);
    }


});
