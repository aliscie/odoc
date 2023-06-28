import {Route, Routes} from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import EditorDemo from "../components/genral/editor_demo";
import NFTComparisonTable from "./types_of_nfts";
import FileContentPage from "./file_content_page";
import ShareFilePage from "./share_file_page";
import ProfileComponent from "./profile";
import Discover from "./discover_page";


function Pages() {
    return <Routes>

        <Route path="/about_us" element={<LandingPage/>}/>
        <Route path="/Discover" element={<Discover/>}/>
        <Route path="/editor_demo" element={<EditorDemo/>}/>
        <Route path="/Blog" element={<NFTComparisonTable/>}/>
        <Route path="/Profile" element={<ProfileComponent/>}/>
        <Route path="/share/*" element={<ShareFilePage/>}/>
        <Route path="*" element={<FileContentPage/>}/>
    </Routes>

}

export default Pages;