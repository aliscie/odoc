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

function Notification({notification}: any) {
    // console.log("render Notification") // TODO this renders about 20 times.
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
            default:
                return `${sender} unknown action`;
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
                        content: <Notification notification={notification}/>,
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