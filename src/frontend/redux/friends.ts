import {initialState} from "./files";

export type FriendsActions = "ADD_FRIEND" | "REMOVE_FRIEND" | "REMOVE_FRIEND_REQUEST" | "ADD_FRIEND_REQUEST";

// export function friendsReducer(state = initialState, action: { type: FriendsActions, friend: any, id: any }) {
//     let friends = {...state.friends[0]};
//     let file_id = action.id;
//
//     switch (action.type) {
//         // case 'ADD_FRIEND':
//         //     friends.friends.push(action.friend);
//         //     return {
//         //         ...state,
//         //         friends: [friends],
//         //     };
//         //
//         // case 'REMOVE_FRIEND':
//         //     friends.friends = friends.friends.filter((friend) => friend.id !== file_id);
//         //     return {
//         //         ...state,
//         //         friends: [friends],
//         //     };
//         //
//         // case 'ADD_FRIEND_REQUEST':
//         //     friends.friend_requests.push(action.friend);
//         //     return {
//         //         ...state,
//         //         friends: [friends],
//         //     };
//         //
//         // case 'REMOVE_FRIEND_REQUEST':
//         //     friends.friend_requests = friends.friend_requests.filter((request) => request.id !== file_id);
//         //     return {
//         //         ...state,
//         //         friends: [friends],
//         //     };
//
//         default:
//             return state;
//     }
// }
