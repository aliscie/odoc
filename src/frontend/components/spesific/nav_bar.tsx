import React from 'react';
import "./style/nav_bar.css";
import {useSelector} from "react-redux";
import NestedList from "./nested_list/nest_list";
import {Button, Divider, Drawer, List, ListItemButton, ListItemText} from "@mui/material";
import {Link} from "react-router-dom";
import CreateFile from "../actions/create_file";

const NavBar = (props: any) => {
    const {isNavOpen, isLoggedIn} = useSelector((state: any) => state.uiReducer);
    const {files} = useSelector((state: any) => state.filesReducer);

    const navLinks = [
        {label: "Discover", to: "/discover"},
        {label: "Editor demo", to: "/editor_demo"},
        {label: "Blog", to: "/blog"},
        {label: "About us", to: "/"},
    ];

    return (
        <div>
            <Drawer
                open={isNavOpen}
                variant="persistent"
                anchor="left"
                PaperProps={{
                    className: "sidenav card bg-blur",
                    style: {width: "250px"},
                }}
            >
                <List>
                    {navLinks.map((link) => (
                        <ListItemButton component={Link} to={link.to} key={link.label}>
                            <ListItemText primary={link.label}/>
                        </ListItemButton>
                    ))}
                </List>
                <Divider/>
                {isLoggedIn && (
                    <>
                        <NestedList files={files}/>
                        <Divider/>
                        <CreateFile/>
                    </>
                )}
            </Drawer>
            <div id="main" style={{marginLeft: isNavOpen ? "250px" : 0}}>
                <span>{props.children}</span>
            </div>
        </div>
    );
};

export default NavBar;
