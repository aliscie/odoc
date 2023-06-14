import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface MenuOption {
    content: string;
    icon?: React.ReactNode;
    handleClick?: (e?: any) => void;

}

interface BasicMenuProps {
    options: MenuOption[];
    children: React.ReactNode;
}

const BasicMenu: React.FC<BasicMenuProps> = ({style, options, children}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                style={style}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {children}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} onClick={async (e: any) => {
                        option.handleClick && await option.handleClick(e);
                        handleClose()
                    }}>
                        {option.icon && option.icon}
                        {option.content}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default BasicMenu;
