import React, {useEffect} from "react";

// import {backend} from "./declarations/backend";
import "./App.css";
import {get_actor} from "./backend_connect/ic_agent";

function App() {
    const [message, setMessage] = React.useState("");
    async function doGreet() {
        setMessage("calling the backed ....");
        let actor = await get_actor();
        const greeting = await actor.greet("world");
        setMessage(greeting);
    }

    useEffect(() => {
        doGreet()
    }, []);

    return (
        <div style={{fontSize: "30px"}}>
            {message}
        </div>
    );
}

export default App;
