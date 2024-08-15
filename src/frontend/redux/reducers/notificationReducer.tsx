import {NotificationActions, NotificationInitialState, notificationInitialState} from "../types/notificationTypes";

export function notificationReducer(state: NotificationInitialState = notificationInitialState, action: NotificationActions): notificationInitialState {

    switch (action.type) {

        case 'NOTIFY':
            let is_in = false;
            const updatedNotifications = state.notifications.map((n) => {
                if (n.id === action.new_notification.id) {
                    is_in = true;
                    return action.new_notification;
                }
                return n;
            });
            return {
                ...state,
                notifications: is_in ? updatedNotifications : [...state.notifications, action.new_notification]
            };

        case 'UPDATE_NOT_LIST':
            return {
                ...state,
                notifications: action.new_list
            };

        case 'UPDATE_NOTE':
            return {
                ...state,
                notifications: state.notifications.map(n => n.id === action.id ? {...n, ...action} : n)
            };

        case 'DELETE_NOTIFY':
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.id)
            };


        default:
            return state;
    }
}
