import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ConfirmButton from "./confirm_button";
import GppBadIcon from "@mui/icons-material/GppBad";
import ReceiverComponent from "./render_reciver_column";
import {GridValueGetterParams} from "@mui/x-data-grid";
import * as React from "react";
import PaymentOptions from "./payment_contract_options";

export let RenderConfirmed = (props: any) => {

    let receiver = props.row.receiver;
    let is_confirmed = props.row.confirmed == true;

    if (is_confirmed) {
        return <VerifiedUserIcon/>
    }

    if (receiver === props.profile.name) { // TODO use receiver.id === profile.id instead.
        return <ConfirmButton
            sender={props.row.sender}
            id={props.row.id}
            confirmed={is_confirmed}
        />
    }
    return <GppBadIcon disabled/>
}
export let RenderReceiver = (props: any) => ReceiverComponent({...props})
export let RenderRelease = (params: GridValueGetterParams) => {
    return <PaymentOptions {...params.row} />
}
