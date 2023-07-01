import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {actor} from "../../backend_connect/ic_agent";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import {LoadingButton} from "../../components/genral/load_buttton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import {Rating, Tooltip} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import * as React from "react";
import {convertToBlobLink} from "./profile";


function Friend(props: any) {
    return <ListItem>
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
    // const {all_friends} = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const dispatch = useDispatch();
    if (!props.friends[0]) {
        return <></>
    }
    let friend_requests = props.friends[0].friend_requests || [];
    let friends = props.friends[0].friends || [];

    async function handleCLickConfirm(id: string) {
        let res = await actor.accept_friend_request(id)
        dispatch(handleRedux("ADD_FRIEND", {id: id, friend: res.Ok}))
        dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}))
    }

    async function handleUnfriend(id: string) {
        let res = await actor.unfriend(id)
        if (res.Ok) {
            enqueueSnackbar("Unfriended successfully", {variant: "success"});
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
        dispatch(handleRedux("REMOVE_FRIEND", {id: id}))
    }

    async function handleReject(id: string) {
        let res = await actor.cancel_friend_request(id)
        if (res.Ok) {
            enqueueSnackbar("Unfriended successfully", {variant: "success"});
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
        dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}))
    }

    return (
        <List dense sx={{bgcolor: 'var(--background)', color: "var(--color)"}}>
            <Divider textAlign="left">Friends</Divider>

            {friend_requests && friend_requests.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value.name}`;
                return (
                    <ListItem
                        key={value.name}
                        secondaryAction={
                            <>
                                <LoadingButton onClick={async () => await handleReject(value.id)} name={"Reject"}/>
                                <LoadingButton onClick={async () => await handleCLickConfirm(value.id)}
                                               name={"Confirm"}/>
                            </>
                        }
                        disablePadding
                    >
                        <Friend labelId={labelId} name={value.name} photo={value.photo}/>
                    </ListItem>
                );
            })}

            {friends && friends.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value.name}`;
                return (
                    <ListItem
                        key={value.name}
                        secondaryAction={
                            <LoadingButton onClick={async () => await handleUnfriend(value.id)} name={"Unfriend"}/>
                        }
                        disablePadding
                    >
                        <Friend name={value.name} photo={value.photo} labelId={labelId}/>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default Friends