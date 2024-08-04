import React from 'react';
import {Provider} from 'react-redux';
import {SnackbarProvider} from 'notistack';
import ThemeProvider from "../../ThemeProvider";
import store from "../../redux/main";

const TestWrapper = ({children}) => (
    <Provider store={store}>
        <ThemeProvider>
            <SnackbarProvider>
                {children}
            </SnackbarProvider>
        </ThemeProvider>
    </Provider>
);

export default TestWrapper;
