import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LinearProgress, BottomNavigationAction } from "@mui/material";
import {
  Person2 as Person2Icon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Gavel as GavelIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Handshake as HandshakeIcon
} from "@mui/icons-material";

import NotificationsButton from "../../NotifcationList";
import ChatsComponent from "../../Chat";
import WorkspaceManager from "../Workspaces";
import BasicMenu from "../../MuiComponents/BasicMenu";
import UserAvatar from "../UserAvatar";
import MultiSaveButton from "../../Actions/MultiSave";

import { handleRedux } from "../../../redux/store/handleRedux";
import { useBackendContext } from "../../../contexts/BackendContext";
import { convertToBlobLink } from "../../../DataProcessing/imageToVec";
import { RootState } from "../../../redux/reducers";

interface AfterLoginButtonsProps {
  isMobile?: boolean;
}

const AfterLoginButtons: React.FC<AfterLoginButtonsProps> = ({
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout, backendActor } = useBackendContext();

  const { isFetching } = useSelector((state: RootState) => state.uiState);
  const { profile, profile_history } = useSelector((state: RootState) => state.filesState);
  const { chats } = useSelector((state: RootState) => state.chatsState);

  const imageLink = profile ? convertToBlobLink(profile.photo) : "";

  const styles = {
    progressBar: {
      width: isMobile ? "100%" : 70,
      borderRadius: 2,
    },
    mobileAvatar: {
      width: 24,
      height: 24,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (backendActor) {
        const [notificationRes, chatsList] = await Promise.all([
          backendActor.get_user_notifications(),
          backendActor.get_my_chats(),
        ]);

        dispatch(handleRedux("UPDATE_NOT_LIST", { new_list: notificationRes }));
        dispatch(handleRedux("SET_CHATS", { chats: chatsList }));
      }
    };

    fetchData();
  }, [backendActor, dispatch]);

  const handleLogout = async () => {
    logout();
    dispatch(handleRedux("LOGOUT"));
    navigate("/");
  };

  const menuOptions = [
    { content: "Profile", to: "/profile", icon: <Person2Icon /> },
    { content: "Contracts", to: "/contracts", icon: <GavelIcon /> },
    { content: "Wallet", to: "/wallet", icon: <AccountBalanceWalletIcon /> },
    { content: "Affiliate", to: "/affiliate", icon: <HandshakeIcon /> },
    { content: "Logout", to: "/", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  if (isFetching) {
    return <LinearProgress sx={styles.progressBar} />;
  }

  // Mobile view
  if (isMobile) {
    return (
      <>
        <BottomNavigationAction
          label="Notifications"
          icon={<NotificationsIcon />}
        />
        <BottomNavigationAction
          label="Chat"
          icon={
            <ChatsComponent key={chats.length} chats={chats} isMobile={true} />
          }
        />
        <BottomNavigationAction
          label="Profile"
          icon={
            <UserAvatar
              actions_rate={profile_history?.actions_rate ?? 0}
              photo={imageLink}
              style={styles.mobileAvatar} onAvatarClick={function (): void {
                throw new Error("Function not implemented.");
              } } onClick={function (): void {
                throw new Error("Function not implemented.");
              } }            />
          }
        />
        <BottomNavigationAction
          label="Save"
          icon={<MultiSaveButton isMobile={true} />}
        />
      </>
    );
  }

  // Desktop view
  return (
    <>
      <NotificationsButton />
      <ChatsComponent key={chats.length} chats={chats} />
      <WorkspaceManager />
      <BasicMenu options={menuOptions}>
        <UserAvatar
          actions_rate={profile_history?.actions_rate ?? 0}
          photo={imageLink}
          style={{ width: 24, height: 24 }} onAvatarClick={function (): void {
            throw new Error("Function not implemented.");
          } } onClick={function (): void {
            throw new Error("Function not implemented.");
          } }        />
      </BasicMenu>
      <MultiSaveButton />
    </>
  );
};

export default AfterLoginButtons;