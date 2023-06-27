import React from 'react';
import "./style/nav_bar.css"
import {useSelector} from "react-redux";
import NestedList from "./nested_list/nest_list"
import CustomizedMenus from "../genral/drop_down";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import CreateNote from "../actions/create_note";
import EditNoteIcon from '@mui/icons-material/EditNote';
import PaymentContract from "../actions/create_agreement";
import FunctionsIcon from '@mui/icons-material/Functions';
import PaidIcon from '@mui/icons-material/Paid';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const NavBar = (props: any) => {
    const {isNavOpen, isLoggedIn} = useSelector((state: any) => state.uiReducer);
    const {files} = useSelector((state: any) => state.filesReducer);
    return (
        <div>
            <div
                style={{width: isNavOpen ? "250px" : 0}}
                id="mySidenav" className="sidenav card bg-blur">
                <Link to="/Discover"><Button>Discover</Button></Link>
                <Link to="/editor_demo"><Button>Editor demo</Button></Link>
                <Link to="/blog"><Button>Blog</Button></Link>
                <Link to="/about_us"><Button>About us</Button></Link>

                {isLoggedIn && <>
                    <NestedList
                        // title={"private"}
                        data={files}/>
                    <hr/>

                    <CustomizedMenus style={{width: "100%"}} options={[
                        {content: <CreateNote/>, preventClose: true, icon: <EditNoteIcon/>},
                        {content: <PaymentContract/>, icon: <PaidIcon/>},
                        {content: "Accumulative contract", icon: <ShowChartIcon/>},
                        {content: "Custom contract", icon: <FunctionsIcon/>},
                    ]}>
                        Create
                    </CustomizedMenus>
                </>}
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