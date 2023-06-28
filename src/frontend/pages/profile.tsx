import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {useDispatch, useSelector} from "react-redux";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {TextField} from "@mui/material";
import {actor} from "../backend_connect/ic_agent";
import {handleRedux} from "../redux/main";
import {LoadingButton} from "../components/genral/load_buttton";
import {useSnackbar} from "notistack";

export function convertToBlobLink(imageData) {
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
        new Blob([imageContent.buffer], {type: "image/png"})
    );
    return image;
}

function Friends(props: any) {
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
                        <ListItemButton>
                            <ListItemAvatar>
                                {/*<Avatar*/}
                                {/*    alt={`Avatar n°${value + 1}`}*/}
                                {/*    src={`/static/images/avatar/${value + 1}.jpg`}*/}
                                {/*/>*/}
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={value.name}/>
                        </ListItemButton>
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
                        <ListItemButton>
                            <ListItemAvatar>
                                {/*<Avatar*/}
                                {/*    alt={`Avatar n°${value + 1}`}*/}
                                {/*    src={`/static/images/avatar/${value + 1}.jpg`}*/}
                                {/*/>*/}
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={value.name}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default function ProfileComponent() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {profile, friends} = useSelector((state: any) => state.filesReducer);
    // const dispatch = useDispatch();
    const [profileData, setProfileData] = React.useState(profile || {});

    const handleSaveChanges = async () => {

        const res = await actor.update_user_profile({
            name: [profileData.name],
            description: [profileData.description],
            photo: [profileData.photo],
        });

        // console.log({profileData, res});
        if (res.Ok) {
            enqueueSnackbar("Profile updated successfully", {variant: "success"});
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        // const reader = new FileReader();
        // reader.onload = (event) => {
        //     setProfileData({...profileData, photo: event.target.result});
        // };
        // reader.readAsDataURL(file);
    };

    return (
        <Box sx={{bgcolor: 'var(--background)', color: 'var(--color)', width: '80%'}}>
            {profile && (
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar
                                alt="Profile Photo"
                                src={convertToBlobLink(profileData.photo)}
                                sx={{width: 128, height: 128, marginRight: 1}}
                            />
                        </ListItemAvatar>
                        <input type="file" accept="image/*" onChange={handlePhotoChange}/>
                    </ListItem>
                    {Object.entries(profileData).map(([key, value]) => {
                        if (key === 'photo') {
                            return null; // Skip rendering the photo field again
                        }
                        return (
                            <ListItem key={key}>
                                <TextField
                                    disabled={key === 'id'}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={value}
                                    onChange={(e) => setProfileData({...profileData, [key]: e.target.value})}
                                    fullWidth
                                    variant="standard"
                                    InputLabelProps={{
                                        style: {color: 'var(--secondary-text-color)'},
                                    }}
                                    InputProps={{
                                        style: {color: "var(--color)"},
                                    }}
                                />
                            </ListItem>
                        );
                    })}
                    <ListItem>
                        <LoadingButton onClick={handleSaveChanges} name={"Save changes"}/>
                    </ListItem>
                </List>
            )}
            {friends[0] && <Friends friends={friends}/>}
        </Box>
    );
}
