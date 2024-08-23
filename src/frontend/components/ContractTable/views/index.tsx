import Payments from "./Payments";
import Promises from "./Promeses";
import React, {useEffect} from "react";
import {CONTRACT, PAYMENTS, PROMISES} from "../types";
import {CustomContract} from "../../../../declarations/backend/backend.did";

export type VIEW = PROMISES | CONTRACT | PAYMENTS;

interface Props {
    view: VIEW,
    contract: CustomContract
}

function RenderViews(props: Props) {
    switch (props.view) {
        case PROMISES:
            return <Promises contract={props.contract} />
        case PAYMENTS:
            return <Payments contract={props.contract} />
        default:
            return <div>Unknown view</div>
    }
}

export default RenderViews;
