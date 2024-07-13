import {Route, Routes} from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import NFTComparisonTable from "./types_of_nfts";
import FileContentPage from "./file_content_page";
import ShareFilePage from "./share_file_page";
import ProfileComponent from "./profile/profile";
import Discover from "./discover";
import UserPage from "./user";
import ChatsPage from "./chates_page";


function Pages() {
    return <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/discover" element={<Discover/>}/>
        <Route path="/Profile" element={<ProfileComponent/>}/>
        <Route path="/share/*" element={<ShareFilePage/>}/>
        <Route path="/user/*" element={<UserPage/>}/>
        <Route path="/chats/*" element={<ChatsPage/>}/>
        <Route path="*" element={<FileContentPage/>}/>
    </Routes>

}

export default Pages;