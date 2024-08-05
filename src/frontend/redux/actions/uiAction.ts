import {
    ToggleNavAction,
    PostVoteAction,
    ToggleDarkModeAction,
    SearchAction,
    LogoutAction,
    LoginAction,
    ToggleSearchToolAction
  } from '../types/uiTypes';
  
  // Action Creators with Type Annotations
  export const toggleNav = (): ToggleNavAction => ({
    type: 'TOGGLE_NAV'
  });
  
  export const postVote = (postVote: any): PostVoteAction => ({
    type: 'POST_VOTE',
    postVote
  });
  
  export const toggleDarkMode = (): ToggleDarkModeAction => ({
    type: 'TOGGLE_DARK'
  });
  
  export const search = (searchValue: string): SearchAction => ({
    type: 'SEARCH',
    searchValue
  });
  
  export const logout = (): LogoutAction => ({
    type: 'LOGOUT'
  });
  
  export const login = (): LoginAction => ({
    type: 'LOGIN'
  });
  
  export const toggleSearchTool = (): ToggleSearchToolAction => ({
    type: 'SEARCH_TOOL'
  });
  