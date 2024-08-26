import React, { useRef, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface FeatureModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  content: string;
  icon: JSX.Element;
  anchorEl: HTMLButtonElement | null;
}

const FeatureModal: React.FC<FeatureModalProps> = ({
  open,
  handleClose,
  title,
  content,
  icon,
  anchorEl,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dialogStyle, setDialogStyle] = React.useState<React.CSSProperties>({});

  useEffect(() => {
    const positionDialog = () => {
      if (anchorEl && dialogRef.current) {
        const anchorRect = anchorEl.getBoundingClientRect();
        const dialogRect = dialogRef.current.getBoundingClientRect();
        const top = anchorRect.bottom + window.scrollY + 10;
        const left =
          anchorRect.left + (anchorRect.width - dialogRect.width) / 2;
        setDialogStyle({
          top: `${top}px`,
          left: `${left}px`,
          transform: "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)",
        });
      }
    };

    if (open) {
      positionDialog();
    }
  }, [open, anchorEl]);

  const handleExited = () => {
    setDialogStyle({});
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onExited={handleExited}
      PaperProps={{
        ref: dialogRef,
        style: {
          position: "absolute",
          transformOrigin: "top",
          ...dialogStyle,
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        {icon}
        <Typography variant="h6" component="span" sx={{ marginLeft: "8px" }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeatureModal;
