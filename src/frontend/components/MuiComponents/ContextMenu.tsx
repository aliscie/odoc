import { MouseEvent, ReactNode, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box, ListItemIcon, ListItemText, Divider } from "@mui/material";

interface MenuOption {
  content: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  preventClose?: boolean;
  pure?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  children: ReactNode;
  options: MenuOption[];
  onClick?: (event: MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

interface MenuPosition {
  mouseX: number;
  mouseY: number;
}

export default function ContextMenu({
  children,
  options,
  onClick,
  className,
  disabled = false,
}: ContextMenuProps) {
  const [contextMenu, setContextMenu] = useState<MenuPosition | null>(null);

  const handleContextMenu = (event: MouseEvent) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const renderMenuItem = (item: MenuOption, index: number) => {
    if (item.pure) {
      return (
        <Box key={index} onClick={() => !item.preventClose && handleClose()}>
          {item.content}
          {item.divider && <Divider />}
        </Box>
      );
    }

    return (
      <Box key={index}>
        <MenuItem
          onClick={() => {
            !item.preventClose && handleClose();
            item.onClick?.();
          }}
          sx={{
            minWidth: '240px',
            px: 3, // Add more horizontal padding
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText primary={item.content} />
        </MenuItem>
        {item.divider && <Divider />}
      </Box>
    );
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={handleContextMenu}
      style={{ cursor: disabled ? "default" : "context-menu" }}
      className={className}
    >
      {children}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        elevation={3}
        sx={{
          '& .MuiPaper-root': {
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            minWidth: '280px', // Add minimum width for the entire menu
          },
          '& .MuiList-root': {
            padding: '4px 0',
          },
          '& .MuiMenuItem-root': {
            padding: '8px 24px',
            typography: 'body2',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
        }}
      >
        {options.map((item, index) => renderMenuItem(item, index))}
      </Menu>
    </div>
  );
}
