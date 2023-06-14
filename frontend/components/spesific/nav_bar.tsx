import React, {useEffect, useState} from 'react';
import "./style/nav_bar.css"
import {useSelector} from "react-redux";
import NestedList from "../genral/NestedList";
import CustomizedMenus from "../genral/drop_down";
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import {backend} from "../../backend_connect/main";
import {get_files} from "../../backend_connect/connect";

const NavBar = (props: any) => {
    const [files, setFiles] = useState({});
    const isNavOpen = useSelector((state: any) => state.isNavOpen);


    const handleCreatePage = async (e: any) => {
        e.target.classList.add("loader")
        let res = await backend.create_file("new page")
        e.target.classList.remove("disabled")
        console.log(res)
    };
    useEffect(() => {
        const fetchData = async () => {
            let res = await backend.get_files()
            let data = {};
            res[0].map(files => {
                data[files[1].id] = files[1]
            })
            setFiles(data)
        };
        fetchData(); // Call the async function immediately inside the useEffect hook
    }, []);


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