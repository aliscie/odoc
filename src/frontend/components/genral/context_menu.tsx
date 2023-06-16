import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {ListItemIcon} from "@mui/material";
import {ContentCut} from "@mui/icons-material";

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

    const handleClose = (is_prevent) => {
        console.log(is_prevent)
        !is_prevent && setContextMenu(null);
    };

    return (
        <div onContextMenu={handleContextMenu} style={{cursor: 'context-menu'}}>
            {props.children}
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                        : undefined
                }
            >
                {props.options.map((item: any) =>
                    <MenuItem onMouseUp={() => {
                        handleClose(item.preventClose)
                    }}>
                        {item.icon && <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>}
                        {item.content}</MenuItem>
                )}

            </Menu>
        </div>
    );
}