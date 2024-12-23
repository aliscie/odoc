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
import { Box, Button, CircularProgress, Divider, Tooltip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import { logger } from "../../DevUtils/logData";
import FriendshipButton from "../FriendshipButton";
import { useSelector } from "react-redux";
import { useBackendContext } from "../../contexts/BackendContext";
import { Link } from "react-router-dom";
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

const NotificationsButton = ({
  notifications,
  onNotificationClick,
  onPromiseAction,
}) => {
  // logger({ notifications });
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [loadingNotifications, setLoadingNotifications] = useState(new Set());
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setExpandedNotification(null);
  };

  const { backendActor } = useBackendContext();

  const handleNotificationClick = async (notification) => {
    try {
      // Add notification to loading state
      setLoadingNotifications((prev) => new Set(prev).add(notification.id));

      // Handle seen status

      // Handle friend request specific logic
      if ("FriendRequest" in notification.content) {
        setExpandedNotification(notification);
      } else if (
        "CustomContract" in notification.content ||
        "CPaymentContract" in notification.content
      ) {
        setExpandedNotification(notification);
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    } finally {
      // Remove from loading state
      setLoadingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
    }
    if (!notification.is_seen) {
      let res = await backendActor?.see_notifications(notification.id);
      // Update local notification seen status
      notification.is_seen = true;
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
      return (
        <>
          Friend request from {content.FriendRequest.friend.sender.name},
          <Tooltip title="Accept friend request">
            <Typography
              sx={{ opacity: 1 }}
              color="primary"
              to={`user/?id=${content.FriendRequest.friend.sender.id}`}
              component={Link}
            >
              {" "}
              See their profile
            </Typography>
          </Tooltip>
        </>
      );
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
        onClose={() => {
          setAnchorEl(null);
          setExpandedNotification(null);
        }}
        PaperProps={{
          style: {
            maxHeight: "80vh",
            width: "320px",
            overflowY: "auto",
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
          <List sx={{ padding: 0 }}>
            {notifications.map((notification) => (
              <Box key={notification.id} sx={{ position: "relative" }}>
                <NotificationItem
                  onClick={() => handleNotificationClick(notification)}
                  button
                  isRead={notification.is_seen}
                  disabled={loadingNotifications.has(notification.id)}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                        {loadingNotifications.has(notification.id) && (
                          <CircularProgress size={16} />
                        )}
                      </Box>
                    }
                    secondary={formatDate(notification.time)}
                    secondaryTypographyProps={{
                      variant: "caption",
                      sx: { opacity: notification.is_seen ? 0.7 : 1 },
                    }}
                  />
                </NotificationItem>
              </Box>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationsButton;
