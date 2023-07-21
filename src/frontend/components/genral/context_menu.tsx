import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {ListItemIcon} from "@mui/material";

export default function ContextMenu(props: any) {
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        <div onContextMenu={handleContextMenu}
             style={{cursor: 'context-menu'}}>
            {props.children}
            <Menu
                id="basic-menu"
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                        : undefined
                }
            >
                {props.options.map((item: any) => <MenuItem
                        onClick={() => {
                            !item.preventClose && handleClose()
                            item.onClick && item.onClick()
                        }}>
                        {item.icon && item.icon}
                        {item.content}
                    </MenuItem>
                )}

            </Menu>
        </div>
    );
}