import React, { useEffect, useState } from "react";
import BasicMenu from "../MuiComponents/BasicMenu";
import { Badge } from "@mui/base";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {useDispatch, useSelector} from "react-redux";
import useGetUser from "../../utils/get_user_by_principal";
import DialogOver from "../MuiComponents/DialogOver";
import {CircularProgress, Divider, Input, Typography} from "@mui/material";
import LoaderButton from "../MuiComponents/LoaderButton";
import {
  CPayment,
  Notification,
} from "../../../declarations/backend/backend.did";
import { formatRelativeTime } from "../../utils/time";
import { useBackendContext } from "../../contexts/BackendContext";
import {handleRedux} from "../../redux/store/handleRedux";

function CPaymentContractDialog(props: {
  notification: Notification;
}): JSX.Element {
  const { backendActor } = useBackendContext();

  const { notification } = props;
  const c_payment: CPayment = notification.content.CPaymentContract[0];
  const [status, setStatus] = useState<string>(() => {
    const newStatus = Object.keys(c_payment.status)[0];
    return newStatus;
  });
  const objection = status === "Objected" ? c_payment.status[status] : "";

  const handleButtonClick = async (action: string) => {
    let res;
    switch (action) {
      case "approve_heigh_conform":
        res =
          backendActor && (await backendActor.approve_high_promise(c_payment));
        break;
      case "object_on_cancel":
        res =
          backendActor &&
          (await backendActor.object_on_cancel(c_payment, "Reason"));
        setStatus("Objected");
        break;
      case "confirmed_c_payment":
        res =
          backendActor && (await backendActor.confirmed_c_payment(c_payment));
        setStatus("Confirmed");
        break;
      case "confirmed_cancellation":
        res =
          backendActor &&
          (await backendActor.confirmed_cancellation(c_payment));
        setStatus("ConfirmedCancellation");
        break;
      default:
        break;
    }
    return res;
  };

  return (
    <>
      {status === "HighPromise" && (
        <>
          You can confirm this contract to protect it from cancellation. The
          sender set it to high confirm, which means they can't withdraw their
          balance.
          <LoaderButton
            onClick={() => handleButtonClick("approve_heigh_conform")}
          >
            High Confirm
          </LoaderButton>
        </>
      )}
      {status === "Released" && <>Payment released</>}
      {status !== "HighPromise" && status !== "Released" && (
        <>
          <h3>Status: {status}</h3>
          {status !== "ConfirmedCancellation" && (
            <>
              <Divider>The objection reason here.</Divider>
              <Input
                defaultValue={objection}
                onChange={(e) => e.target.value}
              />
              <LoaderButton
                onClick={() => handleButtonClick("object_on_cancel")}
              >
                Object on cancellation
              </LoaderButton>
            </>
          )}
          <Divider />
          {status !== "Confirmed" &&
            status !== "Objected" &&
            status !== "ConfirmedCancellation" && (
              <>
                <Divider>
                  You can confirm this contract to protect it from cancellation.
                </Divider>
                <LoaderButton
                  onClick={() => handleButtonClick("confirmed_c_payment")}
                >
                  Confirm
                </LoaderButton>
              </>
            )}
          <h3 style={{ color: "orange" }}>
            {status === "RequestCancellation" &&
              "The payer requested to cancel this promise"}
          </h3>
          {status !== "ConfirmedCancellation" && (
            <>
              <Divider>
                You can approve the cancellation to allow renounce this payment.
              </Divider>
              <LoaderButton
                onClick={() => handleButtonClick("confirmed_cancellation")}
              >
                Confirm Conciliation
              </LoaderButton>
            </>
          )}
        </>
      )}
    </>
  );
}

function CPaymentContract(props: {
  notification: Notification;
}): string | JSX.Element {
  const { sender, notification } = props;

  let Dialog = (props: any) => {
    return <CPaymentContractDialog {...props} notification={notification} />;
  };
  let c_payment: CPayment = notification.content.CPaymentContract[0];
  let actions = notification.content.CPaymentContract
    ? Object.keys(notification.content.CPaymentContract[1])[0].toLowerCase()
    : "";
  let time_stamp = notification.time && formatRelativeTime(notification.time);
  let amount = c_payment.amount;
  return (
    <DialogOver variant="text" DialogContent={Dialog}>
      <div>
        {time_stamp}: {sender} {actions} you {amount}
      </div>
    </DialogOver>
  );
}

function RenderNotification(props: {
  notification: Notification;
}): string | JSX.Element {
  const { notification } = props;

  let { getUser, getUserByName } = useGetUser();
  const [sender, setSender] = useState<string>("");
  const { backendActor } = useBackendContext();

  useEffect(() => {
    (async () => {
      let sender = await getUser(notification.sender);
      setSender(sender ? sender.name : "");
    })();
  }, []);

  let content = notification.content;
  let time = notification.time && formatRelativeTime(notification.time);
  switch (Object.keys(notification.content)[0]) {
    case "FriendRequest":
      return (
        <div>
          {time}: {sender} sent you a friend request
        </div>
      );
    case "ContractUpdate":
      return `${time}: ${sender} accepted your friend request`;
    case "SharePayment":
      return `${time}: ${sender} have paid for your share contract`;
    case "Unfriend":
      return `${time}: ${sender} unfriended you`;
    case "AcceptFriendRequest":
      return `${time}: ${sender} accepted your friend request.`;
    case "CPaymentContract":
      return <CPaymentContract sender={sender} notification={notification} />;
    default:
      console.log("unknown action", notification);
      return `${sender} ${JSON.stringify(content)} action`;
  }
}

function NotificationComponent({
  notification,
}: {
  notification: Notification;
}) {
  // console.log("render Notification") // TODO this renders about 20 times.
  const { backendActor } = useBackendContext();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  return (
    <div
      onClick={async () => {
        if (backendActor && !notification.is_seen) {
          setLoading(true);
          let res = await backendActor.see_notifications(notification.id);
          console.log({res})
          dispatch(handleRedux("UPDATE_NOTE", { ...notification,is_seen: true }));
          setLoading(false);
        }
      }}
      style={{ color: notification.is_seen ? "gray" : "" }}
    >
      {loading && <CircularProgress />}
      <RenderNotification notification={notification} />
    </div>
  );
}

export function Notifications() {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const { notifications } = useSelector(
    (state: any) => state.notificationState,
  );
  useEffect(() => {
    (async () => {
      if (backendActor) {
        let res = await backendActor.get_user_notifications();
        dispatch(handleRedux("UPDATE_NOT_LIST", { new_list: res }));
      }
    })();
  }, [backendActor]);

  const new_notifications =
    notifications &&
    notifications.filter(
      (notification: any) => notification && notification.is_seen == false,
    );

  return (
    <>
      <BasicMenu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        options={
          notifications.length > 0
            ? notifications.map((notification: any) => {
                if (!notification) {
                  return { content: "", to: "" };
                }
                let item = {
                  content: (
                    <NotificationComponent notification={notification} />
                  ),
                  pure: true,
                  // to: 'profile'
                  // onClick: () => clickNotification(notification)
                };
                return item;
              })
            : [{ content: <Typography>You have no notifications.</Typography> }]
        }
      >
        <Badge
          invisible={new_notifications.length == 0}
          // color={'inherit'}
          // anchorOrigin={{
          //     vertical: 'bottom',
          //     horizontal: 'left',
          // }}
          badgeContent={
            new_notifications && (
              <span style={{ color: "tomato" }}>
                {new_notifications.length > 0 && new_notifications.length}
              </span>
            )
          }
          color={new_notifications.length > 0 ? "error" : "action"}
        >
          <NotificationsIcon
            color={new_notifications.length > 0 ? "error" : "action"}
          />
        </Badge>
      </BasicMenu>
    </>
  );
}
