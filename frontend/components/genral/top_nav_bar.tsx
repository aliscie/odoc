import React from 'react';
import "../spesific/style/top_nav_bar.css"
import {useSelector} from "react-redux";
import {Toolbar, Typography} from "@mui/material";

const TopNavBar = (props: any) => {
    const isNavOpen = useSelector((state: any) => state.isNavOpen);
    return (
        <span id={"topnav"} className={"topnav card bg-blur"}>
        <Toolbar style={{marginLeft: isNavOpen ? "250px" : 0}} id={"topnav"} className={"topnav card bg-blur"}>
            {props.children}
        </Toolbar>
            </span>


    );
};
export default TopNavBar;