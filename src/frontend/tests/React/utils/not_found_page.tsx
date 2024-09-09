import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function NotFoundErr(props: any) {
  const theme = useTheme();
  const { text } = props;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h1" style={{ color: theme.palette.text.primary }}>
        404
      </Typography>
      <Typography variant="body" style={{ color: theme.palette.text.primary }}>
        {text}
      </Typography>
    </Box>
  );
}
