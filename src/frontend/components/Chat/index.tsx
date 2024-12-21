import React, { useState, useCallback, memo } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Paper,
  ListItemAvatar,
  Avatar,
  Drawer,
  AppBar,
  Toolbar,
} from "@mui/material";
import { DragIndicator as DragHandle } from "@mui/icons-material";

import {
  Chat as ChatIcon,
  Add as AddIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  OpenInFull as OpenInFullIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import ChatWindow from "./chatWindow";

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
  <FormControl fullWidth>
    <InputLabel>Workspace</InputLabel>
    <Select
      value={value}
      label="Workspace"
      onChange={(e) => onChange(e.target.value)}
    >
      {workspaces.map((workspace) => (
        <MenuItem key={workspace.id} value={workspace.id}>
          {workspace.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
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

// Memoized Chat List
const ChatList = memo(({ chats, onChatClick }) => (
  <List sx={{ padding: 0, width: "100%" }}>
    {chats.map((chat) => (
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
          <Avatar>
            <GroupIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2">{chat.name}</Typography>
              {chat.unread > 0 && (
                <Badge badgeContent={chat.unread} color="error" />
              )}
            </Box>
          }
          secondary={
            <>
              <Typography variant="body2" color="textSecondary">
                {chat.messages[chat.messages.length - 1]?.content}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {formatDate(chat.messages[chat.messages.length - 1]?.timestamp)}
              </Typography>
            </>
          }
        />
      </ListItem>
    ))}
  </List>
));

// Memoized Chat View
const ChatView = memo(
  ({ chat, isFullView, onBack, onFullViewToggle, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState("");

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
          onSendMessage(newMessage);
          setNewMessage("");
        }
      },
      [newMessage, onSendMessage],
    );

    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <IconButton size="small" onClick={onBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ ml: 1, flex: 1 }}>
              {chat.name}
            </Typography>
            <IconButton onClick={onFullViewToggle}>
              <OpenInFullIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {chat.messages.map((message) => (
            <Paper
              key={message.id}
              sx={{
                p: 2,
                mb: 2,
                maxWidth: "80%",
                ml: message.sender === "You" ? "auto" : 0,
              }}
            >
              <Typography variant="subtitle2">{message.sender}</Typography>
              <Typography variant="body1">{message.content}</Typography>
              <Typography variant="caption" color="textSecondary">
                {formatDate(message.timestamp)}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Paper sx={{ p: 2 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
            <TextField
              size="small"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              fullWidth
              variant="outlined"
            />
            <IconButton type="submit" color="primary">
              <SendIcon />
            </IconButton>
          </form>
        </Paper>
      </Box>
    );
  },
);

// Helper function for date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Main component
const ChatNotifications = () => {
  const [openChats, setOpenChats] = useState(new Map()); // Map of chatId to window position

  const handleOpenChat = useCallback((chat) => {
    setOpenChats((prev) => {
      const newChats = new Map(prev);
      if (!newChats.has(chat.id)) {
        // Calculate position for new window with slight offset from previous
        const offset = newChats.size * 30;
        newChats.set(chat.id, {
          x: 100 + offset,
          y: 100 + offset,
        });
      }
      return newChats;
    });
  }, []);

  const handleCloseChat = useCallback((chatId) => {
    setOpenChats((prev) => {
      const newChats = new Map(prev);
      newChats.delete(chatId);
      return newChats;
    });
  }, []);

  const handleChatPosition = useCallback((chatId, position) => {
    setOpenChats((prev) => {
      const newChats = new Map(prev);
      newChats.set(chatId, position);
      return newChats;
    });
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  // const [isFullView, setIsFullView] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  // Sample data
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ];

  const workspaces = [
    { id: 1, name: "Marketing" },
    { id: 2, name: "Development" },
    { id: 3, name: "Sales" },
  ];

  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Project Team",
      messages: [
        {
          id: 1,
          sender: "John",
          content: "Can we schedule a meeting?",
          timestamp: "2024-12-18T10:30:00",
        },
        {
          id: 2,
          sender: "Jane",
          content: "Yes, how about tomorrow?",
          timestamp: "2024-12-18T10:35:00",
        },
      ],
      unread: 2,
    },
    {
      id: 2,
      name: "Marketing Group",
      messages: [
        {
          id: 1,
          sender: "Bob",
          content: "The new designs look great!",
          timestamp: "2024-12-18T09:15:00",
        },
      ],
      unread: 1,
    },
  ]);

  const initialGroupData = {
    name: "",
    members: [],
    admins: [],
    workspace: "",
  };

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedChat(null);
  }, []);

  const handleChatClick = useCallback(
    (chat) => {
      // Clear unread count for the clicked chat
      const updatedChats = chats.map((c) => {
        if (c.id === chat.id) {
          return { ...c, unread: 0 };
        }
        return c;
      });
      // Update the chats state here - you'll need to lift this state up
      // and pass setChats as a prop if you haven't already
      setChats(updatedChats);

      handleOpenChat(chat);
      setSelectedChat(null);
      setAnchorEl(null);
    },
    [handleOpenChat, chats, setChats],
  );

  const handleCreateGroup = useCallback((formData) => {
    console.log("Creating new group:", formData);
    setCreateGroupOpen(false);
  }, []);

  const handleSendMessage = useCallback((chatId, message) => {
    const newMessage = {
      id: Date.now(),
      sender: "You",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat,
      ),
    );
  }, []);

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread, 0);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? "chat-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Badge badgeContent={totalUnread} color="error">
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

        {selectedChat ? (
          <ChatView
            chat={selectedChat}
            // isFullView={isFullView}
            onBack={() => setSelectedChat(null)}
            // onFullViewToggle={() => setIsFullView(!isFullView)}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <ChatList chats={chats} onChatClick={handleChatClick} />
        )}
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
            onSendMessage={handleSendMessage} // Add this prop
          />
        );
      })}

      <CreateGroupDialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onSubmit={handleCreateGroup}
        initialData={initialGroupData}
        users={users}
        workspaces={workspaces}
      />
    </>
  );
};

export default ChatNotifications;
