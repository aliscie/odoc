import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ConfirmButton from "./confirm_button";
import GppBadIcon from "@mui/icons-material/GppBad";
import ReceiverComponent from "./render_reciver_column";
import {GridValueGetterParams} from "@mui/x-data-grid";
import ReleaseButton from "./release_button";
import CancelButton from "./cancel_button";
import * as React from "react";
import {useSelector} from "react-redux";

export let RenderConfirmed = (props: any) => {
    const {profile,} = useSelector((state: any) => state.filesReducer);

    let receiver = props.row.receiver;
    let is_confirmed = props.row.confirmed == true;

    if (is_confirmed) {
        return <VerifiedUserIcon/>
    }

    if (receiver === profile.name) { // TODO use receiver.id === profile.id instead.
        return <ConfirmButton
            sender={props.row.sender}
            id={props.row.id}
            confirmed={is_confirmed}
        />
    }
    return <GppBadIcon disabled/>
}
export let RenderReceiver = (props: any) => ReceiverComponent({...props, options: all_friends})
export let RenderRelease = (params: GridValueGetterParams) => {
    return <span style={{minWidth: "200px"}}>
                <ReleaseButton
                    contract={params.row}
                />

            <CancelButton
                contract={params.row}
            />
        </span>
}
