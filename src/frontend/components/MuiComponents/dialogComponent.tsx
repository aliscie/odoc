import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface DialogCompnentProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DialogComponent: React.FC<DialogCompnentProps> = ({
  button,
  onConfirm,
  title,
  content,
}) => {
  const [open, setDeleteDialogOpen] = React.useState(false);
  const [loading, isLoading] = React.useState(false);
  return (
    <>
      {loading ? (
        "Loading..."
      ) : (
        <span onClick={() => setDeleteDialogOpen(true)}>{button}</span>
      )}
      <Dialog
        open={open}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#A78BFA",
              "&:hover": {
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setDeleteDialogOpen(false);
              isLoading(true);
              await onConfirm();
              isLoading(false);
            }}
            sx={{
              color: "#ff4444",
              "&:hover": {
                backgroundColor: "rgba(255, 68, 68, 0.1)",
              },
            }}
            autoFocus
          >
            {title}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogComponent;
