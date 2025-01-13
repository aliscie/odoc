import * as React from "react";
import { useState } from "react";
import { useSnackbar } from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";
import { Tooltip } from "@mui/material";

interface LoaderButtonProps {
  fullWidth?: true;
  toolTip?: string;
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
    } else if (res?.Err) {
      enqueueSnackbar(`${JSON.stringify(res?.Err || [])}`, {
        variant: "error",
      });
    }
    setLoading(false);
  }

  return (
    <LoadingButton
      fullWidth={props.fullWidth}
      color={props.color}
      loading={loading}
      disabled={props.disabled}
      // loadingPosition="start"
      startIcon={props.children ? props.startIcon : null}
      onClick={handleClick}
      variant={props.variant || "text"}
    >
      <Tooltip title={props.toolTip}>
        {props.children || props.startIcon}
      </Tooltip>
    </LoadingButton>
  );
}

export default LoaderButton;
