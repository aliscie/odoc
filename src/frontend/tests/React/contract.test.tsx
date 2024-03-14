import React from 'react';
import TestRapper from "../utls/tests_wrapper";
import {render} from "@testing-library/react";
import {Principal} from "@dfinity/principal";
import {randomString} from "../../data_processing/data_samples";
import {CustomContract} from "../../../declarations/user_canister/user_canister.did";
// import {custom_contract} from "../../data_processing/data_samples";

const custom_contract: CustomContract = {
    'id': randomString(),
    "name": "Custom contract",
    'creator': Principal.fromText("2vxsx-fae"),
    'date_created': Date.now() * 1e6,
    'payments': [],
    'promises': [],
    'contracts': [],
    'formulas': [],
    'date_updated': 0,
    'permissions': [],
}


it('creates and updates a contract, then interacts with rows and columns', () => {
    const {getByText} = render(
        <TestRapper>
            {/*<CustomContractComponent contract={custom_contract}/>*/}
        </TestRapper>
    );

    // expect(getByText("hello world")).toBeInTheDocument();
});


