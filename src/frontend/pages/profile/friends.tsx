import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import {Tooltip} from "@mui/material";
import * as React from "react";
import LoaderButton from "../../components/genral/loader_button";
import {actor} from "../../App";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {Friend} from "../../../declarations/user_canister/user_canister.did";
import RateUser from "../../components/spesific/rate_user";
import {UserAvatar} from "../../components/genral/post_component";

interface FriendProps {
    id: string,
    // is_friend?: boolean,
    name: string,
    photo: any,
    labelId: string,
    rate?: number,
    confirmed?: boolean
}

export function FriendCom(props: FriendProps) {
    const {
        all_friends,
        friends,
        profile
    } = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const dispatch = useDispatch();

    let is_sender = false;
    let confirmed = props.confirmed;
    let isFriend = friends.find((f: Friend) => {
        confirmed = f.confirmed;
        if (f.sender.id == props.id) {
            is_sender = true;
            return true;
        } else if (f.receiver.id == props.id) {
            return true
        }

        return false
    })


    async function handleConfirm(id: string) {
        if (typeof id != 'string') {
            id = id.toText();
        }
        let res = actor && await actor.accept_friend_request(id)
        dispatch(handleRedux("UPDATE_NOTE", {id: id + profile.id, is_seen: true}));
        dispatch(handleRedux("ADD_FRIEND", {
            friend: {
                confirmed: true,
                sender: props,
                receiver: profile
            }
        }));

        // actor && dispatch(handleRedux('UPDATE_NOTIFY', {new_list: await actor.get_notifications()}));
        return res
    }

    async function handleUnfriend(id: string) {
        if (typeof id != 'string') {
            id = id.toText();
        }
        let res = actor && await actor.unfriend(id);
        if (res.Ok) {
            dispatch(handleRedux("REMOVE_FRIEND", {id: id}));
            if (is_sender) {
                dispatch(handleRedux("UPDATE_NOTE", {id: profile.id + id, is_seen: true}));
            } else {
                dispatch(handleRedux("UPDATE_NOTE", {id: id + profile.id, is_seen: true}));
            }


        }
        return res
    }


    async function handleCancel(id: string) {
        if (typeof id != 'string') {
            id = id.toText();
        }
        let res = actor && await actor.cancel_friend_request(id)
        if (res.Ok) {
            dispatch(handleRedux("REMOVE_FRIEND", {id: id}))
            dispatch(handleRedux('DELETE_NOTIFY', {id: profile.id + id}));
        }
        return res
    }

    async function handleReject(id: string) {
        if (typeof id != 'string') {
            id = id.toText();
        }
        let res = actor && await actor.reject_friend_request(id)
        if (res.Ok) {
            dispatch(handleRedux("REMOVE_FRIEND", {id: id}))
            dispatch(handleRedux('DELETE_NOTIFY', {id: id + profile.id}));
        }
        return res
    }

    async function handleFriedReq(user) {
        if (typeof user != 'string') {
            user = user.toText();
        }
        let loading = enqueueSnackbar(<span>sending friend request... <span
            className={"loader"}/></span>, {variant: "info"});
        let friend_request = actor && await actor.send_friend_request(user)
        closeSnackbar(loading)
        if (friend_request.Err) {
            enqueueSnackbar(friend_request.Err, {variant: "error"});
        }
        if (friend_request.Ok) {
            enqueueSnackbar("Friend request sent", {variant: "success"});
        }
        return friend_request

    }


    return <ListItem
        secondaryAction={
            <>
                {!is_sender && !confirmed && <Tooltip title={"Friend request pending"}> <LoaderButton
                    onClick={async () => await handleConfirm(props.id)}
                >Confirm</LoaderButton></Tooltip>}

                {!is_sender && !confirmed && <LoaderButton
                    onClick={async () => await handleReject(props.id)}
                >Reject</LoaderButton>}

                {is_sender || !confirmed && <LoaderButton
                    onClick={async () => await handleCancel(props.id)}
                >Cancel</LoaderButton>}

                {isFriend && confirmed && <LoaderButton
                    onClick={async () => await handleUnfriend(props.id)}
                >Unfriend</LoaderButton>}

                {!isFriend && !confirmed && <Tooltip title={"Send friend request"}> < LoaderButton
                    onClick={async () => await handleFriedReq(props.id)}
                ><GroupAddIcon/> </LoaderButton></Tooltip>}

            </>
        }
    >
        <ListItemAvatar>
            <UserAvatar {...props} />
        </ListItemAvatar>
        <ListItemText id={props.labelId} primary={props.name}/>
        <ListItem>
            <RateUser rate={props.rate || 0} id={props.id}/>
        </ListItem>
    </ListItem>
}

function Friends(props: any) {

    const {
        profile,
    } = useSelector((state: any) => state.filesReducer);

    if (!props.friends) {
        return <></>
    }

    return (
        <List dense>

            {props.friends.map((value) => {
                let user = value.receiver.id != profile.id ? value.receiver : value.sender
                const labelId = `checkbox-list-secondary-label-${value.receiver.name}`;
                if (value.confirmed) {
                    return (<ListItem
                        key={value.receiver && value.receiver.name}
                        disablePadding
                    >
                        <FriendCom {...user} {...value} is_friend={true} labelId={labelId}/>
                    </ListItem>)
                }
                return (
                    <ListItem
                        key={value.receiver.name}
                        disablePadding
                    >
                        <FriendCom labelId={labelId} {...user} {...value}/>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default Friends