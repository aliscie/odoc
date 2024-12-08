import React, { useEffect, useState } from "react";
import BasicMenu from "../MuiComponents/BasicMenu";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatNotification from "../ChatNotifications";
import { Message } from "../../../declarations/backend/backend.did";
import { useDispatch, useSelector } from "react-redux";
import { handleRedux } from "../../redux/store/handleRedux";
import { Badge } from "@mui/material";
import useCreateChatGroup from "./CreateNewGroup";
import { useBackendContext } from "../../contexts/BackendContext";

interface ChatsComponentProps {}

interface Option {
  public?: boolean;
  content: JSX.Element;
}

const ChatsComponent: React.FC<ChatsComponentProps> = () => {
  const { backendActor } = useBackendContext();
  const { chatGroup, searchValue } = useCreateChatGroup();
  const { profile, currentWorkspace } = useSelector(
    (state: any) => state.filesState,
  );
  const { chats_notifications, chats } = useSelector(
    (state: any) => state.chatsState,
  );
  const chatsWorkspace = chats
    .filter((c) => c.workspaces && !c.workspaces.includes(currentWorkspace.id))
    .map((c) => c.id);

  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (
        chats_notifications?.length === 0 &&
        chats_notifications.length === 0 &&
        backendActor
      ) {
        try {
          const res: Array<Message> =
            await backendActor.get_chats_notifications();
          if (res) {
            dispatch(handleRedux("SET_CHATS_NOTIFICATIONS", { messages: res }));
          }
        } catch (error) {
          console.log("Issue fetching notifications from backend: ", error);
        } finally {
          // setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [backendActor, chats]);

  const unseenMessages = profile
    ? chats_notifications &&
      chats_notifications.filter(
        (message: Message) =>
          !message.seen_by.some((user) => user.toString() === profile.id),
      )
    : [];

  const options: Option[] = [chatGroup];
  chats_notifications
    .filter((message: Message) =>
      message.message.toLowerCase().includes(searchValue.toLowerCase()),
    )
    .filter(
      (message) =>
        !chatsWorkspace.includes(message.chat_id) ||
        currentWorkspace.name.toLowerCase() === "default",
    )
    .forEach((message: Message) => {
      options.push({
        content: <ChatNotification key={chats_notifications} {...message} />,
      });
    });

  return (
    <BasicMenu
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      options={options}
    >
      <Badge
        key={unseenMessages && unseenMessages.length}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        badgeContent={unseenMessages && unseenMessages.length}
      >
        <ChatBubbleIcon
          color={
            unseenMessages && unseenMessages.length > 0 ? "error" : "action"
          }
        />
      </Badge>
    </BasicMenu>
  );
};

export default ChatsComponent;
