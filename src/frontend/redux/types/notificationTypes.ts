export type NotificationActions =
  | { type: "NOTIFY"; new_notification: Notification }
  | { type: "UPDATE_NOT_LIST"; new_list: Notification[] }
  | { type: "DELETE_NOTIFY"; id: string }
  | { type: "UPDATE_NOTE"; id: string };

// | FriendsActions;

export interface NotificationInitialState {
  notifications: Notification[];
}

export const notificationInitialState: NotificationInitialState = {
  notifications: [],
};
