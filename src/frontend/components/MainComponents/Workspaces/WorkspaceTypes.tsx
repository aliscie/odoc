import { Principal } from "@dfinity/principal";

export interface Workspace {
  id: string;
  name: string;
  files: any[];
  creator: Principal;
  members: Principal[];
  chats: any[];
  admins: Principal[];
}

export interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
}

export interface Profile {
  id: string;
}

export interface FilesState {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  profile: Profile;
}
