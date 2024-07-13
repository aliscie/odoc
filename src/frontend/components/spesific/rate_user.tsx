import {Rating} from "../../../declarations/backend/backend.did";
import {Input, Rating as RatingCom} from "@mui/material";
import * as React from "react";
import {Principal} from "@dfinity/principal";
import {randomString} from "../../data_processing/data_samples";
import {actor} from "../../App";
import {useSnackbar} from "notistack";
import DialogOver from "../genral/daiolog_over";
import {LoadingButton} from "@mui/lab";
import {useSelector} from "react-redux";

interface Props {
    id: string,
    rate: number,
}


function RateUser(props: Props) {
    const {profile} = useSelector((state: any) => state.filesReducer);

    // const [comment, setComment] = React.useState<string>("");
    const commentRef = React.useRef<string>("");
    const [rate, setRate] = React.useState<number | null>(props.rate);
    const [loading, setLoading] = React.useState<boolean>(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleRating = (event, newValue) => {
        if (newValue > 0) {
            setRate(newValue)
        }
    }
    const handleSubmit = async () => {
        let rating: Rating = {
            'id': randomString(),
            'date': Date.now() * 1e6,
            'user_id': Principal.fromText(profile.id),
            'comment': commentRef.current,
            'rating': rate || 0,
        }
        setLoading(true)
        let res: undefined | { Ok: null } | { Err: string } = actor && await actor.rate_user(Principal.fromText(props.id), rating)
        setLoading(false)
        setRate(props.rate)
        if (res && res['Ok']) {
            enqueueSnackbar("Thank you for your feedback", {variant: "success"})
        } else if (res) {
            enqueueSnackbar(res['Err'], {variant: "error"})
        } else {
            enqueueSnackbar("Something went wrong", {variant: "error"})
        }
        return res
    }
    const handleInput = (event: any) => {
        // setComment(event.target.value)
        commentRef.current = event.target.value
    }

    return <DialogOver
        size={"small"}
        disabled={loading}
        variant="text"
        DialogContent={(dia: any) => <React.Fragment>
            Comment : <Input disabled={loading} onChange={handleInput}/>
            <LoadingButton loading={loading} disabled={loading} onClick={async () => {
                await handleSubmit()
                dia.handleCancel()
            }}>Submit</LoadingButton>
        </React.Fragment>}>
        <RatingCom
            // Disabled
            onChangeActive={handleRating}
            name="half-rating" defaultValue={rate || 0} precision={0.5}/>
    </DialogOver>
}

export default RateUser;