import {agent} from "../backend_connect/main";

export type MainActions =
    "TOGGLE_NAV"
    | "SEARCH"
    | "TOGGLE_DARK"
    | "LOGOUT"
    | "LOGIN"
    | "SEARCH_TOOL"
    | "POST_VOTE";
const initialState = {
    count: 0,
    isNavOpen: false,
    searchTool: false,
    isDarkMode: true,
    searchValue: String,
    isLoggedIn: false,
    // isLoggedIn: await agent.is_logged(),

};

// const authClient = await AuthClient.create();
// const userPrincipal = authClient.getIdentity().getPrincipal().toString();
// let x = await actor.send_friend_request("l5gd7-bl4bd-jodqy-yqblz-eawxr-w4fdt-eqxhj-luwyp-nav4q-fs66j-xae")
// "l5gd7-bl4bd-jodqy-yqblz-eawxr-w4fdt-eqxhj-luwyp-nav4q-fs66j-xae"
// "6suv4-d4sug-pgi5x-ez36i-xi5z7-3irau-ozzaq-bubov-ejijq-f7k3j-wqe"
// "dbrpy-d77yw-azutg-7ndrq-kw55i-72uhh-eonyl-hks6f-cugod-h5wgl-lae"


export function uiReducer(state = initialState, action: any) {

    switch (action.type) {
        case 'TOGGLE_NAV':
            return {
                ...state,
                isNavOpen: !state.isNavOpen,
            };

        case 'POST_VOTE':
            return {
                ...state,
                post_vote: action.post_vote,
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
                Anonymous: false,
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
