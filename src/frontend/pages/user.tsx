import React, {useEffect} from "react";
import {actor} from "../App";
import {PaymentContract, Rating, RatingFE, User, UserHistory} from "../../declarations/user_canister/user_canister.did";
import {Friend} from "./profile/friends";
import {Principal} from "@dfinity/principal";
import {Rating as RatingCom, Tooltip, Typography} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from '@mui/material/Typography';
import {useSelector} from "react-redux";
import WarningIcon from '@mui/icons-material/Warning';
import Stack from "@mui/material/Stack";
import {LineChart} from "@mui/x-charts/LineChart";

export function PaymentContractComponent(contract: PaymentContract) {
    const {profile} = useSelector((state: any) => state.filesReducer);

    return <ListItem alignItems="flex-start">
        {/*{contract.contract_id}*/}
        <ListItemText
            primary={contract.amount}
            secondary={
                <React.Fragment>
                    <Typography
                        sx={{display: 'inline'}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        {contract.confirmed ? "confirmed" : "not confirmed"}
                    </Typography>
                    Receiver: {profile.id == contract.receiver.toString() ? "You" : "Other"}
                </React.Fragment>
            }
        />
    </ListItem>
}

export function UserHistoryCom(profile: UserHistory) {
    let actions_len = profile.rates_by_actions.length;
    // const series =
    return <>
        <div>spent: {profile.spent} USDT</div>
        <div>USDT interactions : {profile.users_interacted} Users</div>
        <div>dept : {profile.total_debt} dept</div>
        {/*<div>rate : {profile.users_rate} rate</div>*/}

        {/*<div>payment cancellations : {profile.total_payments_cancellation} </div>*/}
        {/*<div>Received payments from shares : {profile.received_shares_payments}</div>*/}
        {/*{profile.latest_payments_cancellation.map((contract: PaymentContract) => {*/}
        {/*    return <PaymentContractComponent {...contract} />*/}
        {/*})}*/}

        {profile.rates_by_others.map((rate: Rating) => {
            return <ListItemText
                primary={<RatingCom readOnly defaultValue={Number(rate.rating)}/>}
                // secondary={(rate.user.id == profile.id ? "You" : rate.user.name) + ": " + rate.comment}
                secondary={rate.comment}
            />
        })}


        <Stack direction="row" sx={{width: '100%'}}>
            <LineChart
                xAxis={[{data: profile.rates_by_actions.map((i, index) => index)}]}
                series={[
                    {
                        label: 'rating',
                        data: profile.rates_by_actions.map((i, index) => i.rating),
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
        {/*<div>Accepted shares changes:  {profile.shares_changes_accepts}</div>*/}
        {/*<div>Rejected shares changes:  {profile.shares_changes_rejects}</div>*/}
        {/*<div>custom contracts : 5</div>*/}
        {/*<div>custom contracts changes : 1</div>*/}
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
            let res: undefined | { Ok: [User, UserHistory] } | { Err: string } = actor && await actor.get_user_profile(user);
            if ("Ok" in res) {
                setUser(res.Ok[0])
                setUser_history(res.Ok[1])
            } else if ("Err" in res) {
                console.log(res.Err)
            }
        })()
    }, []);

    return <>
        {user_history && user && <>

            id: {user.id}
            <Friend rate={user_history.users_rate} {...user} labelId={labelId}/>
            description: {user && user.description}
            <UserHistoryCom {...user_history}/>

        </>}
    </>;
}


export default UserPage