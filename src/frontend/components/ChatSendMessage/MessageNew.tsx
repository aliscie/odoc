import { Box, Typography } from "@mui/material";

const Message = ({ text, isCurrentUser }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: "60%",
          padding: "8px 16px",
          borderRadius: 2,
          backgroundColor: isCurrentUser ? "#DCF8C6" : "#FFF",
          boxShadow: 1,
        }}
      >
        <Typography variant="body1">{text}</Typography>
      </Box>
    </Box>
  );
};

export default Message;
