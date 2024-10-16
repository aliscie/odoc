import React from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Action, ActionProps } from "../Action";

export function Handle(props: ActionProps) {
  return (
    <Action cursor="grab" data-cypress="draggable-handle" {...props}>
      <DragIndicatorIcon />
    </Action>
  );
}
