import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import formatTimestamp, { formatRelativeTime } from "../../utils/time";
import { Box, Button, Divider } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { logger } from "../../DevUtils/logData";
// Styled component for the notification item
const NotificationItem = styled(ListItem)(({ theme, isRead }) => ({
  padding: theme.spacing(2),
  backgroundColor: isRead ? theme.palette.action.hover : "inherit",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
  opacity: isRead ? 0.7 : 1, // Dim seen notifications
}));

const ExpandedNotificationContent = ({
  notification,
  onPromiseAction,
  onClose,
}) => {
  const getStatus = (notification) => {
    const payment =
      notification.content.CustomContract?.[1] ||
      notification.content.CPaymentContract?.[0];
    return payment && Object.keys(payment.status)[0];
  };

  const formatDate = (timestamp) => {
    return formatRelativeTime(timestamp);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: "100%",
        backgroundColor: "background.paper",
        boxShadow: 3,
        zIndex: 1000,
        padding: 2,
        borderRadius: 1,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          ID:{" "}
          {notification.content.CustomContract?.[1].id ||
            notification.content.CPaymentContract?.[0].id}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Amount:{" "}
          {notification.content.CustomContract?.[1].amount ||
            notification.content.CPaymentContract?.[0].amount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Status: {getStatus(notification)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created:{" "}
          {formatDate(
            notification.content.CustomContract?.[1].date_created ||
              notification.content.CPaymentContract?.[0].date_created,
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Released:{" "}
          {formatDate(
            notification.content.CustomContract?.[1].date_released ||
              notification.content.CPaymentContract?.[0].date_released,
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Contract ID:{" "}
          {notification.content.CustomContract?.[1].contract_id ||
            notification.content.CPaymentContract?.[0].contract_id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sender:{" "}
          {notification.content.CustomContract?.[1].sender.toString() ||
            notification.content.CPaymentContract?.[0].sender.toString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Receiver:{" "}
          {notification.content.CustomContract?.[1].receiver.toString() ||
            notification.content.CPaymentContract?.[0].receiver.toString()}
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Button
        fullWidth
        startIcon={<CheckCircleOutlineIcon />}
        onClick={() => onPromiseAction("approve")}
        sx={{ mb: 1, justifyContent: "flex-start" }}
      >
        Approve
      </Button>

      <Button
        fullWidth
        startIcon={<SendIcon />}
        onClick={() => onPromiseAction("release")}
        sx={{ mb: 1, justifyContent: "flex-start" }}
      >
        Request Release
      </Button>

      <Button
        fullWidth
        startIcon={<ErrorOutlineIcon />}
        onClick={() => {
          const reason = window.prompt("Enter objection reason:");
          if (reason) onPromiseAction("object", reason);
        }}
        sx={{ justifyContent: "flex-start" }}
      >
        Object with Reason
      </Button>
    </Box>
  );
};

const NotificationsButton = ({
  notifications,
  onNotificationClick,
  onPromiseAction,
}) => {
  // logger({ notifications });
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setExpandedNotification(null);
  };

  const handleNotificationClick = async (notification) => {
    const updatedNotification = { ...notification, is_seen: true };
    if (
      "CustomContract" in updatedNotification.content ||
      "CPaymentContract" in updatedNotification.content
    ) {
      setExpandedNotification(updatedNotification);
    }

    if (!notification.is_seen) {
      await onNotificationClick(notification.id);
    }
  };

  const handlePromiseAction = (action, reason = "") => {
    if (expandedNotification) {
      const payment =
        "CustomContract" in expandedNotification.content
          ? expandedNotification.content.CustomContract[1]
          : expandedNotification.content.CPaymentContract[0];

      onPromiseAction(payment, action, reason);
      setExpandedNotification(null);
      handleClose();
    }
  };

  const getNotificationMessage = (content) => {
    if ("CustomContract" in content) {
      return `New custom contract payment: ${content.CustomContract[1].amount}`;
    }
    if ("ContractUpdate" in content) {
      return `Contract updated: ${content.ContractUpdate.contract_id}`;
    }
    if ("FriendRequest" in content) {
      return `Friend request from ${content.FriendRequest.friend.sender.name}`;
    }
    if ("AcceptFriendRequest" in content) {
      return "Friend request accepted";
    }
    if ("ApproveShareRequest" in content) {
      return `Share request approved: ${content.ApproveShareRequest}`;
    }
    if ("CPaymentContract" in content) {
      return `Payment update: ${content.CPaymentContract[0].amount}`;
    }
    if ("Unfriend" in content) {
      return "Someone removed you from their friends list";
    }
    if ("ReceivedDeposit" in content) {
      return `Received deposit: ${content.ReceivedDeposit}`;
    }
    if ("ApplyShareRequest" in content) {
      return `New share request: ${content.ApplyShareRequest}`;
    }
    if ("NewMessage" in content) {
      return `New message: ${content.NewMessage.message}`;
    }
    if ("RemovedFromChat" in content) {
      return `Removed from chat: ${content.RemovedFromChat}`;
    }
    return "Unknown notification type";
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_seen,
  ).length;

  const formatDate = (timestamp) => {
    return formatRelativeTime(timestamp);
  };

  const ExpandedNotification = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    margin: theme.spacing(1),
    animation: "slideIn 0.3s ease-out",
    "@keyframes slideIn": {
      from: { transform: "translateX(100%)", opacity: 0 },
      to: { transform: "translateX(0)", opacity: 1 },
    },
  }));

  const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    width: "100%",
    justifyContent: "flex-start",
    textTransform: "none",
  }));

  const getStatus = (notification) => {
    const payment =
      notification.content.CustomContract?.[1] ||
      notification.content.CPaymentContract?.[0];
    return payment && Object.keys(payment.status)[0];
  };

  return (
    <>
      <IconButton
        aria-label="notifications"
        onClick={handleClick}
        aria-controls={open ? "notifications-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: "320px",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="textSecondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          <>
            <List sx={{ padding: 0 }}>
              {notifications.map((notification) => (
                <Box key={notification.id} sx={{ position: "relative" }}>
                  <NotificationItem
                    onClick={() => handleNotificationClick(notification)}
                    button
                    isRead={notification.is_seen}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.is_seen
                              ? "normal"
                              : "bold",
                            opacity: notification.is_seen ? 0.7 : 1,
                            color: notification.is_seen
                              ? "text.secondary"
                              : "text.primary",
                          }}
                        >
                          {getNotificationMessage(notification.content)}
                        </Typography>
                      }
                      secondary={formatDate(notification.time)}
                      secondaryTypographyProps={{
                        variant: "caption",
                        sx: { opacity: notification.is_seen ? 0.7 : 1 },
                      }}
                    />
                  </NotificationItem>
                  {expandedNotification?.id === notification.id && (
                    <ExpandedNotificationContent
                      notification={expandedNotification}
                      onPromiseAction={handlePromiseAction}
                    />
                  )}
                </Box>
              ))}
            </List>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationsButton;
