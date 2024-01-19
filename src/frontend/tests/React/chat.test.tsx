import configureStore from 'redux-mock-store';
import {Provider} from "react-redux";
import {render} from "@testing-library/react";
import * as React from "react";
import {StrictMode} from "react";
import redux_sample from "./redux_example.json";

const mockStore = configureStore([]);


test('Test chat logic', () => {
    const store = mockStore(redux_sample);
    render(
        <StrictMode>
            <Provider store={store}>
                {/*<ChatsPage/>*/}
            </Provider>
        </StrictMode>
    )


});
