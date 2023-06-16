import React from "react";

function Card(props: any) {
    return <div className="card bg-blur feature">
        <h2>{props.title}</h2>
        <p>
            {props.children}
        </p>
    </div>
}
export default Card;