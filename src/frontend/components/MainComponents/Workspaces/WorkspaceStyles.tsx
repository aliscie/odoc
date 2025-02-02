import { Theme } from '@mui/material/styles';

export const getWorkspaceStyles = (theme: Theme) => ({
  workspaceButton: {
    textTransform: 'none',
    minHeight: 40,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      border: `1px solid ${theme.palette.divider}`,
    },
  },
  menuPaper: {
    width: {
      xs: '90vw',
      sm: 320,
    },
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    '&:hover .workspace-actions': {
      opacity: 1,
    },
  },
  workspaceActions: {
    opacity: 0,
    transition: theme.transitions.create('opacity'),
    display: 'flex',
    alignItems: 'center',
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
});
