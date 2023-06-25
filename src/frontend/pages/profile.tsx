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
import {Button} from "@mui/material";
import {actor} from "../backend_connect/ic_agent";
import {handleRedux} from "../redux/main";

function LoadingButton(props: any) {
    let [loading, setLoading] = React.useState(false);
    return <>
        {
            loading ? <span className="loader"/> : <Button
                disabled={loading}
                onClick={async () => {
                    setLoading(true)
                    props.onClick && await props.onClick()
                    setLoading(false)
                }}
            >{props.name}</Button>
        }</>
}


function Friends(props: any) {
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
        console.log({res})
        dispatch(handleRedux("REMOVE_FRIEND", {id: id}))
    }


    async function handleReject(id: string) {
        let res = await actor.cancel_friend_request(id)
        console.log({res})
        dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}))
    }

    return (
        <List dense sx={{bgcolor: 'var(--background)', color: "var(--color)"}}
            // sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
        >
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
                                <Avatar
                                    alt={`Avatar n°${value + 1}`}
                                    src={`/static/images/avatar/${value + 1}.jpg`}
                                />
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
                                <Avatar
                                    alt={`Avatar n°${value + 1}`}
                                    src={`/static/images/avatar/${value + 1}.jpg`}
                                />
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={value.name}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

function ProfileItem(props: any) {
    return (<>
            <ListItem>
                <ListItemText
                    primary={<span style={{color: 'var(--text-color)'}}>{props.title}</span>}
                    secondary={<span contentEditable={props.editable != false}
                                     style={{color: 'var(--secondary-text-color)'}}>{props.value}</span>}
                />
                {props.children}
            </ListItem>
            {props.divider !== false && <Divider/>}
        </>
    );
}

export default function ProfileComponent() {
    const {profile, friends} = useSelector((state: any) => state.filesReducer);

    console.log({friends})
    return (
        <Box sx={{bgcolor: 'var(--background)', color: "var(--color)", width: "80%"}}>
            {profile && <List>
                <ProfileItem title={'name'} value={profile.name}/>
                <ProfileItem title={'description'} value={profile.description}/>
                <ProfileItem title={'birthdate'} value={profile.description}/>
                <ProfileItem editable={false} title={'ICP'} value={"0"}><Button>Deposit</Button></ProfileItem>
                <ProfileItem editable={false} divider={false} title={'USDT'}
                             value={"0"}><Button>Deposit</Button></ProfileItem>
                <Button>Confirm</Button>
            </List>}


            {friends && <Friends friends={friends}/>}
        </Box>
    );
}