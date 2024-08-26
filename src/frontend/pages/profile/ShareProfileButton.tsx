import Button from "@mui/material/Button";
import * as React from "react";
import { useSelector } from "react-redux";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Tooltip } from "@mui/material";

function ShareProfile() {
  const { Anonymous, profile } = useSelector((state: any) => state.filesState);
  if (Anonymous || !profile) {
    return null;
  }
  let domain = window.location.origin;
  let id = profile.id;
  let profile_link = `${domain}/user?id=${id}`;
  const [copied, setCopied] = React.useState(false);
  // count down for 1 second and setCopied(false)
  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Tooltip
        title={
          copied
            ? "You just copied your profile url."
            : "Click here to copy your profile link."
        }
      >
        <Button
          variant={"outlined"}
          color={copied ? "success" : "primary"}
          style={{
            width: "95%",
          }}
          onClick={() => {
            navigator.clipboard.writeText(profile_link);
            setCopied(true);
          }}
        >
          ShareProfile
          {copied && (
            <DoneAllIcon style={{ marginLeft: "10px" }} color={"success"} />
          )}
        </Button>
      </Tooltip>
    </div>
  );
}

export default ShareProfile;
