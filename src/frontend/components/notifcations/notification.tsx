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

    useEffect(() => {
        (async () => {
            if (actor) {
                let notification_list = await actor.get_notifications();
                dispatch(handleRedux('UPDATE_NOTIFY', {new_list: notification_list}));
            }
        })();
    }, []);


    const new_notifications = React.useMemo(() => {
        return notifications.filter((notification: any) => {

            return notification && !notification.is_read
        });
    }, [notifications]);


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
                    let item = {content: Object.keys(notification.content)[0]};
                    return item
                })}
            >
                <Badge
                    invisible={new_notifications.length == 0}
                    color={'inherit'}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    badgeContent={new_notifications.length}
                    color={new_notifications.length > 0 ? 'error' : "action"}
                >
                    <NotificationsIcon color={new_notifications.length > 0 ? 'error' : "action"}/>
                </Badge>

            </BasicMenu>
        </>
    );
}