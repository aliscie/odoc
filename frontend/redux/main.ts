// Define the reducer function
import {createStore} from "redux";
import {is_logged} from "../backend_connect/ic_agent";

export function reducer(state = initialState, action: any) {
    switch (action.type) {
        case 'TOGGLE_NAV':
            return {
                ...state,
                isNavOpen: !state.isNavOpen,
            };

        case 'TOGGLE_DARK':
            document.querySelector("body")?.classList.toggle("dark");
            return {
                ...state,
                isDarkMode: !state.isDarkMode,
            };
        case 'SEARCH':
            return {
                ...state,
                searchValue: action.searchValue,
            };

        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
            };
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
            };
        case 'SEARCH_TOOL':
            return {
                ...state,
                searchTool: !state.searchTool,
            };
        default:
            return state;
    }
}


const initialState = {
    count: 0,
    isNavOpen: false,
    searchTool: false,
    isDarkMode: true,
    searchValue: String,
    isLoggedIn: await is_logged(),

};
export const TOGGLE_NAV = 'TOGGLE_NAV';
export const SEARCH = 'SEARCH';
export const TOGGLE_DARK = 'TOGGLE_DARK';
export const LOGOUT = 'LOGOUT';
export const LOGIN = 'LOGIN';

export const toggle = () => ({
    type: TOGGLE_NAV,
});

export const handleSsearch = (searchValue: String) => ({
    type: SEARCH,
    searchValue: searchValue,
});

export const toggleSearchTool = () => ({
    type: 'SEARCH_TOOL',
});


export const toggleDarkMode = () => ({
    type: TOGGLE_DARK,
});


export const reduxLogout = () => ({
    type: LOGOUT,
});

export const reduxLogin = () => ({
    type: LOGIN,
});

export const logout = () => ({
    type: LOGOUT,
});

const store = createStore(reducer);
export default store;