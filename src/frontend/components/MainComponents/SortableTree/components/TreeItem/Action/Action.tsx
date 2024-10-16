import React, { CSSProperties } from "react";
import classNames from "classnames";

import styles from "./Action.module.css";
import {Button} from "@mui/material";

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties["cursor"];
}

export function Action({ active, className, cursor, style, ...props }: Props) {
  return (
    <span
      {...props}
      className={classNames(styles.Action, className)}
      tabIndex={0}
      style={
        {

          ...style,
          cursor,
          "--fill": active?.fill,
          "--background": active?.background,
          paddingLeft: "5px",
          paddingRight: "5px",

        } as CSSProperties
      }
    />
  );
}
