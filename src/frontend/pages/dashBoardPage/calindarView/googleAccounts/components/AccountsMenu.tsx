import { Menu, MenuItem, ListItemIcon, Divider, IconButton } from '@mui/material';
import { Add, Logout } from '@mui/icons-material';
import { Account } from '../../types';

interface AccountsMenuProps {
  anchorEl: HTMLElement | null;
  accounts: Account[];
  onClose: () => void;
  onAddAccount: () => void;
  onDisconnectAccount: (email: string) => void;
}

export const AccountsMenu = ({
  anchorEl,
  accounts,
  onClose,
  onAddAccount,
  onDisconnectAccount
}: AccountsMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      {accounts.map((account) => (
        <MenuItem key={account.email}>
          <ListItemText primary={account.email} />
          {!account.isCurrent && (
            <IconButton onClick={() => onDisconnectAccount(account.email)}>
              <Logout fontSize="small" />
            </IconButton>
          )}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem onClick={onAddAccount}>
        <ListItemIcon>
          <Add fontSize="small" />
        </ListItemIcon>
        Add another account
      </MenuItem>
    </Menu>
  );
};