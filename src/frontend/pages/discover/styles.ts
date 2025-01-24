import { styled } from "@mui/material/styles";
import { TextField, IconButton, Box } from "@mui/material";

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    color: theme.palette.mode === "dark" ? "#E9D5FF" : "#4B5563",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(17, 24, 39, 0.6)"
        : "rgba(255, 255, 255, 0.6)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(139, 92, 246, 0.2)"
        : "rgba(79, 70, 229, 0.2)",
  },
}));

export const CommentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(17, 24, 39, 0.6)"
      : "rgba(255, 255, 255, 0.6)",
  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(139, 92, 246, 0.2)" : "rgba(79, 70, 229, 0.2)"}`,
  marginBottom: theme.spacing(2),
}));

export const CommentActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#E9D5FF" : "#6366F1",
  padding: theme.spacing(0.5),
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(139, 92, 246, 0.1)"
        : "rgba(79, 70, 229, 0.1)",
  },
  "&.Mui-disabled": {
    opacity: 0.8,
    color: theme.palette.mode === "dark" ? "#9CA3AF" : "#4B5563",
    "& span": {
      color: theme.palette.mode === "dark" ? "#E5E7EB" : "#1F2937",
      fontWeight: 500,
    },
  },
}));
