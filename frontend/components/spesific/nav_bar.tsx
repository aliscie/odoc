import React from 'react';
import "./style/nav_bar.css"

export function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("topnav").style.marginLeft = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

const NavBar = (props: any) => {


    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("topnav").style.marginLeft = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    return (
        <div>
            <div id="mySidenav" className="sidenav card bg-blur">
                <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Clients</a>
                <a href="#">Contact</a>
            </div>

            <div id="main">

                <span
                    // onClick={closeNav}
                >
                    {props.children}
                </span>

            </div>
        </div>

    );
};
export default NavBar;