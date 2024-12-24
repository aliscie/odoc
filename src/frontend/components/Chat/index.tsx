import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import ChatWindow from "./chatWindow";
import { useBackendContext } from "../../contexts/BackendContext";
import { useSelector } from "react-redux";
import formatTimestamp from "../../utils/time";
import { Chat, Message } from "../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { randomString } from "../../DataProcessing/dataSamples";

// Memoized form components
const GroupNameField = memo(({ value, onChange }) => (
  <TextField
    label="Group Name"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
  />
));

export const MembersSelect = memo(({ value, onChange, users }) => (
  <Autocomplete
    multiple
    options={users}
    getOptionLabel={(option) => option.name}
    value={value}
    onChange={(_, newValue) => onChange(newValue)}
    renderInput={(params) => <TextField {...params} label="Select Members" />}
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip label={option.name} {...getTagProps({ index })} />
      ))
    }
  />
));

export const AdminsSelect = memo(({ value, onChange, members }) => (
  <Autocomplete
    multiple
    options={members}
    getOptionLabel={(option) => option.name}
    value={value}
    onChange={(_, newValue) => onChange(newValue)}
    renderInput={(params) => <TextField {...params} label="Select Admins" />}
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip label={option.name} {...getTagProps({ index })} />
      ))
    }
  />
));

const WorkspaceSelect = memo(({ value, onChange, workspaces }) => (
  <Autocomplete
    multiple
    options={workspaces}
    getOptionLabel={(option) => option.name}
    value={value}
    onChange={(_, newValue) => onChange(newValue)}
    renderInput={(params) => <TextField {...params} label="Workspaces" />}
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip label={option.name} {...getTagProps({ index })} />
      ))
    }
  />
));

// Memoized Create Group Dialog
const CreateGroupDialog = memo(
  ({ open, onClose, onSubmit, initialData, users, workspaces }) => {
    const [formData, setFormData] = useState(initialData);

    const handleNameChange = useCallback((name) => {
      setFormData((prev) => ({ ...prev, name }));
    }, []);

    const handleMembersChange = useCallback((members) => {
      setFormData((prev) => ({ ...prev, members }));
    }, []);

    const handleAdminsChange = useCallback((admins) => {
      setFormData((prev) => ({ ...prev, admins }));
    }, []);

    const handleWorkspaceChange = useCallback((workspace) => {
      setFormData((prev) => ({ ...prev, workspace }));
    }, []);

    const handleSubmit = useCallback(() => {
      onSubmit(formData);
    }, [formData, onSubmit]);

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Group Chat</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <GroupNameField value={formData.name} onChange={handleNameChange} />
            <MembersSelect
              value={formData.members}
              onChange={handleMembersChange}
              users={users}
            />
            <AdminsSelect
              value={formData.admins}
              onChange={handleAdminsChange}
              members={formData.members}
            />
            <WorkspaceSelect
              value={formData.workspace}
              onChange={handleWorkspaceChange}
              workspaces={workspaces}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

const ChatList = memo(
  ({
    chats,
    onChatClick,
    currentUserId,
  }: {
    chats: Chat[];
    onChatClick: (chat: Chat) => void;
    currentUserId: string;
  }) => {
    // Calculate unread count for each chat if not already present
    const chatsWithUnread = chats.map((chat) => {
      if ("unread" in chat) return chat;

      const unseenCount = chat.messages.reduce((count, message) => {
        const isSeen = message.seen_by.some(
          (user) => user.toString() === currentUserId,
        );
        return count + (isSeen ? 0 : 1);
      }, 0);

      return {
        ...chat,
        unread: unseenCount,
      };
    });

    const { all_friends } = useSelector((state: any) => state.filesState);

    const getOtherUser = (chat) => {
      if (chat.name !== "private_chat") return null;
      console.log({ chat, all_friends, currentUserId });
      return all_friends.find(
        (f) =>
          chat.admins.map((a) => a.id)?.includes(f.id) &&
          f.id !== currentUserId,
      );
    };

    return (
      <List sx={{ padding: 0, width: "100%" }}>
        {chatsWithUnread.map((chat) => {
          const otherUser = getOtherUser(chat);

          return (
            <ListItem
              key={chat.id}
              onClick={() => onChatClick(chat)}
              button
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemAvatar>
                {chat.name === "private_chat" ? (
                  <Avatar src={otherUser?.avatar}>
                    {otherUser?.name?.charAt(0)}
                  </Avatar>
                ) : (
                  <Avatar>
                    <GroupIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle2">
                      {chat.name === "private_chat"
                        ? otherUser?.name || "Unknown User"
                        : chat.name}
                    </Typography>
                    {chat.unread > 0 && (
                      <Badge badgeContent={chat.unread} color="error" />
                    )}
                  </Box>
                }
                secondary={
                  chat.messages[chat.messages.length - 1]?.message ||
                  "No messages"
                }
              />
            </ListItem>
          );
        })}
      </List>
    );
  },
);

const ChatNotifications = ({ chats: initialChats }: { chats: Chat[] }) => {
  const [openChats, setOpenChats] = useState(
    new Map<string, { x: number; y: number }>(),
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>(initialChats || []);

  const { backendActor } = useBackendContext();
  const { profile, currentWorkspace } = useSelector((state: any) => state.filesState);

  // Calculate total unseen messages across all chats
  const totalUnseenMessages = useMemo(() => {
    if (!profile?.id) return 0;

    return chats.reduce((total, chat) => {
      const unseenInChat = chat.messages.reduce((count, message) => {
        const isSeen = message.seen_by.some(
          (user) => user.toString() === profile.id,
        );
        return count + (isSeen ? 0 : 1);
      }, 0);
      return total + unseenInChat;
    }, 0);
  }, [chats, profile?.id]);

  const handleOpenChat = useCallback((chat: Chat) => {
    setOpenChats((prev) => {
      const newChats = new Map(prev);
      if (!newChats.has(chat.id)) {
        const offset = newChats.size * 30;
        newChats.set(chat.id, {
          x: 100 + offset,
          y: 100 + offset,
        });
      }
      return newChats;
    });
  }, []);

  const handleCloseChat = useCallback((chatId: string) => {
    setOpenChats((prev) => {
      const newChats = new Map(prev);
      newChats.delete(chatId);
      return newChats;
    });
  }, []);

  const handleChatPosition = useCallback(
    (chatId: string, position: { x: number; y: number }) => {
      setOpenChats((prev) => {
        const newChats = new Map(prev);
        newChats.set(chatId, position);
        return newChats;
      });
    },
    [],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleChatClick = useCallback(
    async (chat: Chat) => {
      try {
        // Get latest unseen message
        const unseenMessages = chat.messages.filter((message) => {
          const isSeen = message.seen_by.some(
            (user) => user.toString() === profile?.id,
          );
          return !isSeen;
        });

        // Update local state immediately
        setChats((prevChats) =>
          prevChats.map((prevChat) => {
            if (prevChat.id !== chat.id) return prevChat;

            // Update all messages' seen status for this chat
            const updatedMessages = prevChat.messages.map((msg) => ({
              ...msg,
              seen_by: msg.seen_by.some(
                (user) => user.toString() === profile?.id,
              )
                ? msg.seen_by
                : [...msg.seen_by, Principal.fromText(profile?.id)],
            }));

            return {
              ...prevChat,
              messages: updatedMessages,
              unread: 0, // Add unread property and set to 0
            };
          }),
        );

        // Call backend if there are unseen messages

        handleOpenChat(chat);
        handleClose();

        if (unseenMessages.length > 0) {
          const latestMessage = unseenMessages[unseenMessages.length - 1];
          const messageForBackend = {
            ...latestMessage,
            date: BigInt(0),
            sender: Principal.fromText(latestMessage.sender.toString()),
            seen_by: [],
            chat_id: chat.id,
          };

          await backendActor?.message_is_seen(messageForBackend);
        }
      } catch (error) {
        console.error("Error marking messages as seen:", error);
        handleOpenChat(chat);
        handleClose();
      }
    },
    [profile?.id, backendActor, handleOpenChat, handleClose],
  );

  const handleCreateGroup = useCallback(
    async (formData: any) => {
      if (!backendActor || !profile?.id) return;

      try {
        const newChat: Chat = {
          id: randomString(),
          name: formData.name || "Untitled",
          messages: [],
          members: formData.members?.length > 0
            ? formData.members.map((m) => Principal.fromText(m.id))
            : [Principal.fromText(profile.id)],
          admins: formData.admins?.length > 0
            ? formData.admins.map((a) => Principal.fromText(a.id))
            : [Principal.fromText(profile.id)],
          workspaces: formData.workspace?.length > 0 
            ? formData.workspace.map(w => w.id)
            : (currentWorkspace && currentWorkspace.name !== "default") ? [currentWorkspace.id] : [],
          creator: Principal.fromText(profile.id),
        };

        const result = await backendActor.make_new_chat_room(newChat);
        if ("Ok" in result) {
          // Add new chat to local state
          setChats((prevChats) => [...prevChats, newChat]);
          // Open the new chat window
          handleOpenChat(newChat);
        } else {
          console.log("Failed to create chat:", result.Err);
        }
      } catch (error) {
        console.log("Error creating chat:", error);
      }

      setCreateGroupOpen(false);
    },
    [backendActor, profile?.id, handleOpenChat],
  );

  const handleSendMessage = useCallback(
    async (chatId: string, messageText: string) => {
      if (!profile?.id || !messageText.trim()) return;

      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;

      const newMessage: Message = {
        id: randomString(),
        date: BigInt(Date.now() * 1e6),
        sender: Principal.fromText(profile.id),
        seen_by: [Principal.fromText(profile.id)],
        message: messageText, // Use the actual message text
        chat_id: chatId,
      };

      try {
        // Send message to backend with recipients
        const res = await backendActor?.send_message([], newMessage);
        // console.log("Message sent:", { res });

        // Update local state
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat,
          ),
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [profile, backendActor, chats],
  );

  const open = anchorEl && Boolean(anchorEl);
  const { all_friends, workspaces } = useSelector(
    (state: any) => state.filesState,
  );

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? "chat-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Badge badgeContent={totalUnseenMessages} color="error">
          <ChatIcon />
        </Badge>
      </IconButton>

      <Menu
        id="chat-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 500,
            width: 320,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem sx={{ justifyContent: "center" }}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            onClick={() => setCreateGroupOpen(true)}
          >
            Create New Group
          </Button>
        </MenuItem>

        <ChatList
          chats={chats}
          onChatClick={handleChatClick}
          currentUserId={profile?.id}
        />
      </Menu>

      {Array.from(openChats.entries()).map(([chatId, position]) => {
        const chat = chats.find((c) => c.id === chatId);
        if (!chat) return null;

        return (
          <ChatWindow
            key={chatId}
            chat={chat}
            position={position}
            onClose={handleCloseChat}
            onPositionChange={handleChatPosition}
            onSendMessage={(currentChatId, message) =>
              handleSendMessage(chatId, message)
            }
            user={profile}
          />
        );
      })}

      <CreateGroupDialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onSubmit={handleCreateGroup}
        initialData={{
          name: "",
          members: [],
          admins: [],
          workspace: currentWorkspace ? [currentWorkspace] : [],
        }}
        users={all_friends}
        workspaces={workspaces}
      />
    </>
  );
};

export default ChatNotifications;
