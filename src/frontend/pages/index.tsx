import {Route, Routes} from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage/LandingPage";
import FileContentPage from "./FileContentPage";
import ShareFilePage from "./ShareFilePage";
import ProfileComponent from "./Profile/Profile";
import Discover from "./Discover";
import UserPage from "./User";
import ChatsPage from "./ChatsPage";
import ContractsHistory from "./Profile/ContractsHistory";


function Pages() {
    return <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/discover" element={<Discover/>}/>
        <Route path="/profile" element={<ProfileComponent/>}/>
        <Route path="/share/*" element={<ShareFilePage/>}/>
        <Route path="/user/*" element={<UserPage/>}/>
        <Route path="/chats/*" element={<ChatsPage/>}/>
        <Route path="/contracts/*" element={<ContractsHistory/>}/>
        <Route path="*" element={<FileContentPage/>}/>
    </Routes>

}

export default Pages;
