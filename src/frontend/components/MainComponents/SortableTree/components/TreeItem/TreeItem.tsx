import React, { forwardRef, HTMLAttributes } from "react";
import classNames from "classnames";

import { Action } from "./Action";
import { Handle } from "./Handle";
import { Remove } from "./Remove";
import styles from "./TreeItem.module.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ContextMenu from "../../../../MuiComponents/ContextMenu";
import DeleteFile from "../../../../Actions/DeleteFile";
import ChangeWorkSpace from "../../../../Actions/ChangeWorkSpaceFile";
import { handleRedux } from "../../../../../redux/store/handleRedux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export interface Props extends HTMLAttributes<HTMLLIElement> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      id,
      ...props
    },
    ref,
  ) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleItemClick = () => {
      navigate(id);
      dispatch(handleRedux("CURRENT_FILE", { file: { id, name: value } }));
    };

    return (
      <li
        className={classNames(
          styles.Wrapper,
          clone && styles.clone,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction,
        )}
        ref={wrapperRef}
        style={
          {
            "--spacing": `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className={styles.TreeItem} ref={ref} style={style}>
          <Handle {...handleProps} />
          {onCollapse && (
            <Action
              onClick={onCollapse}
              className={classNames(
                styles.Collapse,
                collapsed && styles.collapsed,
              )}
            >
              <KeyboardArrowUpIcon />
            </Action>
          )}
          <ContextMenu
            options={[
              {
                content: <DeleteFile item={{ id, name: value }} />,
                preventClose: true,
                pure: true,
              },
              {
                content: <ChangeWorkSpace item={{ id, name: value }} />,
                pure: true,
                preventClose: true,
              },
            ]}
          >
            <span onMouseDown={handleItemClick} className={styles.Text}>
              {value}
            </span>
          </ContextMenu>
          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? (
            <span className={styles.Count}>{childCount}</span>
          ) : null}
        </div>
      </li>
    );
  },
);
