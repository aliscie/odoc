import { Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LandingPage from "./LandingPage";
import Index from "./fileContentPage";
import ShareFilePage from "./ShareFilePage";
import ProfilePage from "./profile";
import Discover from "./discover/index";
import UserProfile from "./User";
import ContractsHistory from "./Profile/ContractsHistory";
import Web3WalletUI from "../components/MuiComponents/walletUi";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../contexts/BackendContext";
import OfferPage from "./OfferPage";
import SubscriptionPlans from "./subscrptions";
import SNSWhitepaper from "./snsWhitePaper";
import SNSVoting from "./votePage";
import ProductManagerDashboard from "./dashBoardPage";
import DummyShares from "./sharesContract";
import AffiliateDashboard from "./affiliate";
import AffiliateRedirect from "./affiliateRedirect";
import { handleRedux } from "../redux/store/handleRedux";
import FileContentPage from "./fileContentPage";
import RegistrationForm from "../components/MainComponents/RegistrationForm";

function Pages() {
  const { profile, profile_history, wallet, friends } = useSelector(
    (state: any) => state.filesState,
  );
  const { login, logout, backendActor } = useBackendContext();
  const { isLoggedIn, isRegistered } = useSelector(
    (state: any) => state.uiState,
  );

  const MainPage = () => {
    if (isLoggedIn && !isRegistered) {
      return <RegistrationForm />;
    }
    if (isLoggedIn) {
      return <ProductManagerDashboard />;
    }

    return <LandingPage isLoggedIn={isLoggedIn} login={login} />;
  };
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/dashboard" element={<ProductManagerDashboard />} />
      <Route
        path="/about"
        element={<LandingPage isLoggedIn={isLoggedIn} login={login} />}
      />
      <Route path="/discover" element={<Discover />} />
      <Route path="/wallet" element={<Web3WalletUI wallet={wallet} />} />
      <Route
        path="/profile"
        element={
          <ProfilePage
            friends={friends}
            profile={profile}
            history={profile_history}
          />
        }
      />
      <Route path="/share/*" element={<ShareFilePage />} />
      <Route path="/user/*" element={<UserProfile />} />
      {/*<Route path="/chats/*" element={<ChatsPage />} />*/}
      <Route path="/contracts/*" element={<ContractsHistory />} />
      <Route
        path="/offer"
        element={<OfferPage isLoggedIn={isLoggedIn} login={login} />}
      />

      <Route path="/subscriptions" element={<SubscriptionPlans />} />
      <Route path="/white_paper" element={<SNSWhitepaper />} />
      <Route path="/vote" element={<SNSVoting />} />
      <Route path="/shares_contract" element={<DummyShares />} />
      <Route path="/affiliate" element={<AffiliateDashboard />} />
      <Route path="/f" element={<AffiliateRedirect />} />
      <Route path="/*" element={<FileContentPage />} />
    </Routes>
  );
}

export default Pages;
