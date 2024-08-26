import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";

const RegistrationFormDialog = (props: {
  open: boolean;
  title: string;
  description: string;
  inputFields: any;
  buttons: any;
}) => {
  const handleClose = () => {
    // Handle dialog close if needed
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          width: "100%",
          maxWidth: "500px",
          padding: "16px",
          margin: "auto",
        },
      }}
      open={props.open}
      onClose={handleClose}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.description}</DialogContentText>
        {props.inputFields}
      </DialogContent>
      <DialogActions>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
          {props.buttons.map((button: any, index: number) => (
            <Button
              key={index}
              onClick={async () => {
                button.preventClose !== true && handleClose();
                button.onClick && (await button.onClick());
              }}
              color={button.name === "Submit" ? "success" : "error"}
              variant={button.name === "Submit" ? "contained" : "outlined"}
              sx={{
                alignSelf: "center",
                marginBottom: "15px",
                marginLeft: "15px",
                marginRight: "15px",
              }}
            >
              {button.name}
            </Button>
          ))}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RegistrationFormDialog;
