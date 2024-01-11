// a simple comoonent
// that displays a notification


import React, {useEffect, useState} from 'react';
import BasicMenu from "../genral/basic_menu";
import {Badge} from "@mui/base";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {actor} from "../../App";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import useGetUser from "../../utils/get_user_by_principal";
import LoaderButton from "../genral/loader_button";
import DeleteIcon from "@mui/icons-material/Delete";
import {Notification} from "../../../declarations/user_canister/user_canister.did";
import {logger} from "../../dev_utils/log_data";

function NotificationComponent({notification}: any) {
    let {getUser, getUserByName} = useGetUser();
    const [sender, setSender] = useState<string>("");

    useEffect(() => {
        (async () => {
            let sender = await getUser(notification.sender);
            setSender(sender ? sender.name : "");
        })()
    }, [])

    function renderNotification(notification: any): string {
        let content = Object.keys(notification.content)[0];

        switch (content) {
            case "FriendRequest":
                return `${sender} sent you a friend request`;
            case "ContractUpdate":
                return `${sender} accepted your friend request`;
            case "SharePayment":
                return `${sender} have paid for your share contract`;
            case "Unfriend":
                return `${sender} unfriended you`;
            case "AcceptFriendRequest":
                return `${sender} accepted your friend request.`;
            case 'ConformShare':
                return `${sender} confirmed share`;
            default:
                return `${sender} ${content}`;
        }
    }

    return <div
        style={{color: notification.is_seen ? "gray" : ""}}>
        {renderNotification(notification)}
    </div>
}

export function Notifications() {

    const dispatch = useDispatch();
    const {notifications} = useSelector((state: any) => state.filesReducer);

    const new_notifications = notifications && notifications.filter((notification: any) => notification && notification.is_seen == false);


    useEffect(() => {
        (async () => {
            if (actor) {
                let notification_list = await actor.get_notifications();

                dispatch(handleRedux('UPDATE_NOTIFY', {new_list: notification_list}));
            }
        })();
    }, []);

    const clickNotification = async (n: Notification) => {
        let res: undefined | { Ok: null } | { Err: string } = actor && await actor.notification_seen(n.id);
        if ("Ok" in res && n.is_seen == false) {
            n.is_seen = true;
            dispatch(handleRedux('UPDATE_NOTIFY', {notification: n}));
        } else if ("Err" in res) {
            console.error(res.Err);
        }
    }
    const clearNotifications = async () => {
        let res: undefined | { Ok: null } | { Err: string } = actor && await actor.clear_notifications();
        dispatch(handleRedux('UPDATE_NOTIFY', {new_list: []}));
    }
    const deleteNotification = async (n: Notification) => {
        let res = actor && await actor.delete_notification(n.id);
        dispatch(handleRedux("REMOVE_NOTIFY", {id: n.id}))
    }
    return (
        <>
            <BasicMenu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                options={notifications.length > 0 ? [...notifications.map((notification: any) => {
                    if (!notification) {
                        return {content: "", to: ""}
                    }
                    ;
                    let item = {
                        content: <span><NotificationComponent notification={notification}/> <DeleteIcon
                            onClick={async () => await deleteNotification(notification)} color={"error"}/> </span>,
                        to: 'profile',
                        onClick: () => clickNotification(notification)
                    };
                    return item
                }), {
                    content: "Clear notifications",
                    onClick: async () => await clearNotifications()
                }] : [{
                    content: "You don't have notifications",
                }]}
            >
                <Badge
                    invisible={new_notifications.length == 0}
                    // color={'inherit'}
                    // anchorOrigin={{
                    //     vertical: 'bottom',
                    //     horizontal: 'left',
                    // }}
                    badgeContent={
                        new_notifications && <span
                            style={{color: 'tomato'}}
                        >
                            {new_notifications.length > 0 && new_notifications.length}
                        </span>
                    }
                    color={new_notifications.length > 0 ? 'error' : "action"}
                >
                    <NotificationsIcon color={new_notifications.length > 0 ? 'error' : "action"}/>

                </Badge>

            </BasicMenu>
        </>
    );
}