import {Route, Routes} from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";


function Pages() {
    return <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/books" element={<div>books</div>}/>
    </Routes>

}

export default Pages;