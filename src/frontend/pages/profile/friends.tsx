import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {actor} from "../../backend_connect/ic_agent";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import {Rating, Tooltip} from "@mui/material";
import * as React from "react";
import LoaderButton from "../../components/genral/loader_button";
import {convertToBlobLink} from "../../data_processing/image_to_vec";


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
        return res
    }

    async function handleUnfriend(id: string) {
        let res = await actor.unfriend(id)
        if (res.Ok) {
            dispatch(handleRedux("REMOVE_FRIEND", {id: id}))
        }
        return res
    }

    async function handleReject(id: string) {
        let res = await actor.cancel_friend_request(id)
        if (res.Ok) {
            dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}))
        }
        return res
    }

    return (
        <List dense>

            {friend_requests && friend_requests.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value.name}`;
                return (
                    <ListItem
                        key={value.name}
                        secondaryAction={
                            <>
                                <LoaderButton
                                    onClick={async () => await handleCLickConfirm(value.id)}
                                >Confirm</LoaderButton>
                                <LoaderButton
                                    onClick={async () => await handleReject(value.id)}
                                >Reject</LoaderButton>
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
                            <LoaderButton
                                onClick={async () => await handleUnfriend(value.id)}
                            >Unfriend</LoaderButton>
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