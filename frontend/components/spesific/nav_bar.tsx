import React from 'react';
import "./style/nav_bar.css"
import {useSelector} from "react-redux";
import NestedList from "../genral/NestedList";
import CustomizedMenus from "../genral/drop_down";
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import {Button, Divider} from "@mui/material";

const NavBar = (props: any) => {

    const isNavOpen = useSelector((state: any) => state.isNavOpen);

    return (
        <div>
            <div
                style={{width: isNavOpen ? "250px" : 0}}
                id="mySidenav" className="sidenav card bg-blur">
                <Button color={"inherit"} style={{width: "100%"}}>Discover</Button>
                <Divider/>
                <NestedList
                    // title={"private"}
                    data={[
                        {content: "file one"},
                        {content: "file tow"},
                        {
                            content: "another file",
                            children: [{
                                content: "file inside the other file",
                            }]
                        },
                    ]}/>
                <Divider/>
                <CustomizedMenus style={{width: "100%"}} options={[
                    {content: "contract page", icon: <GavelRoundedIcon/>},
                    {content: "note page", icon: <EditNoteRoundedIcon/>}
                ]}>
                    Create
                </CustomizedMenus>
            </div>

            <div id="main" style={{marginLeft: isNavOpen ? "250px" : 0}}>
                    <span>
                {props.children}
                    </span>

            </div>
        </div>

    );
};
export default NavBar;