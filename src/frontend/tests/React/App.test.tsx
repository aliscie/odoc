import {render, screen, fireEvent} from '@testing-library/react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {NavAppBar} from "../../components/spesific/app_bar";
import {BreadPage} from "../../components/genral/breadcrumbs";
import App from "../../App"; // Assuming you have redux-mock-store installed


// Create a mock Redux store
const mockStore = configureStore([]);
const initialState = {
    uiReducer: {
        isNavOpen: false,
        isDarkMode: false,
        isLoggedIn: false,
        searchTool: false,
    },
    filesReducer: {
        profile: null,
        current_file: null,
        files: {},
    },
};
const store = mockStore(initialState);

test('clicking on Login opens a new tab', () => {
    render(
        <Provider store={store}>

            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    );

    // Find the Login button and click it
    // const loginButton = screen.getByText('Login');
    // fireEvent.click(loginButton);
    //
    // // Check if a new tab is opened (you may need to adjust the condition based on your specific implementation)
    // expect(window.open).toHaveBeenCalled();
});
