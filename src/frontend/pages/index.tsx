import { Route, Routes } from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import FileContentPage from "./FileContentPage";
import ShareFilePage from "./ShareFilePage";
import ProfilePage from "./profile";
import Discover from "./Discover";
import UserPage from "./User";
import ChatsPage from "./ChatsPage";
import ContractsHistory from "./Profile/ContractsHistory";
import Web3WalletUI from "../components/MuiComponents/walletUi";
import { useSelector } from "react-redux";
import {logger} from "../DevUtils/logData";
import {useBackendContext} from "../contexts/BackendContext";

function Pages() {
  const { profile, profile_history, wallet, friends } = useSelector(
    (state: any) => state.filesState,
  );
  const { login, logout } = useBackendContext();
  const { isLoggedIn } = useSelector((state: any) => state.uiState);

  return (
    <Routes>
      <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} login={login} />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/wallet" element={<Web3WalletUI wallet={wallet} />} />
      <Route
        path="/profile"
        element={<ProfilePage friends={friends} profile={profile} history={profile_history} />}
      />
      <Route path="/share/*" element={<ShareFilePage />} />
      <Route path="/user/*" element={<ProfilePage />} />
      <Route path="/chats/*" element={<ChatsPage />} />
      <Route path="/contracts/*" element={<ContractsHistory />} />
      <Route path="/*" element={<FileContentPage />} />
    </Routes>
  );
}

export default Pages;
