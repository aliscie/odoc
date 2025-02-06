import {styled} from "@mui/material/styles";
import {ListItem} from "@mui/material";

const StyledNotificationItem = styled(ListItem)(({ theme, isread, ispayment }) => ({
  padding: theme.spacing(2),
  backgroundColor: isread === "true" ? theme.palette.action.hover : "inherit",
  "&:hover": {
    backgroundColor: ispayment === "true"
      ? theme.palette.action.selected
      : theme.palette.action.hover,
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
  opacity: isread === "true" ? 0.7 : 1,
  cursor: ispayment === "true" ? 'pointer' : 'default',
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shorter,
  }),
}));

export default StyledNotificationItem
