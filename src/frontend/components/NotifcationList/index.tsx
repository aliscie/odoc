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
import formatTimestamp, {formatRelativeTime} from "../../utils/time";

// Styled component for the notification item
const NotificationItem = styled(ListItem)(({ theme, isRead }) => ({
  padding: theme.spacing(2),
  backgroundColor: isRead ? theme.palette.action.hover : "inherit",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NotificationsButton = ({ notifications }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <List sx={{ padding: 0 }}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                onClick={handleClose}
                button
                isRead={notification.is_seen}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: notification.is_seen ? "normal" : "bold",
                      }}
                    >
                      {getNotificationMessage(notification.content)}
                    </Typography>
                  }
                  secondary={formatDate(notification.time)}
                  secondaryTypographyProps={{
                    variant: "caption",
                  }}
                />
              </NotificationItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationsButton;
