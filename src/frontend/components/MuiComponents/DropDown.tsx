import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface MenuOption {
    content: any;
    icon?: React.ReactNode;
    Click?: (e?: any) => void;
    preventClose?: boolean;

}

interface BasicMenuProps {
    options: MenuOption[];
    children: React.ReactNode;
    SelectOption?: (option: any) => void;
}

const BasicMenu: React.FC<BasicMenuProps> = ({SelectOption, style, options, children}) => {
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
                {options.map((option, index, preventClose) => (
                    <MenuItem key={index} onClick={async (e: any) => {
                        SelectOption && await SelectOption(option);
                        option.Click && await option.Click(option.content);
                        !preventClose && handleClose()
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
