import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import App from "./App";
import {Provider} from "react-redux";
import store from "./redux/main";


const rootElement = document.getElementById('root');

// Check if the root element is present in the HTML
if (!rootElement) {
  throw new Error('Root element with id "root" not found in the document');
}

// Create a root using createRoot
const root = createRoot(rootElement);

// Render the app component within StrictMode and Redux Provider
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);