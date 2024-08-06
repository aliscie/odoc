import React from 'react';
import "./style/nav_bar.css";
import { useDispatch, useSelector } from "react-redux";
import NestedList from "./nested_list/nest_list";
import { Button, Divider, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import CreateFile from "../Actions/create_file";
import { handleRedux } from '../../redux/store/handleRedux';
import InfoIcon from '@mui/icons-material/Info';
import ExploreIcon from '@mui/icons-material/Explore';
import { Z_INDEX_SIDE_NAVBAR } from '../../constants/zIndex';

const NavBar = (props: any) => {
    const dispatch = useDispatch();
    const { isNavOpen, isLoggedIn } = useSelector((state: any) => state.uiState);
    const { files } = useSelector((state: any) => state.filesState);

    const navLinks = [
        { label: "About Us", to: "/", icon: <InfoIcon /> },
        { label: "Discover", to: "/discover", icon: <ExploreIcon /> },
    ];

    return (
        <div>
            <Drawer
                open={isNavOpen}
                variant="persistent"
                anchor="left"
                PaperProps={{
                    className: "sidenav card bg-blur",
                    style: { zIndex: Z_INDEX_SIDE_NAVBAR,  width: "250px", padding: "16px", },
                }}
            >
                <List>
                    {navLinks.map((link) => (
                        <ListItemButton
                            key={link.label}
                            onClick={() => {
                                dispatch(handleRedux("CURRENT_FILE", { file: null }));
                            }}
                            component={Link}
                            to={link.to}
                            sx={{
                                margin: "8px 0",
                                borderRadius: "8px",
                                '&:hover': {
                                    backgroundColor: "#e0e0e0",
                                }
                            }}
                        >
                            {link.icon}
                            <ListItemText primary={link.label} sx={{ marginLeft: "16px" }} />
                        </ListItemButton>
                    ))}
                </List>
                <Divider />
                {isLoggedIn && (
                    <>

                        <NestedList files={files} />
                        <Divider />
                        <CreateFile />
                    </>
                )}
            </Drawer>
            <div id="main" style={{ marginLeft: isNavOpen ? "250px" : 0 }}>
                <span>{props.children}</span>
            </div>
        </div>
    );
};

export default NavBar;
