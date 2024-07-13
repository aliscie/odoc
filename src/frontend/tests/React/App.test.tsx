import * as React from "react";
import App from "../../App";
import {findByText, render} from "@testing-library/react";
import configureStore from 'redux-mock-store';

import {initialState} from "../../redux/files";
import TestRapper from "../utils/tests_wrapper";
import {RegisterUser} from "../../../declarations/backend/backend.did";

const mockStore = configureStore([]);


test("Test render app", async () => {
    let input: RegisterUser = {
        'name': ["string"],
        'description': ["Somthing"],
        'photo': [[]],
    };
    let res = await global.actor.register(input);
    let store = mockStore(initialState);
    render(<TestRapper>
        <App/>
    </TestRapper>);
    // find by classname = login
    let loginButton = await findByText(document.body, "Login");
    expect(loginButton).toBeInTheDocument();

});
