import React, {useState} from "react";
import {Button} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const CopyButton = ({ title, value }) => {
  const [showCheck, setShowCheck] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleCopy}
      startIcon={
        showCheck ? (
          <CheckCircleIcon
            sx={{
              color: "#4CAF50",
              animation: "popIn 0.3s ease-in-out",
              "@keyframes popIn": {
                "0%": {
                  transform: "scale(0)",
                },
                "50%": {
                  transform: "scale(1.2)",
                },
                "100%": {
                  transform: "scale(1)",
                },
              },
            }}
          />
        ) : (
          <ContentCopyIcon />
        )
      }
      sx={{
        bgcolor: showCheck ? "#E8F5E9" : "primary.main",
        color: showCheck ? "#2E7D32" : "white",
        "&:hover": {
          bgcolor: showCheck ? "#E8F5E9" : "primary.dark",
        },
        transition: "all 0.3s ease",
      }}
    >
      {showCheck ? "Copied!" : title}
    </Button>
  );
};

export default CopyButton
