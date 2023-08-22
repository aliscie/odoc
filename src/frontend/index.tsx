import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import App from "./App";
import {Provider} from "react-redux";
import store from "./redux/main";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>

    </StrictMode>
);
