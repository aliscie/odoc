import React from 'react';
import "./style/nav_bar.css"
import {useDispatch, useSelector} from "react-redux";
import NestedList from "./nested_list/nest_list"
import CustomizedMenus from "../genral/drop_down";
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import {backend} from "../../backend_connect/main";
import {handleRedux} from "../../redux/main";

const NavBar = (props: any) => {
    const dispatch = useDispatch();

    const {isNavOpen} = useSelector((state: any) => state.uiReducer);
    const {files} = useSelector((state: any) => state.filesReducer);


    const handleCreatePage = async (e: any) => {
        e.target.classList.add("loader")
        let res = await backend.create_file("new page")
        e.target.classList.remove("disabled")
        dispatch(handleRedux("ADD", {data: res}))
    };

    return (
        <div>
            <div
                style={{width: isNavOpen ? "250px" : 0}}
                id="mySidenav" className="sidenav card bg-blur">
                <Link to="/Discover"><Button>Discover</Button></Link>
                <Link to="/blog"><Button>Blog</Button></Link>
                <Link to="/about_us"><Button>About us</Button></Link>
                <NestedList
                    // title={"private"}
                    data={files}/>
                <hr/>
                <CustomizedMenus style={{width: "100%"}} options={[
                    {content: "contract page", icon: <GavelRoundedIcon/>},
                    {content: "note page", handleClick: handleCreatePage, icon: <EditNoteRoundedIcon/>}
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