import React from 'react';
import "./style/nav_bar.css"
import {useSelector} from "react-redux";
import NestedList from "../genral/NestedList";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import CustomizedMenus from "../genral/drop_down";
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
const NavBar = (props: any) => {

    const isNavOpen = useSelector((state: any) => state.isNavOpen);

    return (
        <div>
            <div
                style={{width: isNavOpen ? "250px" : 0}}
                id="mySidenav" className="sidenav card bg-blur">
                <NestedList title={"discover"} data={[
                    {icon: <InboxIcon color="primary"/>, content: "sent mail"},
                    {content: "drafts"},
                    {
                        content: "inbox",
                        children: [{
                            content: "child",
                            children: [{
                                content: "nested",
                                children: [{content: "child", children: [{content: "child of child",}]}]
                            }]
                        }]
                    },
                ]}/>
                <hr/>
                <NestedList title={"private"} data={[
                    {content: "file one"},
                    {content: "file tow"},
                    {
                        content: "another file",
                        children: [{
                            content: "file inside the other file",
                        }]
                    },
                ]}/>
                <CustomizedMenus options={[
                    {content: "contract page", icon: <GavelRoundedIcon/>},
                    {content: "note page", icon: <EditNoteRoundedIcon/>}
                ]}>
                    Create New Page
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