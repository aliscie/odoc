import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {AdminsSelect, MembersSelect, WorkspaceSelect} from "./index";
import {
  ArrowBack as ArrowBackIcon,
  Check,
  DragIndicator as DragHandle,
  OpenInFull as OpenInFullIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import {useBackendContext} from "../../contexts/BackendContext";
import {useDispatch, useSelector} from "react-redux";
import {Principal} from "@dfinity/principal";
import formatTimestamp from "../../utils/time";
import {Link} from "react-router-dom";
import {Chat} from "../../../declarations/backend/backend.did";
import {handleRedux} from "../../redux/store/handleRedux";

const ChatWindow = memo(
  ({
    chat,
    onClose,
    position,
    onPositionChange,
    onSendMessage,
    onUpdateChat,
    dialog = false,
  }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isSettingsView, setIsSettingsView] = useState(false);
    const [formData, setFormData] = useState({
      name: chat.name,
      workspaces: chat.workspaces,
      admins: chat.admins,
      members: chat.members,
    });
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
    const [saveSuccess, setSaveSuccess] = useState(false);
    const messagesEndRef = useRef(null);
    const saveSuccessTimeout = useRef(null);

    useEffect(() => {
      // setSelectedWorkspace(chat.workspaces[0] || "");
      // setEditedMembers(chat.members);
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

    const handleSaveChat = async (updatedChat: Chat) => {
      setIsSaving(true);
      try {
        // Keep existing Principals if they're already Principal objects
        const formattedChat = {
          ...updatedChat,
          admins: updatedChat.admins.map((a) => Principal.fromText(a.id || a)),
          creator:
            updatedChat.creator instanceof Principal
              ? updatedChat.creator
              : Principal.fromText(updatedChat.creator.id),
          members: updatedChat.members.map((m) =>
            Principal.fromText(m.id || m),
          ),
          messages: updatedChat.messages.map((msg) => ({
            ...msg,
            sender:
              msg.sender instanceof Principal
                ? msg.sender
                : Principal.fromText(msg.sender),
            seen_by: msg.seen_by.map((s) =>
              s instanceof Principal ? s : Principal.fromText(s),
            ),
            date:
              typeof msg.date === "bigint"
                ? msg.date
                : BigInt(msg.date.toString()),
          })),
        };
        const result = await backendActor.update_chat(formattedChat);
        if ("Ok" in result) {
          if (onUpdateChat) {
            onUpdateChat(result.Ok);
          }
          setEditedName(result.Ok.name);
          setSaveSuccess(true);
          if (saveSuccessTimeout.current) {
            clearTimeout(saveSuccessTimeout.current);
          }
          saveSuccessTimeout.current = setTimeout(() => {
            setSaveSuccess(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to update chat:", error);
      } finally {
        setIsSaving(false);
      }
    };
    const content = (
      <>
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
            <Typography
              to={`user?id=${chat.members.find((m) => m.toText() != profile?.id)}`}
              component={Link}
              variant="subtitle2"
              sx={{ flex: 1 }}
            >
              {chat.name == "private_chat"
                ? renderSenderName(
                    chat.members.find((m) => m.toText() != profile?.id),
                  )
                : chat.name}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <OpenInFullIcon /> : <MinimizeIcon />}
            </IconButton>
            {chat.name !== "private_chat" &&
              chat.creator?.id === profile?.id &&
              (isSettingsView ? (
                <IconButton
                  size="small"
                  onClick={() => setIsSettingsView(false)}
                >
                  <ArrowBackIcon />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  onClick={() => setIsSettingsView(true)}
                >
                  <SettingsIcon />
                </IconButton>
              ))}
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
                      sx={{
                        cursor: "pointer",
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                          opacity: 0.85,
                        },
                      }}
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
                  value={formData.name}
                  onChange={(e) => {
                    if (e.target.value === "private_chat") {
                      e.target.value = "private chat";
                    }
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  sx={{ mb: 2 }}
                />
                <WorkspaceSelect
                  value={workspaces.filter((w) =>
                    formData.workspaces.includes(w.id),
                  )}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      workspaces: newValue.map((w) => w.id),
                    }));
                  }}
                  workspaces={workspaces}
                />

                <AdminsSelect
                  value={all_friends.filter((f) =>
                    formData.admins.some((a) => a.toString() === f.id),
                  )}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      admins: newValue.map((admin) => admin.id),
                    }));
                  }}
                  members={all_friends}
                />

                <MembersSelect
                  value={all_friends.filter((f) =>
                    formData.members.some((m) => m.toString() === f.id),
                  )}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      members: newValue.map((member) => member.id),
                    }));
                  }}
                  users={all_friends}
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color={saveSuccess ? "success" : "primary"}
                    fullWidth
                    disabled={isSaving}
                    startIcon={
                      isSaving ? (
                        <CircularProgress size={20} />
                      ) : saveSuccess ? (
                        <Check />
                      ) : null
                    }
                    onClick={async () => {
                      const updatedChat: Chat = {
                        ...chat,
                        name: formData.name,
                        admins: formData.admins,
                        creator: chat.creator,
                        workspaces: formData.workspaces,
                        members: formData.members,
                      };
                      await handleSaveChat(updatedChat);
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
      </>
    );

    return dialog ? (
      <Dialog
        open={true}
        onClose={() => onClose(chat.id)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            height: 600,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {content}
      </Dialog>
    ) : (
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
        {content}
      </Paper>
    );
  },
);

export default ChatWindow;
