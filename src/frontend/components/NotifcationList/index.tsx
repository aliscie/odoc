import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../contexts/BackendContext";
import { Link } from "react-router-dom";
import {
  Badge,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { formatRelativeTime } from "../../utils/time";
import StyledNotificationItem from "./notiicationitem";
import PaymentDialog from "./paymentDialog";
import { RootState } from "../../redux/reducers";
import ChecklistIcon from "@mui/icons-material/Checklist";
// Styled components

// Payment Dialog Component

const NotificationsButton = () => {
  const { notifications } = useSelector(
    (state: RootState) => state.notificationState,
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loadingNotifications, setLoadingNotifications] = useState(new Set());
  const open = Boolean(anchorEl);
  const { backendActor } = useBackendContext();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    try {
      setLoadingNotifications((prev) => new Set(prev).add(notification.id));

      if ("CPaymentContract" in notification.content) {
        const payment = notification.content.CPaymentContract[0];
        setSelectedPayment(payment);
      }

      if (!notification.is_seen) {
        await backendActor?.see_notifications([notification.id]);
        notification.is_seen = true;
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    } finally {
      setLoadingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
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
          Friend request from {content.FriendRequest.friend.sender.name}
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
    if ("CPaymentContract" in content) {
      const payment = content.CPaymentContract[0];
      return `Payment update: ${payment.amount} (${Object.keys(payment.status)[0]})`;
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

  const isPaymentNotification = (notification) => {
    return "CPaymentContract" in notification.content;
  };
  const dispatch = useDispatch();

  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // Update the handleMarkAllAsRead function
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.is_seen);
    const unreadNotificationIds = unreadNotifications.map((n) => n.id);
    if (unreadNotificationIds.length === 0) {
      return;
    }
    try {
      setIsMarkingAllRead(true);
      let res = await backendActor?.see_notifications(unreadNotificationIds);

      const updatedNotifications = notifications.map((notification) => {
        if (unreadNotificationIds.includes(notification.id)) {
          return { ...notification, is_seen: true };
        }
        return notification;
      });

      dispatch({
        type: "UPDATE_NOT_LIST",
        new_list: updatedNotifications,
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setIsMarkingAllRead(false);
    }
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
          elevation: 3,
          style: {
            maxHeight: "80vh",
            width: "320px",
            overflowY: "auto",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {notifications.some((n) => !n.is_seen) && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <Tooltip title="Mark all as read">
              <IconButton size="small" onClick={handleMarkAllAsRead}>
                {isMarkingAllRead ? (
                  <CircularProgress size={16} />
                ) : (
                  <ChecklistIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}

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
                <StyledNotificationItem
                  onClick={() => handleNotificationClick(notification)}
                  button
                  isread={notification.is_seen.toString()}
                  ispayment={isPaymentNotification(notification).toString()}
                  disabled={loadingNotifications.has(notification.id)}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: isPaymentNotification(notification)
                            ? "primary.main"
                            : "inherit",
                        }}
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
                    secondary={formatRelativeTime(notification.time)}
                    secondaryTypographyProps={{
                      variant: "caption",
                      sx: { opacity: notification.is_seen ? 0.7 : 1 },
                    }}
                  />
                </StyledNotificationItem>
              </Box>
            ))}
          </List>
        )}
      </Menu>

      {selectedPayment && (
        <PaymentDialog
          payment={selectedPayment}
          onClose={() => {
            setSelectedPayment(null);
            handleClose();
          }}
          onAction={(action, reason) => {
            setSelectedPayment(null);
            handleClose();
          }}
        />
      )}
    </>
  );
};

export default NotificationsButton;
