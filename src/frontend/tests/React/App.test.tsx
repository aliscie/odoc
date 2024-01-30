import * as React from "react";
import {StrictMode} from "react";
import App from "../../App";
import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import configureStore from 'redux-mock-store';

import {initialState} from "../../redux/files";

const mockStore = configureStore([]);


test("Test render app", async () => {
    // let input: RegisterUser = {
    //     'name': ["string"],
    //     'description': ["Somthing"],
    //     'photo': [[]],
    // };
    // let res = await global.actor.register(input);
    // let store = mockStore(initialState);
    // render(<Provider store={store}>
    //         {/*<App/>*/}
    //     </Provider>);
    // const login = document.getElementsByClassName("login");
    // expect(login.length).toBe(1);


    // let res2 = await global.actor.setIdentity(new AnonymousIdentity());
    render(<App/>);
    // const login2 = document.getElementsByClassName("login");
    // expect(login2.length).toBe(0);
});
