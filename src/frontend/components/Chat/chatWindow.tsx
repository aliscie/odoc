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
  Button,
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
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { randomString } from "../../DataProcessing/dataSamples";
import formatTimestamp from "../../utils/time";
import { isConstantNode } from "mathjs";
import { Link } from "react-router-dom";
import { Chat } from "../../../declarations/backend/backend.did";

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
    const [isSending, setIsSaving] = useState(false);
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

            {chat.name !== "private_chat" && (
              <>
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

                <Typography variant="subtitle1" gutterBottom>
                  Members
                </Typography>
                <List>
                  {editedMembers.map((member) => {
                    const user = all_friends.find(
                      (f) => f.id === member.toString(),
                    );
                    return (
                      <ListItem key={member.toString()}>
                        <ListItemText
                          primary={user?.name || member.toString().slice(0, 8)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => {
                              setEditedMembers(
                                editedMembers.filter(
                                  (m) => m.toString() !== member.toString(),
                                ),
                              );
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={async () => {
                    const updatedChat: Chat = {
                      ...chat,
                      admins: chat.admins.map((a) => Principal.fromText(a.id)),
                      creator: Principal.fromText(chat.creator.id),
                      workspaces: [selectedWorkspace],
                      members: editedMembers,
                    };

                    try {
                      console.log({ updatedChat });
                      const result =
                        await backendActor.update_chat(updatedChat);
                      if ("Ok" in result) {
                        if (onUpdateChat) {
                          onUpdateChat(updatedChat);
                        }
                        setIsSettingsView(false);
                      }
                    } catch (error) {
                      console.error("Failed to update chat:", error);
                    }
                  }}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        )}
      </Paper>
    );
  },
);

export default ChatWindow;
