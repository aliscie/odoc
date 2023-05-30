import {Route, Routes} from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import SimplePaper from "../components/genral/paper";


function Pages() {
    return <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/books" element={<SimplePaper/>}/>
    </Routes>

}

export default Pages;