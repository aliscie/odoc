import React from 'react';
import "./style/top_nav_bar.css"
import {useSelector} from "react-redux";

const TopNavBar = (props: any) => {
    const isNavOpen = useSelector((state: any) => state.isNavOpen);
    return (
        <div style={{marginLeft: isNavOpen ? "250px" : 0}} id={"topnav"} className={"topnav card bg-blur"}>
            {props.children}
        </div>


    );
};
export default TopNavBar;