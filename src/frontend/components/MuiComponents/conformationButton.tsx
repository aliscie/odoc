import { Button, Typography } from "@mui/material";
import { useState } from "react";
import LoaderButton from "./LoaderButton";

function ConformationMessage(props) {
  const [state, setState] = useState(false);
  return (
    <div>
      {!state && (
        <Button onClick={() => setState(true)}>{props.children}</Button>
      )}
      {state && (
        <>
          <Typography>{props.conformationMessage}</Typography>
          <Button onClick={() => setState(false)}>No</Button>
          <LoaderButton onClick={props.onClick}>{props.message}</LoaderButton>
        </>
      )}
    </div>
  );
}
export default ConformationMessage;
