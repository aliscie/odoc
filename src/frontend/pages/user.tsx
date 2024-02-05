import React, {useEffect} from "react";
import {actor} from "../App";
import {PaymentContract, RatingFE, User, UserHistoryFE} from "../../declarations/user_canister/user_canister.did";
import {Friend} from "./profile/friends";
import {Principal} from "@dfinity/principal";
import {Rating as RatingCom, Tooltip, Typography} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from '@mui/material/Typography';
import {useSelector} from "react-redux";
import WarningIcon from '@mui/icons-material/Warning';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {SparkLineChart} from '@mui/x-charts/SparkLineChart';
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

export function UserHistoryCom(profile: UserHistoryFE) {
    return <>
        <div>spent: {profile.spent} USDT</div>
        <div>USDT interactions : {profile.users_interactions} Users</div>
        <div>transactions : {profile.transactions_received} transactions</div>
        <div>payment cancellations : {profile.total_payments_cancellation} </div>
        <div>Received payments from shares : {profile.received_shares_payments}</div>
        {profile.latest_payments_cancellation.map((contract: PaymentContract) => {
            return <PaymentContractComponent {...contract} />
        })}

        {profile.rates_by_others.map((rate: RatingFE) => {
            return <ListItemText
                primary={<RatingCom readOnly defaultValue={Number(rate.rating)}/>}
                secondary={(rate.user.id == profile.id ? "You" : rate.user.name) + ": " + rate.comment}
            />
        })}
        {/*TODO in the profile you already have a section for that so prevent duplication*/}
        {profile.latest_payments_cancellation.map((p: PaymentContract) => {
            return <>
                {p.amount}
                {p.objected.length > 0 && <Tooltip
                    title={p.objected[0]}
                >
                    <WarningIcon color={"error"}/>
                </Tooltip>}
                {/*{p.date}*/}
            </>
        })}

        <Stack direction="row" sx={{width: '100%'}}>
            <LineChart
                xAxis={[{data: [1, 2, 3, 5, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]}]}
                series={[
                    {
                        label: 'rating',
                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                    },
                    {
                        label: 'promise/spent',
                        data: [5, 4.5, 2, 3.5, 1.5, 5, 3.5, 1.5, 5],
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
            let res: undefined | { Ok: [User, UserHistoryFE] } | { Err: string } = actor && await actor.get_user_profile(user);
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
            <Friend rate={user_history.total_rate} {...user} labelId={labelId}/>
            description: {user && user.description}
            <UserHistoryCom {...user_history}/>

        </>}
    </>;
}


export default UserPage