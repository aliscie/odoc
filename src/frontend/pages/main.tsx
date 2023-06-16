import {Route, Routes} from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import SimplePaper from "../components/genral/paper";
import NFTComparisonTable from "./types_of_nfts";


function Pages() {
    return <Routes>
        <Route path="/about_us" element={<LandingPage/>}/>
        <Route path="/Discover" element={<SimplePaper/>}/>
        <Route path="/Blog" element={<NFTComparisonTable/>}/>

    </Routes>

}

export default Pages;