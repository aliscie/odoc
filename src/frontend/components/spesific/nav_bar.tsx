import React from 'react';
import "./style/nav_bar.css";
import {useDispatch, useSelector} from "react-redux";
import NestedList from "./nested_list/nest_list";
import {Button, Divider, Drawer, List, ListItemButton, ListItemText} from "@mui/material";
import {Link} from "react-router-dom";
import CreateFile from "../actions/create_file";
import {handleRedux} from "../../redux/main";

const NavBar = (props: any) => {
    const dispatch = useDispatch();
    const {isNavOpen, isLoggedIn} = useSelector((state: any) => state.uiReducer);
    const {files} = useSelector((state: any) => state.filesReducer);

    const navLinks = [
        {label: "Discover", to: "/discover"},
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
                        <ListItemButton
                            onClick={() => {
                                // TODO find a genaric way to hid the <CopyButton/> (Share Button) when window.location.pathname not a file id.
                                dispatch(handleRedux("CURRENT_FILE", {file: null}));
                            }}
                            component={Link} to={link.to} key={link.label}>
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
