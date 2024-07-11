import * as React from "react";
import App from "../../App";
import { render } from "@testing-library/react";
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { initialState } from "../../redux/files";
import TestRapper from "../utls/tests_wrapper";

const mockStore = configureStore([]);

test("Test render app", async () => {
    let input: RegisterUser = {
        'name': ["string"],
        'description': ["Something"],
        'photo': [[]],
    };
    let res = await global.actor.register(input);
    let store = mockStore(initialState);

    // Ensure that the TestRapper renders its children properly
    const { container } = render(
        <TestRapper>
            <Provider store={store}>
                <App />
            </Provider>
        </TestRapper>
    );

    expect(container).toBeInTheDocument();
});
