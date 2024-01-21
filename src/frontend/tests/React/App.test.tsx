import configureStore from 'redux-mock-store';
import {Provider} from "react-redux";
import {render} from "@testing-library/react";
import SharesContractComponent from "../../components/contracts/shares_contract";
import * as React from "react";
import App from "../../App";
import store from "../../redux/main";
import {StrictMode} from "react";

const mockStore = configureStore([]);
import redux_sample from "./redux_example.json";
import share_contract_example from "./share_contract_example.json";
import {logger} from "../../dev_utils/log_data";

const container = document.createElement('div');
document.body.appendChild(container);


test('clicking on Login opens a new tab', () => {
    const store = mockStore(redux_sample);
    // render(
    //     <StrictMode>
    //         <Provider store={store}>
    //             <SharesContractComponent {...share_contract_example} />
    //         </Provider>
    //     </StrictMode>
    // )


});

afterEach(() => {
    document.body.removeChild(container);
});
