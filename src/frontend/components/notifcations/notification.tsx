// a simple comoonent
// that displays a notification


import React, {useEffect} from 'react';
import BasicMenu from "../genral/basic_menu";
import {Badge} from "@mui/base";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {actor} from "../../App";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import useGetUser from "../../utils/get_user_by_principal";

export function Notifications() {
    let {getUser, getUserByName} = useGetUser();
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

    function renderNotification(notification: any): string {
        let content = Object.keys(notification.content)[0];
        let sender: any = getUser(notification.sender);
        sender = sender ? sender.name : ""
        // logger({content})
        switch (content) {
            case "FriendRequest":
                return `${sender} sent you a friend request`;
            case "ContractUpdate":
                return `${sender} accepted your friend request`;
            case "SharePayment":
                return `${sender} have paid for your share contract`;
            case "Unfriend":
                return `${sender} unfriended you`;
            default:
                break;
        }
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
                options={notifications.length > 0 ? notifications.map((notification: any) => {
                    if (!notification) {
                        return {content: "", to: ""}
                    }
                    ;
                    let item = {
                        content: <div
                            style={{color: notification.is_seen ? "gray" : ""}}>{renderNotification(notification)}</div>,
                        to: 'profile'
                        // onClick: () => clickNotification(notification)
                    };
                    return item
                }) : []}
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