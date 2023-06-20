import {agent} from "../backend_connect/main";

export type MainActions = "TOGGLE_NAV" | "SEARCH" | "TOGGLE_DARK" | "LOGOUT" | "LOGIN" | "SEARCH_TOOL";
const initialState = {
    count: 0,
    isNavOpen: false,
    searchTool: false,
    isDarkMode: true,
    searchValue: String,
    isLoggedIn: await agent.is_logged(),

};


export function uiReducer(state = initialState, action: any) {

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
