import React, { useEffect, useState } from "react";
import {
  ActionRating,
  ActionType,
  PaymentStatus,
  Rating,
  User,
  UserProfile,
} from "../../declarations/backend/backend.did";
import { FriendCom } from "./profile/Friends";
import { Principal } from "@dfinity/principal";
import { Grid, List, Rating as RatingCom } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import useGetUser from "../utils/get_user_by_principal";
import { useBackendContext } from "../contexts/BackendContext";
import Dashboard from "../components/MuiComponents/dashboard";
import { StatCardProps } from "../components/MuiComponents/dashboard/components/StatCard";
import { features } from "./LandingPage/data";
import InfoCard from "../components/MuiComponents/infoCard";
import SmartContractIcon from "@mui/icons-material/AccountBalanceWallet";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
export function UserHistoryComponent(profile: UserProfile) {
  let { getUser } = useGetUser();

  const [actionRatingsWithNames, setActionRatingsWithNames] = useState([]);
  ``;
  useEffect(() => {
    // Function to fetch names and update state
    (async () => {
      let values = await Promise.all(
        profile.rates_by_actions.map(async (i: ActionRating, index) => {
          let type: ActionType = i.action_type;
          if (Object.keys(type)[0] == "Payment") {
            let status: PaymentStatus = type["Payment"].status;
            if (Object.keys(status)[0] == "Objected") {
              let receiver: Principal = type["Payment"].receiver;
              let receiver_name = await getUser(receiver.toString());
              // todo add the type['Payment'].date
              return {
                name: receiver_name && receiver_name.name,
                objection: status["Objected"],
              };
            }
          }
        }),
      );

      setActionRatingsWithNames(values);
    })();
  }, []);

  let actions_len = profile.rates_by_actions.length;
  const data = [
    {
      title: "id",
      content: String(profile.id),
      icon: <FingerprintIcon />,
    },
    {
      title: "description",
      content: profile.description,
      // icon: <FingerprintIcon />,
    },
    // {
    //   title: "spent",
    //   content: profile.spent,
    //   icon: <AttachMoneyIcon />,
    // },
    // {
    //   title: "received",
    //   content: profile.received,
    //   // icon: <FingerprintIcon />,
    // },
    {
      title: "Interacted with",
      content: profile.users_interacted,
      // icon: <FingerprintIcon />,
    },
    {
      title: "dept",
      content: profile.total_debt,
      // icon: <FingerprintIcon />,
    },
  ];
  return (
    <>
      <Grid container spacing={2}>
        {data.map((feature, index) => (
          <InfoCard {...feature} index={index} />
        ))}
      </Grid>
      {profile.rates_by_others.map((rate: Rating) => {
        return (
          <ListItemText
            primary={<RatingCom readOnly defaultValue={Number(rate.rating)} />}
            // secondary={(rate.user.id == profile.id ? "You" : rate.user.name) + ": " + rate.comment}
            secondary={rate.comment}
          />
        );
      })}

      <List>
        {actionRatingsWithNames.map((item, index) => {
          return (
            <div key={index}>
              {item && (
                <ListItemText
                  primary={item.name}
                  secondary={`Objection: ${item.objection}`}
                />
              )}
            </div>
          );
        })}
      </List>

      <LineChart
        xAxis={[
          {
            data: profile.rates_by_actions.map(
              (i: ActionRating, index) => index,
            ),
          },
        ]}
        series={[
          {
            label: "spent",
            data: profile.rates_by_actions.map((i, index) => i.spent),
          },
          {
            label: "promise",
            data: profile.rates_by_actions.map((i, index) => i.promises),
          },
          {
            label: "received",
            data: profile.rates_by_actions.map((i, index) => i.received),
          },
        ]}
        width={1000}
        height={300}
      />

      <LineChart
        xAxis={[
          {
            data: profile.rates_by_actions.map(
              (i: ActionRating, index) => index,
            ),
          },
        ]}
        series={[
          {
            label: "Actions rating",
            data: profile.rates_by_actions.map((i, index) => i.rating || 0),
          },
          {
            label: "Users rating",
            data: profile.rates_by_others.map((i, index) => i.rating || 0),
          },
        ]}
        width={1000}
        height={300}
      />
    </>
  );
}

function UserPage() {
  const { backendActor } = useBackendContext();
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const [user_history, setUser_history] = React.useState<any | undefined>(
    undefined,
  );
  let url = window.location.search;
  let user_id = url.split("=")[1];
  // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const labelId = user && `checkbox-list-secondary-label-${user.name}`;

  // const {profile, friends, contracts, wallet} = useSelector((state: any) => state.filesReducer);

  useEffect(() => {
    (async () => {
      let user = Principal.fromText(user_id);
      let res: undefined | { Ok: UserProfile } | { Err: string } =
        await backendActor.get_user_profile(user);
      if ("Ok" in res) {
        setUser(res.Ok);
        setUser_history(res.Ok);
      } else if ("Err" in res) {
        console.log(res.Err);
      }
    })();
  }, []);

  const data: StatCardProps[] = [
    {
      title: "Users interacted",
      value: "10",
      interval: "Last 30 days",
      trend: "up",
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360,
        340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600,
        880, 920,
      ],
    },
    // {
    //   title: "Conversions",
    //   value: "325",
    //   interval: "Last 30 days",
    //   trend: "down",
    //   data: [
    //     1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840,
    //     600, 820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400,
    //     360, 300, 220,
    //   ],
    // },
    // {
    //   title: "Event count",
    //   value: "200k",
    //   interval: "Last 30 days",
    //   trend: "neutral",
    //   data: [
    //     500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620,
    //     510, 530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430,
    //     520, 510,
    //   ],
    // },
  ];

  return (
    <>
      {/*<Dashboard data={data} />*/}
      {user_history && user && (
        <>
          <FriendCom
            rate={user_history.users_rate}
            {...user}
            labelId={"labelId"}
          />
          <UserHistoryComponent {...user_history} />
        </>
      )}
    </>
  );
}

export default UserPage;
