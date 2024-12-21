import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  DragIndicator as DragHandle,
  OpenInFull as OpenInFullIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import { formatDate } from "@storybook/blocks";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdminsSelect, MembersSelect } from "./index";

const ChatSettings = memo(
  ({ chat, users, onUpdate, onDelete, onClose, onSendMessage }) => {
    const [name, setName] = useState(chat.name);
    const [members, setMembers] = useState(chat.members || []);
    const [admins, setAdmins] = useState(chat.admins || []);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleSubmit = useCallback(() => {
      onUpdate({
        ...chat,
        name,
        members,
        admins,
      });
      onClose();
    }, [chat, name, members, admins, onUpdate, onClose]);

    const handleDelete = useCallback(() => {
      setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      onDelete(chat.id);
      setDeleteDialogOpen(false);
      onClose();
    }, [chat.id, onDelete, onClose]);

    return (
      <>
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            Chat Settings
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Chat Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <MembersSelect
                value={members}
                onChange={setMembers}
                users={users}
              />
              <AdminsSelect
                value={admins}
                onChange={setAdmins}
                members={members}
              />
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{ mt: 2 }}
              >
                Delete Chat
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
);

const ChatWindow = memo(
  ({ chat, onClose, position, onPositionChange, onSendMessage }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState(position);
    const [newMessage, setNewMessage] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Add ref for messages container
    const messagesEndRef = useRef(null);

    // Add scroll to bottom function
    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Scroll when messages change
    useEffect(() => {
      scrollToBottom();
    }, [chat.messages, scrollToBottom]);

    const handleSendMessage = useCallback(
      (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
          onSendMessage(chat.id, newMessage);
          setNewMessage("");
          // Scroll will happen automatically due to useEffect
        }
      },
      [chat.id, newMessage, onSendMessage],
    );

    const handleDragStart = useCallback((e) => {
      setIsDragging(true);
      // Store the initial mouse position relative to the window
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

        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        setDragPosition({
          x: Math.max(0, newX),
          y: Math.max(0, newY),
        });
      },
      [isDragging],
    );

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
      onPositionChange(chat.id, dragPosition);
    }, [chat.id, dragPosition, onPositionChange]);

    const handleSettingsOpen = useCallback(() => {
      setIsSettingsOpen(true);
    }, []);

    const handleSettingsClose = useCallback(() => {
      setIsSettingsOpen(false);
    }, []);

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
            <IconButton size="small" onClick={handleSettingsOpen}>
              <SettingsIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onClose(chat.id)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {isSettingsOpen && (
          <ChatSettings
            chat={chat}
            users={[]}
            onClose={handleSettingsClose}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        )}

        {!isMinimized && (
          <>
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {chat.messages.map((message) => (
                <Paper
                  key={message.id}
                  sx={{
                    p: 1,
                    mb: 1,
                    maxWidth: "80%",
                    ml: message.sender === "You" ? "auto" : 0,
                    color: "text.primary", // Ensure text is readable
                  }}
                >
                  <Typography variant="subtitle2">{message.sender}</Typography>
                  <Typography variant="body2">{message.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(message.timestamp)}
                  </Typography>
                </Paper>
              ))}
              {/* Add invisible element for scrolling */}
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
                />
                <IconButton type="submit" color="primary" size="small">
                  <SendIcon />
                </IconButton>
              </form>
            </Paper>
          </>
        )}
      </Paper>
    );
  },
);

export default ChatWindow;
