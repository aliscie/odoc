import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import {Rating, Tooltip} from "@mui/material";
import * as React from "react";
import LoaderButton from "../../components/genral/loader_button";
import {convertToBlobLink} from "../../data_processing/image_to_vec";
import {actor} from "../../App";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {FriendSystem, User} from "../../../declarations/user_canister/user_canister.did";
import {useState} from "react";

interface FriendProps {
    id: string,
    // is_friend?: boolean,
    name: string,
    photo: any,
    labelId: string,
}

export function Friend(props: FriendProps) {
    const {
        friends,
        profile
    }: { friends: FriendSystem, profile: User } = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let FS = friends[0] && friends[0].friends || []
    let friend_requests = friends[0] && friends[0].friend_requests || []
    let is_friend_request = friend_requests.some((req) => req && req.sender.id === profile.id || req.receiver && req.receiver.id === profile.id)
    let is_friend = FS.some((friend) => friend && friend.sender.id === profile.id || friend && friend.receiver && friend.receiver.id === profile.id)
    const [isFriend, setIsFriend] = useState(is_friend);
    const dispatch = useDispatch();
    const [isFriendReq, setIsFreindReq] = useState(is_friend_request);

    async function handleCLickConfirm(id: string) {
        let res = actor && await actor.accept_friend_request(id)
        dispatch(handleRedux("ADD_FRIEND", {id: id, friend: res.Ok}));
        dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}));
        actor && dispatch(handleRedux('UPDATE_NOTIFY', {new_list: await actor.get_notifications()}));
        return res
    }

    async function handleUnfriend(id: string) {
        let res = actor && await actor.unfriend(id)
        if (res.Ok) {
            dispatch(handleRedux("REMOVE_FRIEND", {id: id}))
            setIsFriend(false);
        }
        return res
    }

    let is_sent = friend_requests.some((req) => req && req.sender.id === profile.id)
    const [isSent, setIsSent] = useState(is_sent);

    async function handleCancel(id: string) {
        let res = actor && await actor.cancel_friend_request(id)
        if (res.Ok) {
            dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}))
            setIsSent(false);
            setIsFreindReq(false)
        }
        let notification_list = actor && await actor.get_notifications();
        dispatch(handleRedux('UPDATE_NOTIFY', {new_list: notification_list}));
        return res
    }

    async function handleReject(id: string) {
        let res = actor && await actor.reject_friend_request(id)
        if (res.Ok) {
            dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}))
        }
        let notification_list = actor && await actor.get_notifications();
        dispatch(handleRedux('UPDATE_NOTIFY', {new_list: notification_list}));
        return res
    }

    async function handleFriedReq(user) {
        let loading = enqueueSnackbar(<span>sending friend request... <span
            className={"loader"}/></span>, {variant: "info"});
        let friend_request = actor && await actor.send_friend_request(user)
        closeSnackbar(loading)
        if (friend_request.Err) {
            enqueueSnackbar(friend_request.Err, {variant: "error"});
        }
        if (friend_request.Ok) {
            enqueueSnackbar("Friend request sent", {variant: "success"});
            setIsSent(true)
            setIsFreindReq(true)
        }
        return friend_request

    }

    // ToDo prevent the friend request sender from accepting the request
    //  Only the request receiver can accept_friend_request

    return <ListItem
        secondaryAction={
            <>
                {isFriendReq && !isSent && <Tooltip title={"Friend request pending"}> <LoaderButton
                    onClick={async () => await handleCLickConfirm(props.id)}
                >Confirm</LoaderButton></Tooltip>}

                {isFriendReq && !isSent && <LoaderButton
                    onClick={async () => await handleReject(props.id)}
                >Reject</LoaderButton>}

                {isSent && <LoaderButton
                    onClick={async () => await handleCancel(props.id)}
                >Cancel</LoaderButton>}

                {isFriend && !isFriendReq && <LoaderButton
                    onClick={async () => await handleUnfriend(props.id)}
                >Unfriend</LoaderButton>}

                {!isFriend && !isFriendReq && <Tooltip title={"Send friend request"}> < LoaderButton
                    onClick={async () => await handleFriedReq(props.id)}
                ><GroupAddIcon/> </LoaderButton></Tooltip>}

            </>
        }
    >
        <ListItemAvatar>
            <Avatar
                src={convertToBlobLink(props.photo)}
            />
        </ListItemAvatar>
        <ListItemText id={props.labelId} primary={props.name}/>
        <ListItem>
            <Tooltip arrow title={"How much do you trust your fired"}>
                <Rating name="half-rating" defaultValue={2.5} precision={0.5}/>
            </Tooltip>
        </ListItem>
    </ListItem>
}

function Friends(props: any) {

    const {
        profile,
    } = useSelector((state: any) => state.filesReducer);

    if (!props.friends[0]) {
        return <></>
    }
    let friend_requests = props.friends[0].friend_requests || [];
    let friends = props.friends[0].friends || [];


    return (
        <List dense>

            {friend_requests && friend_requests.map((value) => {
                let user = value.receiver.id != profile.id ? value.receiver : value.sender
                const labelId = `checkbox-list-secondary-label-${value.receiver.name}`;
                return (
                    <ListItem
                        key={value.receiver.name}
                        disablePadding
                    >
                        <Friend labelId={labelId} {...user}/>
                    </ListItem>
                );
            })}

            {friends && friends.map((value) => {
                let user = value.receiver && value.receiver.id != profile.id ? value.receiver : value.sender
                const labelId = `checkbox-list-secondary-label-${value.receiver.name}`;
                return (
                    <ListItem
                        key={value.receiver.name}
                        disablePadding
                    >
                        <Friend {...user} is_friend={true} labelId={labelId}/>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default Friends