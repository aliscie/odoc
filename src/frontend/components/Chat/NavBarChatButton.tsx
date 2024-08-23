import React, { useState, useEffect } from 'react';
import BasicMenu from '../MuiComponents/BasicMenu';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatNotification from '../ChatNotifications';
import CircularProgress from '@mui/material/CircularProgress';
import { Message } from '../../../declarations/backend/backend.did';
import { useDispatch, useSelector } from 'react-redux';
import { handleRedux } from '../../redux/store/handleRedux';
import { Badge } from '@mui/material';
import useCreateChatGroup from './CreateNewGroup';
import { useBackendContext } from '../../contexts/BackendContext';

interface ChatsComponentProps {}

interface Option {
    public?: boolean;
    content: JSX.Element;
}

const ChatsComponent: React.FC<ChatsComponentProps> = () => {
    const { backendActor } = useBackendContext();
    const { chatGroup, searchValue } = useCreateChatGroup();
    const { profile } = useSelector((state: any) => state.filesState);
    const { chatsNotifications } = useSelector((state: any) => state.chatsState);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>(chatsNotifications);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (chatsNotifications?.length === 0) {
                setLoading(true);
                try {
                    const res = await backendActor?.getChatsNotifications();
                    if (res) {
                        setMessages(res);
                        dispatch(handleRedux('SET_CHATS_NOTIFICATIONS', { messages: res }));
                    }
                } catch (error) {
                    console.error("Issue fetching notifications from backend: ", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setMessages(chatsNotifications);
            }
        };

        fetchNotifications();
    }, [backendActor, chatsNotifications, dispatch]);

    const searchedMessages = messages.filter((message: Message) =>
        message.message.toLowerCase().includes(searchValue.toLowerCase())
    );

    const unseenMessages = profile
        ? messages.filter(
              (message: Message) => !message.seen_by.some((user) => user.toString() === profile.id)
          )
        : [];

    const options: Option[] = [chatGroup];

    if (loading) {
        options.push({ content: <CircularProgress /> });
    } else if (searchedMessages.length > 0) {
        searchedMessages.forEach((message: Message) => {
            options.push({ content: <ChatNotification key={message.id} {...message} /> });
        });
    } else {
        options.push({ content: <div>You have no messages yet!</div> });
    }

    return (
        <BasicMenu
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            options={options}
        >
            <Badge
                key={unseenMessages.length}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                badgeContent={unseenMessages.length}
            >
                <ChatBubbleIcon
                    color={unseenMessages.length > 0 ? 'error' : 'action'}
                />
            </Badge>
        </BasicMenu>
    );
};

export default ChatsComponent;
