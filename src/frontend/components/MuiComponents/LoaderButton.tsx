import * as React from "react";
import { useState } from "react";
import { useSnackbar } from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";

interface LoaderButtonProps {
  successMessage?: string;
  onClick: any;
  children: any;
  disabled?: boolean;
  startIcon?: any;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | undefined;
  variant?: "text" | "outlined" | "contained" | undefined;
}

function LoaderButton(props: LoaderButtonProps) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    let res: { Ok?: any; Err?: any } = props.onClick && (await props.onClick());
    if (res?.Ok !== undefined) {
      props.successMessage &&
        enqueueSnackbar(props.successMessage, { variant: "success" });
    } else {
      enqueueSnackbar(res?.Err, { variant: "error" });
    }
    setLoading(false);
  }

  return (
    <LoadingButton
      color={props.color}
      loading={loading}
      disabled={props.disabled}
      // loadingPosition="start"
      startIcon={props.startIcon}
      onClick={handleClick}
      variant={props.variant || "text"}
    >
      {props.children}
    </LoadingButton>
  );
}

export default LoaderButton;
