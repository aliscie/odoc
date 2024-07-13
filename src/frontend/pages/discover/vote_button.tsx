import {Badge} from "@mui/base";
import React from "react";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";
import {Post} from "../../../declarations/backend/backend.did";
import {handleRedux} from "../../redux/main";
import {useDispatch} from "react-redux";

interface Props {
    action: () => Promise<undefined | { Ok: Post } | { Err: string }>,
    disabled: boolean,
    icon: any,
    count: number,
}

function VoteButton(props: Props) {
    const [loading, setLoading] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();

    return (
        <Badge
            key={props.count} // Add key prop to force re-render
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            badgeContent={props.count}
        >
            <LoadingButton
                loading={loading}
                disabled={props.disabled}
                onClick={async () => {
                    setLoading(true);
                    try {
                        const res = await props.action();
                        if ("Ok" in res) {
                            dispatch(handleRedux("POST_VOTE", {post_vote: res.Ok}));
                        } else {
                            enqueueSnackbar("Error: " + res?.Err, {variant: "error"});
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    } finally {
                        setLoading(false);
                    }
                }}
                aria-label="add to favorites"
            >
                {props.icon}
            </LoadingButton>
        </Badge>
    );
}


export default VoteButton;