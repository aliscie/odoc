import React, {useEffect} from "react";
import "./App.css";
import {get_actor} from "./backend_connect/ic_agent";
import NavBar, {openNav} from "./components/spesific/nav_bar";
import TopNavBar from "./components/spesific/top_nav_bar";
import Pages from "./pages/main";
import {BrowserRouter, createBrowserRouter, Link, Route, RouterProvider, Routes} from "react-router-dom";

function App() {
    const [message, setMessage] = React.useState("");

    async function doGreet() {
        setMessage("calling the backend....");
        let actor = await get_actor();
        const greeting = await actor.greet("world");
        setMessage(greeting);
    }

    useEffect(() => {
        doGreet();
    }, []);

    function toggleDarkMode() {
        document.querySelector("body")?.classList.toggle("dark");
    }

    return (
        <BrowserRouter>
            <div>
                <TopNavBar>
                    <a href="#" className="btn" onClick={openNav}>
                        &#9776;
                    </a>

                    <a className="btn"><Link to="/">Home</Link></a>
                    <a className="btn"><Link to="/books">Books</Link></a>
                    <a href="#" className="btn" onClick={toggleDarkMode}>
                        mode
                    </a>
                </TopNavBar>

                <NavBar>
                    {message}

                    <Pages/>

                </NavBar>
            </div>
        </BrowserRouter>
    )
        ;
}

export default App;
