import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import React, {useEffect} from "react";
import {Post, PostUser} from "../../../declarations/backend/backend.did";
import {actor} from "../../App";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {useSelector} from "react-redux";
import {Principal} from "@dfinity/principal";
import VoteButton from "./vote_button";

interface Props {
    post: PostUser
}

let tags_options = [
    {id: 1, title: "+add tag", value: "+add tag"},
]

function ActionsButtons(props: Props) {
    const {profile} = useSelector((state: any) => state.filesReducer);
    const {post_vote}: { post_vote: undefined | Post } = useSelector((state: any) => state.uiReducer);
    let current_user: Principal | undefined = profile && Principal.fromText(profile.id);
    let is_creator: boolean = profile && props.post.creator.id == profile.id;
    let already_voted_up = current_user && props.post.votes_up.some(item => item.__principal__ === current_user.__principal__);
    let already_voted_down = profile && props.post.votes_down.some(item => item.__principal__ === current_user.__principal__);

    if (typeof already_voted_up === "undefined") already_voted_up = true;
    if (typeof already_voted_down === "undefined") already_voted_down = true;


    const [votes, setVotes] = React.useState({
        up: props.post.votes_up.length,
        down: props.post.votes_down.length
    });
    useEffect(() => {

        if (post_vote) {
            if (post_vote.id === props.post.id) {
                let up = post_vote.votes_up.length;
                let down = post_vote.votes_down.length;
                setVotes({up, down});
            }
        }
    }, [post_vote]);

    return <>

        <VoteButton
            action={async () => {
                return actor && await actor?.vote_up(props.post.id)
            }}
            disabled={already_voted_up || is_creator}
            icon={<ThumbUpIcon/>}
            count={votes.up}
        />
        <VoteButton
            action={async () => {
                return actor && await actor?.vote_down(props.post.id)
            }}
            disabled={already_voted_down || is_creator}
            icon={<ThumbDownIcon/>}
            count={votes.down}
        />


        <IconButton
            aria-label="share">
            <ShareIcon/>
        </IconButton>
    </>
}

export default ActionsButtons;