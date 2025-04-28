import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Button, 
  LinearProgress, 
  BottomNavigationAction,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Box
} from "@mui/material";
import { 
  Person2 as Person2Icon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from "@mui/icons-material";
import { RootState } from "../../../redux/reducers";
import { useBackendContext } from "../../../contexts/BackendContext";
import DfnIcon from "@/assets/dfn.svg";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';

interface LoginButtonProps {
  isMobile?: boolean;
  sx?: React.CSSProperties | any;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  isMobile = false,
  sx = {},
}) => {
  const dispatch = useDispatch();
  const { login, loginWithMetaMask } = useBackendContext();
  const { isFetching, isLoggedIn } = useSelector((state: RootState) => state.uiState);
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  
  // For dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [prevConnected, setPrevConnected] = useState(false);


  const styles = {
    loginButton: {
      fontWeight: "bold",
      textTransform: "none",
      marginLeft: 1,
      borderRadius: 2,
      ...sx,
    },
    progressBar: {
      width: isMobile ? "100%" : 70,
      borderRadius: 2,
    },
    menuIcon: {
      width: 24,
      height: 24,
      marginRight: 1
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInternetIdentityLogin = async () => {
    await login();
    handleClose();
  };

  const handleMetaMaskLogin = async () => {
    if (openConnectModal) {
      await loginWithMetaMask();
      handleClose();
    }
  };

  if (isFetching) {
    return <LinearProgress sx={styles.progressBar} />;
  }

  if (isMobile) {
    return (
      <>
        <BottomNavigationAction
          label="Login"
          icon={<Person2Icon />}
          onClick={handleClick}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleInternetIdentityLogin}>
            <ListItemIcon>
              <img 
                src={DfnIcon} 
                alt="Internet Identity" 
                style={styles.menuIcon} 
              />
            </ListItemIcon>
            <ListItemText>Internet Identity</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMetaMaskLogin}>
            <ListItemIcon>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png" 
                alt="MetaMask" 
                style={styles.menuIcon} 
              />
            </ListItemIcon>
            <ListItemText>MetaMask</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

  // Update the MenuItem for MetaMask to be enabled
  return (
    <>
      <Button
        variant="outlined"
        className="login"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={styles.loginButton}
      >
        Login
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleInternetIdentityLogin}>
          <ListItemIcon>
            <img 
              src={DfnIcon} 
              alt="Internet Identity" 
              style={styles.menuIcon} 
            />
          </ListItemIcon>
          <ListItemText>Internet Identity</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMetaMaskLogin}>
          <ListItemIcon>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png" 
              alt="MetaMask" 
              style={styles.menuIcon} 
            />
          </ListItemIcon>
          <ListItemText>MetaMask</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
export default LoginButton;
