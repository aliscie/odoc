import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button, Autocomplete, Chip,
} from "@mui/material";
import {
  DragIndicator as DragHandle,
  OpenInFull as OpenInFullIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import { useBackendContext } from "../../contexts/BackendContext";
import { useDispatch, useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { randomString } from "../../DataProcessing/dataSamples";
import formatTimestamp from "../../utils/time";
import { isConstantNode } from "mathjs";
import { Link } from "react-router-dom";
import { Chat } from "../../../declarations/backend/backend.did";
import { handleRedux } from "../../redux/store/handleRedux";

const ChatWindow = memo(
  ({
    chat,
    onClose,
    position,
    onPositionChange,
    onSendMessage,
    onUpdateChat,
  }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isSettingsView, setIsSettingsView] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState(
      chat.workspaces[0] || "",
    );
    const [editedMembers, setEditedMembers] = useState(chat.members);
    const { workspaces, all_friends, profile } = useSelector(
      (state: any) => state.filesState,
    );
    const { backendActor } = useBackendContext();
    const [dragPosition, setDragPosition] = useState(position);
    const [newMessage, setNewMessage] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [editedName, setEditedName] = useState(chat.name);
    const [isSaving, setIsSaving] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
      setSelectedWorkspace(chat.workspaces[0] || "");
      setEditedMembers(chat.members);
    }, [chat]);

    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [chat.messages, scrollToBottom]);

    const renderSenderName = (sender) => {
      // Handle case where sender is a Principal object
      if (sender instanceof Principal) {
        const senderStr = sender.toString();
        return senderStr === profile?.id
          ? "You"
          : `${all_friends.find((u) => u.id === sender.toString())?.name || sender.toString().slice(8, 16)}`;
      }
      // Handle case where sender is an object with __principal__
      if (sender?.toString()) {
        return sender.toString() === profile?.id
          ? "You"
          : `${all_friends.find((u) => u.id === sender.toString())?.name || sender.toString().slice(8, 16)}`;
      }
      // Fallback
      return "Unknown User";
    };

    const isCurrentUser = (sender) => {
      if (sender instanceof Principal) {
        return sender.toString() === profile?.id;
      }
      return sender?.__principal__ === profile?.id;
    };
    const handleSendMessage = useCallback(
      async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !profile?.id || isSending) return;

        try {
          setIsSending(true);
          await onSendMessage(chat.id, newMessage);
          setNewMessage("");
          scrollToBottom();
        } catch (error) {
          console.error("Error sending message:", error);
        } finally {
          setIsSending(false);
        }
      },
      [
        chat.id,
        newMessage,
        profile?.id,
        isSending,
        onSendMessage,
        scrollToBottom,
      ],
    );

    const handleDragStart = useCallback((e) => {
      setIsDragging(true);
      const boundingRect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - boundingRect.left;
      const offsetY = e.clientY - boundingRect.top;
      e.currentTarget.dataset.offsetX = offsetX;
      e.currentTarget.dataset.offsetY = offsetY;
    }, []);

    const handleDrag = useCallback(
      (e) => {
        if (!isDragging || !e.clientX || !e.clientY) return;
        const offsetX = parseFloat(e.currentTarget.dataset.offsetX);
        const offsetY = parseFloat(e.currentTarget.dataset.offsetY);
        setDragPosition({
          x: Math.max(0, e.clientX - offsetX),
          y: Math.max(0, e.clientY - offsetY),
        });
      },
      [isDragging],
    );

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
      onPositionChange(chat.id, dragPosition);
    }, [chat.id, dragPosition, onPositionChange]);
    const dispatch = useDispatch();

    const handleSavePost = async (updatedChat: Chat) => {
      setIsSaving(true);
      try {
        const result = await backendActor.update_chat(updatedChat);
        if ("Ok" in result) {
          if (onUpdateChat) {
            onUpdateChat(updatedChat);
          }
        }
      } catch (error) {
        console.error("Failed to update chat:", error);
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          top: dragPosition.y,
          left: dragPosition.x,
          width: 320,
          height: isMinimized ? "auto" : 400,
          display: "flex",
          flexDirection: "column",
          zIndex: 1200,
          resize: "both",
          overflow: "hidden",
        }}
      >
        <AppBar
          position="static"
          color="default"
          elevation={1}
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={() => setIsDragging(false)}
          sx={{ cursor: "move" }}
        >
          <Toolbar variant="dense">
            <DragHandle sx={{ mr: 1 }} />
            <Typography variant="subtitle2" sx={{ flex: 1 }}>
              {chat.name}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <OpenInFullIcon /> : <MinimizeIcon />}
            </IconButton>
            {isSettingsView ? (
              <IconButton size="small" onClick={() => setIsSettingsView(false)}>
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={() => setIsSettingsView(true)}>
                <SettingsIcon />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => onClose(chat.id)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {!isMinimized && !isSettingsView && (
          <>
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {chat.messages.map((message) => {
                const isOwnMessage = isCurrentUser(message.sender);

                return (
                  <Paper
                    key={message.id}
                    sx={{
                      p: 1,
                      mb: 1,
                      maxWidth: "80%",
                      ml: isOwnMessage ? "auto" : 0,
                      bgcolor: isOwnMessage
                        ? "primary.dark"
                        : "background.paper",
                      color: isOwnMessage
                        ? "primary.contrastText"
                        : "text.primary",
                    }}
                  >
                    <Typography
                      to={`user?id=${message.sender.toString()}`}
                      component={Link}
                      variant="subtitle2"
                    >
                      {renderSenderName(message.sender)}
                    </Typography>
                    <Typography variant="body2">{message.message}</Typography>
                    <Typography
                      variant="caption"
                      color={
                        isOwnMessage ? "primary.contrastText" : "text.secondary"
                      }
                    >
                      {formatTimestamp(message.date)}
                    </Typography>
                  </Paper>
                );
              })}
              <div ref={messagesEndRef} />
            </Box>

            <Paper sx={{ p: 1 }}>
              <form
                onSubmit={handleSendMessage}
                style={{ display: "flex", gap: 8 }}
              >
                <TextField
                  size="small"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  fullWidth
                  variant="outlined"
                  disabled={isSending}
                />
                <IconButton
                  type="submit"
                  color="primary"
                  size="small"
                  disabled={isSending || !newMessage.trim()}
                  sx={{
                    position: "relative",
                    width: 40, // Fixed width to prevent shifting
                    height: 40, // Fixed height to prevent shifting
                  }}
                >
                  {isSending ? (
                    <CircularProgress size={24} color="primary" />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </form>
            </Paper>
          </>
        )}

        {!isMinimized && isSettingsView && (
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chat Settings
            </Typography>

            {chat.creator?.id !== profile?.id ? (
              <Typography color="error">
                Only the chat creator can modify settings
              </Typography>
            ) : chat.name === "private_chat" ? (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Workspace</InputLabel>
                <Select
                  value={selectedWorkspace}
                  label="Workspace"
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                >
                  {workspaces.map((workspace) => (
                    <MenuItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Chat Name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Autocomplete
                  multiple
                  options={workspaces}
                  getOptionLabel={(option) => option.name}
                  value={workspaces.filter(w => chat.workspaces.includes(w.id))}
                  onChange={(_, newValue) => {
                    const updatedChat = {
                      ...chat,
                      workspaces: newValue.map(w => w.id),
                      admins: chat.admins.map(a => Principal.fromText(a.toString())),
                      creator: Principal.fromText(chat.creator.toString()),
                      members: chat.members.map(m => Principal.fromText(m.toString()))
                    };
                    handleSavePost(updatedChat);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Workspaces" fullWidth sx={{ mb: 2 }} />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        onDelete={() => {
                          const newValue = value.filter((_, i) => i !== index);
                          const updatedChat = {
                            ...chat,
                            workspaces: newValue.map(w => w.id),
                            admins: chat.admins.map(a => Principal.fromText(a.toString())),
                            creator: Principal.fromText(chat.creator.toString()),
                            members: chat.members.map(m => Principal.fromText(m.toString()))
                          };
                          handleSavePost(updatedChat);
                        }}
                      />
                    ))
                  }
                />

                <Autocomplete
                  multiple
                  options={all_friends}
                  getOptionLabel={(option) => option.name || option.id}
                  value={all_friends.filter(f => chat.admins.some(a => a.toString() === f.id))}
                  onChange={(_, newValue) => {
                    const updatedChat = {
                      ...chat,
                      admins: newValue.map(admin => Principal.fromText(admin.id)),
                      creator: Principal.fromText(chat.creator.toString()),
                      members: chat.members.map(m => Principal.fromText(m.toString()))
                    };
                    handleSavePost(updatedChat);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Admins" fullWidth sx={{ mb: 2 }} />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name || option.id}
                        {...getTagProps({ index })}
                        onDelete={() => {
                          const newValue = value.filter((_, i) => i !== index);
                          const updatedChat = {
                            ...chat,
                            admins: newValue.map(admin => Principal.fromText(admin.id)),
                            creator: Principal.fromText(chat.creator.toString()),
                            members: chat.members.map(m => Principal.fromText(m.toString()))
                          };
                          handleSavePost(updatedChat);
                        }}
                      />
                    ))
                  }
                />

                <Autocomplete
                  multiple
                  options={all_friends}
                  getOptionLabel={(option) => option.name || option.id}
                  value={all_friends.filter(f => chat.members.some(m => m.toString() === f.id))}
                  onChange={(_, newValue) => {
                    const updatedChat = {
                      ...chat,
                      members: newValue.map(member => Principal.fromText(member.id)),
                      admins: chat.admins.map(a => Principal.fromText(a.toString())),
                      creator: Principal.fromText(chat.creator.toString())
                    };
                    handleSavePost(updatedChat);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Members" fullWidth sx={{ mb: 2 }} />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name || option.id}
                        {...getTagProps({ index })}
                        onDelete={() => {
                          const newValue = value.filter((_, i) => i !== index);
                          const updatedChat = {
                            ...chat,
                            members: newValue.map(member => Principal.fromText(member.id)),
                            admins: chat.admins.map(a => Principal.fromText(a.toString())),
                            creator: Principal.fromText(chat.creator.toString())
                          };
                          handleSavePost(updatedChat);
                        }}
                      />
                    ))
                  }
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSaving}
                    onClick={() => {
                      const updatedChat: Chat = {
                        ...chat,
                        name: editedName,
                        admins: chat.admins.map((a) =>
                          Principal.fromText(a.id),
                        ),
                        creator: Principal.fromText(chat.creator.id),
                        workspaces: [selectedWorkspace],
                        members: editedMembers,
                      };
                      handleSavePost(updatedChat);
                      setIsSettingsView(false);
                    }}
                  >
                    Save Changes
                  </Button>

                  {chat.name !== "private_chat" && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this chat? This action cannot be undone.",
                          )
                        ) {
                          backendActor
                            .delete_chat(chat.id)
                            .then((result) => {
                              if ("Ok" in result && onClose) {
                                dispatch(
                                  handleRedux("DELETE_CHAT", {
                                    chat_id: chat.id,
                                  }),
                                );
                                onClose(chat.id);
                              }
                            })
                            .catch((error) => {
                              console.error("Failed to delete chat:", error);
                            });
                        }
                      }}
                    >
                      Delete Chat
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Box>
        )}
      </Paper>
    );
  },
);

export default ChatWindow;
