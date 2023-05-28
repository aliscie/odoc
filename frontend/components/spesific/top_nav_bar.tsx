import React from 'react';
import "./style/top_nav_bar.css"

const TopNavBar = (props: any) => {

    return (
        <div id={"topnav"} className={"topnav card bg-blur"}>
            {props.children}
        </div>


    );
};
export default TopNavBar;