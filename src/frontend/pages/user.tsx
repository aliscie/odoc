import React, {useEffect, useState} from "react";
import {actor} from "../App";
import {
    ActionRating,
    ActionType,
    PaymentStatus,
    Rating,
    User,
    UserProfile
} from "../../declarations/user_canister/user_canister.did";
import {FriendCom} from "./profile/friends";
import {Principal} from "@dfinity/principal";
import {List, Rating as RatingCom} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import {LineChart} from "@mui/x-charts/LineChart";
import useGetUser from "../utils/get_user_by_principal";
import {logger} from "../dev_utils/log_data";

export function UserHistoryCom(profile: UserProfile) {
    let {getUser} = useGetUser();

    const [actionRatingsWithNames, setActionRatingsWithNames] = useState([]);
    ``
    useEffect(() => {
        // Function to fetch names and update state
        (async () => {
            let values = await Promise.all(profile.rates_by_actions.map(async (i: ActionRating, index) => {
                let type: ActionType = i.action_type;
                if (Object.keys(type)[0] == "Payment") {
                    let status: PaymentStatus = type['Payment'].status;
                    if (Object.keys(status)[0] == "Objected") {
                        let receiver: Principal = type['Payment'].receiver;
                        let receiver_name = await getUser(receiver.toString());
                        // todo add the type['Payment'].date
                        return {name: receiver_name && receiver_name.name, objection: status['Objected']}

                    }
                }
            }))

            setActionRatingsWithNames(values);
        })()

    }, []);

    let actions_len = profile.rates_by_actions.length;

    return <>
        <div>spent: {profile.spent} USDT</div>
        <div>received: {profile.received} USDT</div>
        <div>Interacted with : {profile.users_interacted} users</div>
        <div>dept : {profile.total_debt} dept</div>

        {profile.rates_by_others.map((rate: Rating) => {
            return <ListItemText
                primary={<RatingCom readOnly defaultValue={Number(rate.rating)}/>}
                // secondary={(rate.user.id == profile.id ? "You" : rate.user.name) + ": " + rate.comment}
                secondary={rate.comment}
            />
        })}

        <List>
            {actionRatingsWithNames.map((item, index) => {
                return (
                    <div key={index}>
                        {item && <ListItemText
                            primary={item.name}
                            secondary={`Objection: ${item.objection}`}
                        />}
                    </div>
                );
            })}
        </List>

        <Stack direction="row" sx={{width: '100%'}}>
            <LineChart
                xAxis={[{data: profile.rates_by_actions.map((i: ActionRating, index) => index)}]}
                series={[
                    {
                        label: 'rating',
                        data: profile.rates_by_actions.map((i, index) => i.rating || 0),
                    },
                    {
                        label: 'spent',
                        data: profile.rates_by_actions.map((i, index) => i.spent),
                    },
                    {
                        label: 'promise',
                        data: profile.rates_by_actions.map((i, index) => i.promises),
                    },
                    {
                        label: 'received',
                        data: profile.rates_by_actions.map((i, index) => i.received),
                    },
                ]}
                width={500}
                height={300}
            />
        </Stack>
    </>
}


function UserPage() {
    const [user, setUser] = React.useState<User | undefined>(undefined);
    const [user_history, setUser_history] = React.useState<UserHistory | undefined>(undefined);
    let url = window.location.search;
    let user_id = url.split("=")[1];
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const labelId = user && `checkbox-list-secondary-label-${user.name}`;


    // const {profile, friends, contracts, wallet} = useSelector((state: any) => state.filesReducer);

    useEffect(() => {
        (async () => {

            let user = Principal.fromText(user_id);
            let res: undefined | { Ok: UserProfile } | { Err: string } = actor && await actor.get_user_profile(user);
            if ("Ok" in res) {
                setUser(res.Ok)
                setUser_history(res.Ok)
            } else if ("Err" in res) {
                console.log(res.Err)
            }
        })()
    }, []);

    return <>
        {user_history && user && <>

            id: {String(user.id)}
            <FriendCom rate={user_history.users_rate} {...user} labelId={"labelId"}/>
            description: {user && user.description}
            <UserHistoryCom {...user_history}/>

        </>}
    </>;
}


export default UserPage