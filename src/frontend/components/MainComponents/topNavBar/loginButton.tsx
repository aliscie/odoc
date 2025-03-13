import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Button, 
  LinearProgress, 
  BottomNavigationAction,
  Menu,
  MenuItem,
  ListItemText
} from "@mui/material";
import { 
  Person2 as Person2Icon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from "@mui/icons-material";
import { RootState } from "../../../redux/reducers";
import { useBackendContext } from "../../../contexts/BackendContext";

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
  
  // For dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
    // dispatch({ type: "LOGIN" });
    // handleClose();
  };

  const handleMetaMaskLogin = async () => {
    try {
      await loginWithMetaMask();
      dispatch({ type: "LOGIN" });
      handleClose();
    } catch (error) {
      console.error("MetaMask login failed:", error);
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
            <ListItemText>Internet Identity</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMetaMaskLogin}>
            <ListItemText>MetaMask</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

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
          <ListItemText>Internet Identity</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMetaMaskLogin}>
          <ListItemText>MetaMask</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default LoginButton;