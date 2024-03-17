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
import DialogOver from "../genral/daiolog_over";
import {Input} from "@mui/material";
import LoaderButton from "../genral/loader_button";
import {CPayment, Notification} from "../../../declarations/user_canister/user_canister.did";

function Notification({notification}: { notification: Notification }) {
    // console.log("render Notification") // TODO this renders about 20 times.
    let {getUser, getUserByName} = useGetUser();
    const [sender, setSender] = useState<string>("");

    useEffect(() => {
        (async () => {
            let sender = await getUser(notification.sender);
            setSender(sender ? sender.name : "");
        })()
    }, [])

    function renderNotification(notification: any): string | JSX.Element {
        let content = notification.content;

        switch (Object.keys(notification.content)[0]) {
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
            case 'CPaymentContract':
                let c_payment: CPayment = notification.content.CPaymentContract[0];

                let actions = content.CPaymentContract ? Object.keys(content.CPaymentContract[1])[0].toLowerCase() : "";
                let amount = c_payment.amount

                let Dialog = (props: any) => {
                    let status = Object.keys(c_payment.status)[0];
                    switch (status) {
                        case "HeighConformed":
                            return <>
                                You can confirmed this contract to protect it from cancellation. the sender set it to
                                heigh
                                confirm which mean he can't even withdraw his balance.
                                <LoaderButton onClick={async () => {
                                    let res = actor && await actor.approve_heigh_conform(content.CPaymentContract[0])
                                    props.handleCancel()
                                    return res
                                }}>High Confirm</LoaderButton>
                            </>
                        case "Released":
                            return <>Payme it released</>
                        default:
                            let reason = "";
                            return <>
                                If you thin the user should not cancile this payment write the resion here.
                                <Input onChange={(e) => reason = e.target.value}/>
                                <LoaderButton onClick={async () => {
                                    let res = actor && await actor.object_on_cancel(content.CPaymentContract[0], reason)
                                    props.handleCancel()
                                    return res
                                }}>Object on cancellation</LoaderButton>


                                You can confirmed this contract to protect it from cancellation.
                                <LoaderButton onClick={async () => {
                                    let res = actor && await actor.confirmed_c_payment(content.CPaymentContract[0])
                                    props.handleCancel()
                                    return res
                                }}>Confirm</LoaderButton>


                                The payer want to to cancel this contract. you can confirm it to protect it from
                                cancellation.
                                <LoaderButton onClick={async () => {
                                    let res = actor && await actor.confirmed_cancellation(content.CPaymentContract[0])
                                    props.handleCancel()
                                    return res
                                }}>Confirm Conciliation</LoaderButton>
                            </>

                    }

                }


                return <DialogOver
                    variant="text"
                    DialogContent={Dialog}
                >
                    <div>{sender} {actions} you {amount}</div>
                </DialogOver>;
            default:
                console.log("unknown action", notification);
                return `${sender} ${JSON.stringify(content)} action`;
        }
    }

    const [loading, setLoading] = useState(false);
    return <div
        onClick={async () => {
            if (actor && !notification.is_seen) {
                setLoading(true);
                let res = await actor.see_notifications(notification.id);
                setLoading(false);
                // console.log(res)
            }
        }}
        style={{color: notification.is_seen ? "gray" : ""}}>
        {loading && "loading..."}
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
                        pure: true,
                        // to: 'profile'
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