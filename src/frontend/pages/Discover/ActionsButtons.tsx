import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import React, { useEffect } from "react";
import { Post, PostUser } from "../../../declarations/backend/backend.did";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import VoteButton from "./VoteButton";
import { useBackendContext } from "../../contexts/BackendContext";

interface Props {
  post: PostUser;
}

let tags_options = [{ id: 1, title: "+add tag", value: "+add tag" }];

function ActionsButtons(props: Props) {
  const { backendActor } = useBackendContext();
  const { profile } = useSelector((state: any) => state.filesState);
  const { post_vote }: { post_vote: undefined | Post } = useSelector(
    (state: any) => state.uiState,
  );
  let current_user: Principal | undefined =
    profile && Principal.fromText(profile.id);
  let is_creator: boolean = profile && props.post.creator.id == profile.id;
  const [votes, setVotes] = React.useState({
    up: props.post.votes_up,
    down: props.post.votes_down,
  });

  let already_voted_up =
    current_user &&
    votes.up.some(
      (item) => item.__principal__ === current_user.__principal__,
    );
  let already_voted_down =
    profile &&
    votes.down.some(
      (item) => item.__principal__ === current_user.__principal__,
    );

  if (typeof already_voted_up === "undefined") already_voted_up = true;
  if (typeof already_voted_down === "undefined") already_voted_down = true;


  useEffect(() => {
    if (post_vote) {
      if (post_vote.id === props.post.id) {
        let up = post_vote.votes_up;
        let down = post_vote.votes_down;
        setVotes({ up, down });
      }
    }
  }, [post_vote]);

  return (
    <>
      <VoteButton
        action={async () => {
          let v = votes;
          if (votes.up.find((u) => u.toString() === profile.id)) {
            return;
          }
          if (votes.down.find((u) => u.toString() === profile.id)) {
            v.down = votes.down.filter((u) => u.toString() !== profile.id);
          }
          setVotes(v);
          v.up = [...votes.up, Principal.fromText(profile.id)];
          return backendActor && (await backendActor?.vote_up(props.post.id));
        }}
        disabled={already_voted_up || is_creator}
        icon={<ThumbUpIcon />}
        count={votes.up.length}
        key={votes.up.length}
      />
      <VoteButton
        key={votes.down.length}
        action={async () => {
          let v2 = votes;
          if (votes.down.find((u) => u.toString() === profile.id)) {
            return;
          }
          if (votes.up.find((u) => u.toString() === profile.id)) {
            v2.up = votes.up.filter((u) => u.toString() !== profile.id);
          }
          votes.down = [...votes.down, Principal.fromText(profile.id)];
          setVotes(v2);
          return backendActor && (await backendActor?.vote_down(props.post.id));
        }}
        disabled={already_voted_down || is_creator}
        icon={<ThumbDownIcon />}
        count={votes.down.length}
      />

      <IconButton aria-label="share">
        <ShareIcon />
      </IconButton>
    </>
  );
}

export default ActionsButtons;
