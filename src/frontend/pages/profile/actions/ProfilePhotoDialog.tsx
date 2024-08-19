import React from "react";
import { Dialog, DialogContent } from "@mui/material";

interface ProfilePhotoDialogProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ProfilePhotoDialog: React.FC<ProfilePhotoDialogProps> = ({
  open,
  onClose,
  imageSrc,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogContent>
        <img src={imageSrc} alt="Profile Photo" style={{ width: "100%" }} />
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePhotoDialog;
