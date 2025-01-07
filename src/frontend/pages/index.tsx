import { Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LandingPage from "./LandingPage";
import FileContentPage from "./FileContentPage";
import ShareFilePage from "./ShareFilePage";
import ProfilePage from "./profile";
import Discover from "./discover/index";
import UserProfile from "./User";
import ContractsHistory from "./Profile/ContractsHistory";
import Web3WalletUI from "../components/MuiComponents/walletUi";
import { useSelector } from "react-redux";
import { useBackendContext } from "../contexts/BackendContext";
import OfferPage from "./OfferPage";
import SubscriptionPlans from "./subscrptions";
import SNSWhitepaper from "./snsWhitePaper";
import SNSVoting from "./votePage";

function Pages() {
  const [posts, setPosts] = useState([]);
  const { profile, profile_history, wallet, friends } = useSelector(
    (state: any) => state.filesState,
  );
  const { login, logout, backendActor } = useBackendContext();
  const { isLoggedIn } = useSelector((state: any) => state.uiState);

  useEffect(() => {
    const fetchPosts = async () => {
      if (backendActor) {
        try {
          // Fetch first 20 posts
          const fetchedPosts = await backendActor.get_posts(
            BigInt(0),
            BigInt(20),
          );

          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchPosts();
  }, [backendActor]);

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage isLoggedIn={isLoggedIn} login={login} />}
      />
      <Route
        path="/discover"
        element={<Discover key={posts.length} posts={posts} />}
      />
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
      <Route path="/*" element={<FileContentPage />} />
    </Routes>
  );
}

export default Pages;
