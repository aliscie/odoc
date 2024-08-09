// Action Types
export type UiActions =
  | "TOGGLE_NAV"
  | "SEARCH"
  | "TOGGLE_DARK"
  | "LOGOUT"
  | "LOGIN"
  | "SEARCH_TOOL"
  | "POST_VOTE";

// Action Interfaces
export interface ToggleNavAction {
  type: 'TOGGLE_NAV';
}

export interface PostVoteAction {
  type: 'POST_VOTE';
  postVote: any;  // Adjust the type of postVote as needed
}

export interface ToggleDarkModeAction {
  type: 'TOGGLE_DARK';
}

export interface SearchAction {
  type: 'SEARCH';
  searchValue: string;
}

export interface LogoutAction {
  type: 'LOGOUT';
}

export interface LoginAction {
  type: 'LOGIN';
}

export interface ToggleSearchToolAction {
  type: 'SEARCH_TOOL';
}


export type Action =
  | ToggleNavAction
  | PostVoteAction
  | ToggleDarkModeAction
  | SearchAction
  | LogoutAction
  | LoginAction
  | ToggleSearchToolAction;

// State Interface
export interface State {
  count: number;
  isNavOpen: boolean;
  searchTool: boolean;
  isDarkMode: boolean;
  searchValue: string;
  isLoggedIn: boolean;
}

// Initial State
export const initialState: State = {
  count: 0,
  isNavOpen: false,
  searchTool: false,
  isDarkMode: true,
  searchValue: "",
  isLoggedIn: false,
};