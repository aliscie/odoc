import * as React from "react";
import {useEffect, useState} from "react";
import useGetChats from "../components/chat/use_get_chats";
import {FEChat} from "../../declarations/user_canister/user_canister.did";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import {useDispatch, useSelector} from "react-redux";
import MessagesList from "../components/chat/messages_list";
import {handleRedux} from "../redux/main";

interface Props {
}

function ChatItem(props: FEChat) {
    console.log("chat item")
    const dispatch = useDispatch();
    let {getOther} = useGetChats()
    let user = getOther(props);

    return <ListItem key={props.id} onClick={async () => {

        dispatch(handleRedux("OPEN_CHAT", {
            current_chat_id: props.id,
            current_user: user,
        }))
    }
    }>
        <ListItemAvatar>
            {/* <Avatar>
                                    <ImageIcon />
                                </Avatar> */}
        </ListItemAvatar>
        <ListItemText primary={user ? user.name : "null"}/>
    </ListItem>
}

function ChatsPage(props: Props) {


    const {current_user} = useSelector((state: any) => state.chatsReducer);
    const {profile} = useSelector((state: any) => state.filesReducer);
    const dispatch = useDispatch();
    let {getChats} = useGetChats();

    const [chats, setChats] = useState<Array<FEChat>>([]);
    // const {current_chat_id, chats} = useSelector((state: any) => state.chatsReducer);
    //

    useEffect(() => {
        (
            async () => {
                let res: undefined | Array<FEChat> = await getChats();
                res && setChats(res);
            }
        )()
    }, [chats]);


    return (
        <div style={{display: 'flex'}}>
            {/* Left side - Chat list */}
            <div style={{width: '200px', borderRight: '1px solid #ccc', padding: '16px'}}>
                <List>
                    {chats.map((chat: FEChat) => <ChatItem {...chat}/>)}
                </List>
            </div>

            {/* Right side - Messages list */}
            <div style={{flex: 1, padding: '16px'}}>
                <MessagesList/>
            </div>
        </div>
    );
}

export default ChatsPage;
