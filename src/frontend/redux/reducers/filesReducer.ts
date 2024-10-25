import { FilesActions, InitialState, initialState } from "../types/filesTypes";
import {
  FileIndexing,
  FileNode,
  Friend,
  StoredContract,
} from "../../../declarations/backend/backend.did";
import { deserializeContents } from "../../DataProcessing/deserlize/deserializeContents";
import { deserializeContracts } from "../../DataProcessing/deserlize/deserializeContracts";

export function filesReducer(
  state: InitialState = initialState,
  action: FilesActions,
): InitialState {
  function changeFile(newFile: FileNode) {
    if (state.changes.files.find((file) => file.id === newFile.id)) {
      state.changes.files = state.changes.files.map((file) =>
        file.id === file.id ? newFile : file,
      );
    } else {
      state.changes.files.push(newFile);
    }
    return { ...state };
  }

  switch (action.type) {
    case "INIT_FILES_STATE":
      let all_friends = [];
      action.data.Friends.forEach((f: Friend) => {
        if (f.sender.id !== action.data.Profile.id) {
          all_friends.push(f.sender);
        } else {
          all_friends.push(f.receiver);
        }
      });
      return {
        ...state,
        all_friends,
        files: action.data.Files,
        wallet: action.data.Wallet,
        files_content: deserializeContents(action.data.FilesContents[0]),
        contracts: deserializeContracts(action.data.Contracts),
        profile: action.data.Profile,
        friends: action.data.Friends,
        inited: true,
        profile_history: action.data.ProfileHistory,
        workspaces: action.data.workspaces,
        // friends: action.data.Friends.map(friend => friend.id === action.id ? {...friend, ...action} : friend)
      };

    case "CHANGE_CURRENT_WORKSPACE":
      return {
        ...state,
        currentWorkspace: action.currentWorkspace,
      };

    case "DELETE_WORKSPACE":
      return {
        ...state,
        workspaces: state.workspaces.filter(
          (w) => w.id !== action.workspace.id,
        ),
      };

    case "UPDATE_WORKSPACE":
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id == action.workspace.id) {
            return action.workspace;
          }
          return w;
        }),
      };

    case "ADD_WORKSPACE":
      return {
        ...state,
        workspaces: [...state.workspaces, action.workspace],
      };
    case "ADD_CONTENT":
      return {
        ...state,
        files_content: { ...state.files_content, [action.id]: action.content },
      };

    // case 'INIT_CONTENTS':
    //     return {
    //         ...state,
    //         files_content: action.files_content
    //     };
    case "ADD_FILES_LIST":
        return {
            ...state,
            files: [...state.files, ...action.files],
        };
    case "ADD_CONTENTS_LIST":
        return {
            ...state,
            files_content: { ...state.files_content, ...action.contents },
        };
    case "ADD_FILE":
      return {
        ...state,
        files: [...state.files, action.new_file],
        changes: {
          ...state.changes,
          files: [...state.changes.files, action.new_file],
        },
      };

    case "UPDATE":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.id ? { ...file, ...action.file } : file,
        ),
      };

    case "REMOVE":
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.id),
      };

    case "CURRENT_FILE":
      // localStorage.setItem("current_file", JSON.stringify({ ...action.file }));
      return {
        ...state,
        current_file: action.file,
      };

    case "CHANGE_FILE_PARENT": {
      const { updatedFile1, updatedFile2, reIndexing } = action;
      return {
        ...state,
        changes: {
          ...state.changes,
          files_indexing: [...state.changes.files_indexing, reIndexing], // Create a new array with reIndexing added
          files: [...state.changes.files, updatedFile1, updatedFile2], // Create a new array with updatedFile1 and updatedFile2 added
        },
      };
    }

    // case 'INIT_CONTRACTS':
    //     return {
    //         ...state,
    //         contracts: action.contracts
    //     }
    case "UPDATE_CONTENT":
      return {
        ...state,
        changes: {
          ...state.changes,
          contents: { ...state.changes.contents, [action.id]: action.content },
        },
        files_content: { ...state.files_content, [action.id]: action.content },
        files: state.files.map((file) =>
          file.id === action.id ? { ...file, content: action.content } : file,
        ),
      };

    case "ADD_CONTRACT": {
      const { contract } = action;
      const id = contract.id;
      let stored_custom: StoredContract = { CustomContract: action.contract };
      return {
        ...state,
        changes: {
          ...state.changes,
          contracts: {
            ...state.changes.contracts,
            [id]: { ...stored_custom },
          },
        },
        contracts: {
          ...state.contracts,
          [id]: contract,
        },
      };
    }

    // case "UPDATE_CONTRACT":
    //   return {
    //     ...state,
    //     changes: {
    //       ...state.changes,
    //       contracts: {
    //         ...state.changes.contracts,
    //         [action.contract.id]: {
    //           ...state.changes.contracts[action.contract.id],
    //           CustomContract: action.contract,
    //         },
    //       },
    //     },
    //     contracts: {
    //       ...state.contracts,
    //       [action.contract.id]: action.contract,
    //     },
    //   };

    case "UPDATE_CONTRACT":
      const { contract } = action;
      let id = contract.id;
      let toStoreContract = { CustomContract: contract };
      return {
        ...state,
        changes: {
          ...state.changes,
          contracts: {
            ...state.changes.contracts,
            [id]: { ...toStoreContract },
          },
        },
        contracts: {
          ...state.contracts,
          [id]: contract,
        },
      };

    case "RESOLVE_CHANGES":
      state.changes = {
        files: [],
        contents: {},
        contracts: {},
        delete_contracts: [],
        files_indexing: [],
      };
      return { ...state };

    case "UPDATE_FILE_WORKSPACES":
      let newFile = state.files.find((file) => file.id === action.id)!;
      newFile.workspaces = action.workspaces;
      state = changeFile(newFile);
      return <InitialState>{
        ...state,
        files: state.files.map((file) =>
          file.id === action.id
            ? { ...file, workspaces: action.workspaces }
            : file,
        ),
        current_file: { ...state.current_file, workspaces: action.workspaces },
      };

    case "UPDATE_FILE_TITLE":
      let updatedFile = state.files.find((file) => file.id === action.id)!;
      updatedFile.name = action.title;
      state = changeFile(updatedFile);
      return <InitialState>{
        ...state,
        files: state.files.map((file) =>
          file.id === action.id ? { ...file, title: action.title } : file,
        ),
        current_file: { ...state.current_file, title: action.title },
      };

    case "UPDATE_BALANCE":
      return {
        ...state,
        wallet: { ...state.wallet, balance: action.balance },
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: { ...state.profile, ...action.profile, photo: [[]] },
      };
    // TODO firndRecuer

    case "UPDATE_FRIEND":
      return {
        ...state,
        friends: state.friends.map((friend) =>
          friend.id === action.id ? { ...friend, ...action } : friend,
        ),
      };

    case "REMOVE_FRIEND":
      function checkf(f: any) {
        let sender = f.sender.id;
        let receiver = f.receiver.id;
        if (typeof sender != "string") {
          sender = sender.toString();
        }
        if (typeof receiver != "string") {
          receiver = receiver.toString();
        }

        return sender !== action.id && receiver !== action.id;
      }

      let friends = state.friends.filter((f) => checkf(f));

      return { ...state, friends };

    case "ADD_FRIEND":
      return { ...state, friends: [...state.friends, action.friend] };
    case "CONFIRM_FRIEND":
      let sender = action.friend.sender;
      let receiver = action.friend.receiver;
      return {
        ...state,
        friends: state.friends.map((f) => {
          if (f.sender.id === sender.id && receiver.id === f.receiver.id) {
            return { ...f, confirmed: true };
          }
          return f;
        }),
      };

    // TODO profile reducer
    case "CURRENT_USER_HISTORY":
      return {
        ...state,
        profile_history: action.profile_history,
      };

    case "REMOVE_CONTRACT":
      delete state.contracts[action.id];
      state.changes.delete_contracts.push(action.id);
      delete state.changes.contracts[action.id];
      return {
        ...state,
      };

    default:
      return state;
  }
}
