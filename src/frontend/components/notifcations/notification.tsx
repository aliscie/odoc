// a simple comoonent
// that displays a notification


import React, {useEffect} from 'react';
import BasicMenu from "../genral/basic_menu";
import {Badge} from "@mui/base";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {actor} from "../../App";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";

export function Notifications() {
    const dispatch = useDispatch();
    const {notifications} = useSelector((state: any) => state.filesReducer);
    const new_notifications = notifications.filter((notification: any) => {
        return notification && !notification.is_read
    });

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
                options={new_notifications.map(notification => {
                    let item = {
                        content: Object.keys(notification.content)[0],
                        to: 'profile'
                        // onClick: () => clickNotification(notification)
                    };
                    return item
                })}
            >
                <Badge
                    invisible={new_notifications.length == 0}
                    // color={'inherit'}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
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