import React, {useEffect} from "react";
import "./App.css";
import {get_actor} from "./backend_connect/ic_agent";
import NavBar from "./components/spesific/nav_bar";
import TopNavBar from "./components/spesific/top_nav_bar";
import Pages from "./pages/main";
import {BrowserRouter, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {reduxLogin, reduxLogout, toggle, toggleDarkMode} from "./redux/main";
import {Avatar} from "@mui/material";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import BasicMenu from "./components/genral/basic_menu";
import LogoutIcon from '@mui/icons-material/Logout';
import Editor from "autodox-text-editor";

function EditorRenderer(props: RendererProps) {
    const {tag, content, attributes = {}, children} = props;
    let Tag = tag || "span";
    switch (tag) {
        case "quote":
            return <div>quote {children}</div>;
        default:
            return (<Tag
                style={{margin: 0}}
                {...props}
                placeholder={"enter somthing..."}
                {...attributes}>{children}</Tag>)
    }
}

const my_dummies = [
    {tag: 'h3', children: [{id: 'p2', content: 'hello world'}], id: 'p3'},
    {tag: 'h3', children: [{id: 'p2', content: 'hello world'}], id: 'p3'},
    {tag: 'h3', children: [{id: 'p2', content: 'hello world'}], id: 'p3'}
]

function App() {
    const [message, setMessage] = React.useState("");
    const [islogin, setLogin] = React.useState(false);

    async function doGreet() {
        setMessage("calling the backend....");
        let actor = await get_actor();
        const greeting = await actor.greet("world");
        setMessage(greeting);
    }


    useEffect(() => {
        doGreet();
        ``
    }, []);


    const dispatch = useDispatch();
    const isNavOpen = useSelector((state: any) => state.isNavOpen);
    const isDarkMode = useSelector((state: any) => state.isDarkMode);
    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
    return (
        <BrowserRouter>
            <div>


                <TopNavBar>
                    <a href="#" className="btn"
                       onClick={() => dispatch(toggle())}
                    >
                        {isNavOpen ? <MenuOpenIcon/> : <MenuIcon/>}
                    </a>


                    <a className="btn"><Link to="/">Home</Link></a>
                    <a className="btn"><Link to="/Whitepaper">Whitepaper</Link></a>
                    <a className="btn"><Link to="/books">Books</Link></a>
                    <a href="#" className="btn" onClick={() => dispatch(toggleDarkMode())}>
                        {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/>}
                    </a>
                    {isLoggedIn ? <BasicMenu options={[
                        {content: "profile", icon: <GavelRoundedIcon/>},
                        {content: "settings", icon: <EditNoteRoundedIcon/>},
                        {content: "logout", icon: <LogoutIcon/>, onClick: () => dispatch(reduxLogout())}
                    ]}>
                        <Avatar alt="Remy Sharp" src="https://avatars.githubusercontent.com/u/58806996?v=4"/>
                    </BasicMenu> : <button onClick={() => dispatch(reduxLogin())} className={"btn"}> login</button>}


                </TopNavBar>

                <NavBar>
                    {message}

                    {/*https://github.com/aliscie/text-editor*/}
                    <Editor
                        element_render={EditorRenderer}
                        data={my_dummies}
                    />

                    <Pages/>

                </NavBar>
            </div>
        </BrowserRouter>
    )
        ;
}

export default App;
