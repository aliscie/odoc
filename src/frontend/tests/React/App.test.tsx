import * as React from "react";
import App from "../../App";
import {render} from "@testing-library/react";
import configureStore from 'redux-mock-store';

import {initialState} from "../../redux/files";
import TestRapper from "../utls/tests_wrapper";

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
});
