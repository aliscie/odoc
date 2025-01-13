import { State, initialState, Action } from "../types/uiTypes";

export function uiReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        posts: action.posts,
      };
    case "IS_REGISTERED":
      return {
        ...state,
        isRegistered: action.isRegistered,
      };

    case "TOGGLE_NAV":
      return {
        ...state,
        isNavOpen: !state.isNavOpen,
      };
    case "POST_VOTE":
      return {
        ...state,
        post_vote: action.postVote,
      };
    case "TOGGLE_DARK":
      localStorage.setItem("isDarkMode", !state.isDarkMode);
      document.querySelector("body")?.classList.toggle("dark");
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    case "SEARCH":
      return {
        ...state,
        searchValue: action.searchValue,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
      };
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
      };
    case "SEARCH_TOOL":
      return {
        ...state,
        searchTool: !state.searchTool,
      };
    default:
      return state;
  }
}
