import {useEffect, useState} from "react";
import useGetChats from "../components/chat/use_get_chats";
import {Chat} from "../../declarations/user_canister/user_canister.did";
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import {useSelector} from "react-redux";

interface Props {
}

function ChatsPage(props: Props) {
    // const {current_chat_id, current_user, chats} = useSelector((state: any) => state.chatsReducer);

    let {getChats} = useGetChats()
    const [state, setState] = useState([])
    useEffect(() => {
        (
            async () => {
                let res: undefined | Array<Chat> = await getChats()
                res && setState(res)
            }
        )()
    }, [])
    console.log({state})
    return state.map((chat: Chat) => {
        let name = chat.name;
        if (name=="private_chat"){
            name = "user.name"
        }
        return <ListItem>
            <ListItemAvatar>
                {/*<Avatar>*/}
                {/*    <ImageIcon/>*/}
                {/*</Avatar>*/}
            </ListItemAvatar>
            <ListItemText primary={name} secondary="Jan 9, 2014"/>
        </ListItem>
    })
}

export default ChatsPage