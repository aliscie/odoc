import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { handleRedux } from "../../redux/store/handleRedux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Box, Tooltip } from "@mui/material";
import * as React from "react";
import LoaderButton from "../../components/MuiComponents/LoaderButton";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Friend } from "../../../declarations/backend/backend.did";
import RateUser from "../../components/Actions/RateUser";
import { UserAvatar } from "../../components/MuiComponents/PostComponent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useBackendContext } from "../../contexts/BackendContext";

interface FriendProps {
  id: string;
  // is_friend?: boolean,
  name: string;
  photo: any;
  labelId: string;
  rate?: number;
  confirmed?: boolean;
}

function SecondaryActionSwitch(props) {
  const { backendActor } = useBackendContext();
  let { id, confirmed } = props;
  const { friends, profile } = useSelector((state: any) => state.filesState);
  // let p = Principal.fromText(profile).toHex()
  // console.log({p})
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  let is_sender = false;
  let is_receiver = false;
  let isFriend = friends.find((f: Friend) => {
    confirmed = f.confirmed;
    if (f.sender.id == profile.id) {
      is_sender = true;
      return true;
    } else if (f.receiver.id == profile.id) {
      is_receiver = true;
      return true;
    }

    return false;
  });

  const state = `${is_sender ? "sender" : ""}${is_receiver ? "is_receiver" : ""}${confirmed ? "confirmed" : ""}${isFriend ? "friend" : ""}`;

  async function handleConfirm(id: string) {
    if (typeof id != "string") {
      id = id.toText();
    }
    let res = backendActor && (await backendActor.accept_friend_request(id));
    dispatch(
      handleRedux("UPDATE_NOTE", { id: id + profile.id, is_seen: true }),
    );
    dispatch(
      handleRedux("CONFIRM_FRIEND", {
        friend: {
          confirmed: true,
          sender: props,
          receiver: profile,
        },
      }),
    );

    // actor && dispatch(handleRedux('UPDATE_NOTIFY', {new_list: await actor.get_notifications()}));
    return res;
  }

  async function handleUnfriend(id: string) {
    if (typeof id != "string") {
      id = id.toText();
    }
    let res = await backendActor.unfriend(id);
    if (res.Ok) {
      dispatch(handleRedux("REMOVE_FRIEND", { id: id }));
      if (is_sender) {
        dispatch(
          handleRedux("UPDATE_NOTE", { id: profile.id + id, is_seen: true }),
        );
      } else {
        dispatch(
          handleRedux("UPDATE_NOTE", { id: id + profile.id, is_seen: true }),
        );
      }
    }
    return res;
  }

  async function handleCancel(id: string) {
    if (typeof id != "string") {
      id = id.toText();
    }
    let res = await backendActor.cancel_friend_request(id);
    if (res.Ok) {
      dispatch(handleRedux("REMOVE_FRIEND", { id: id }));
      dispatch(handleRedux("DELETE_NOTIFY", { id: profile.id + id }));
    }
    return res;
  }

  async function handleReject(id: string) {
    if (typeof id != "string") {
      id = id.toText();
    }
    let res = await backendActor.reject_friend_request(id);
    if (res.Ok) {
      dispatch(handleRedux("REMOVE_FRIEND", { id: id }));
      dispatch(handleRedux("DELETE_NOTIFY", { id: id + profile.id }));
    }
    return res;
  }

  async function handleFriedReq(user) {
    if (typeof user != "string") {
      user = user.toText();
    }
    let loading = enqueueSnackbar(
      <span>
        sending friend request... <span className={"loader"} />
      </span>,
      { variant: "info" },
    );
    let friend_request = await backendActor.send_friend_request(user);
    console.log({ friend_request });
    dispatch(
      handleRedux("ADD_FRIEND", {
        friend: {
          confirmed: false,
          sender: profile,
          receiver: { id: props.id.toString(), ...props },
        },
      }),
    );
    closeSnackbar(loading);
    if (friend_request.Err) {
      enqueueSnackbar(friend_request.Err, { variant: "error" });
    }
    if (friend_request.Ok) {
      enqueueSnackbar("Friend request sent", { variant: "success" });
    }
    return friend_request;
  }

  switch (state) {
    case "senderfriend":
      return (
        <LoaderButton onClick={async () => await handleCancel(id)}>
          Cancel
        </LoaderButton>
      );
    case "senderconfirmedfriend":
      return (
        <LoaderButton
          onClick={async () => await handleUnfriend(id)}
          color="error"
        >
          Unfriend
        </LoaderButton>
      );
    case "is_receiverconfirmedfriend":
      return (
        <LoaderButton
          onClick={async () => await handleUnfriend(id)}
          color="error"
        >
          Unfriend
        </LoaderButton>
      );
    case "":
      return (
        <>
          <Tooltip title={"Send friend request"}>
            <LoaderButton
              startIcon={<GroupAddIcon />}
              onClick={async () => {
                let res = await handleFriedReq(id);
                return { Ok: "" };
              }}
            />
          </Tooltip>
        </>
      );
    default:
      return (
        <>
          {!confirmed && !is_sender && (
            <Box display="flex" gap={1}>
              <Tooltip title={"Confirm"}>
                <LoaderButton
                  onClick={async () => await handleConfirm(id)}
                  color="success"
                  startIcon={<CheckCircleIcon />}
                />
              </Tooltip>
              <Tooltip title={"Reject"}>
                <LoaderButton
                  onClick={async () => await handleReject(id)}
                  color="error"
                  startIcon={<CancelIcon />}
                />
              </Tooltip>
            </Box>
          )}
        </>
      );
  }
}

export function FriendCom(props: FriendProps) {
  const { profile, friends } = useSelector((state: any) => state.filesState);

  return (
    <ListItem>
      <ListItemAvatar>
        <UserAvatar {...props} />
      </ListItemAvatar>
      <Box display="flex" alignItems="center" width="100%">
        <Box flexGrow={1}>
          <RateUser rate={props.rate || 0} id={props.id} />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <SecondaryActionSwitch {...props} />
        </Box>
      </Box>
    </ListItem>
  );
}

function Friends(props: any) {
  const { profile, friends } = useSelector((state: any) => state.filesState);

  if (!friends) {
    return <></>;
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <List dense>
        {friends.map((value) => {
          let user =
            value.receiver.id !== profile.id ? value.receiver : value.sender;
          const labelId = `checkbox-list-secondary-label-${value.receiver.name}`;
          return (
            <ListItem key={user.id} disablePadding>
              <FriendCom
                {...user}
                {...value}
                is_friend={value.confirmed}
                labelId={labelId}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default Friends;
