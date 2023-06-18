import {Route, Routes} from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import SimplePaper from "../components/genral/paper";
import NFTComparisonTable from "./types_of_nfts";
import FileContentPage from "./file_content_page";
import ShareFilePage from "./share_file_page";


function Pages() {
    return <Routes>
        <Route path="/about_us" element={<LandingPage/>}/>
        <Route path="/Discover" element={<SimplePaper/>}/>
        <Route path="/Blog" element={<NFTComparisonTable/>}/>
        <Route path="/share/*" element={<ShareFilePage/>}/>
        <Route path="*" element={<FileContentPage/>}/>
    </Routes>

}

export default Pages;