import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useDispatch, useSelector } from "react-redux";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { CircularProgress, Rating, TextField, Tooltip, Typography, Button } from "@mui/material";
import Friends from "./friends";
import Deposit from "./actions/deposit";
import Withdraw from "./actions/withdraw";
import LoaderButton from "../../components/genral/loader_button";
import ContractsHistory from "./contractss_history";
import { convertToBlobLink, convertToBytes } from "../../data_processing/image_to_vec";
import { handleRedux } from "../../redux/main";
import BasicTabs from "./history";
import TransactionHistory from "./transaction_history";
import { actor } from "../../App";
import { UserHistoryCom } from "../user";
import { useEffect, useState } from "react";
import { User, UserProfile } from "../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import icpLedger from './icpLedgerServices';
import {useSnackbar} from "notistack";

export default function ProfileComponent() {
    const dispatch = useDispatch();
    const [user_history, setUserHistory] = React.useState<UserHistoryCom | null>(null);
    const { profile, friends, profile_history, wallet } = useSelector((state: any) => state.filesReducer);
    const [profileData, setProfileData] = React.useState(profile || {});
    
    const {enqueueSnackbar} = useSnackbar();
    const [icpBalance, setIcpBalance] = useState<number>(0); // State for ICP balance
    const [toPrincipalId, setToPrincipalId] = useState<string>(''); // State for Principal ID input
    const [transferAmount, setTransferAmount] = useState<number>(0); // State for transfer amount

    useEffect(() => {
        const init = async () => {
            await icpLedger.init();
            const balance = await icpLedger.getBalance(profile.id);
            setIcpBalance(balance);
        }
        init();
    }, []);

    // console.log({y:profile_history.actions_rate,x: profile_history.users_rate});
    // useEffect(() => {
    //     (async () => {
    //         let res: undefined | { Ok: UserProfile } | { Err: string } = actor && await actor.get_user_profile(Principal.fromText(profile.id));
    //         if ("Ok" in res) {
    //             setUserHistory(res.Ok)
    //         }
    //         if (!profile_history) {
    //             let x: undefined | { Ok: UserProfile } | { Err: string } = actor && await actor.get_user_profile(Principal.fromText(profile.id))
    //             "Ok" in x && dispatch(handleRedux('CURRENT_USER_HISTORY', {profile_history: x.Ok}));
    //         }
    //
    //     })()
    // }, [profile]);
    const handleSaveChanges = async () => {
        if (profileData.changed) {
            const res = await actor.update_user_profile({
                name: [profileData.name],
                description: [profileData.description],
                photo: [profileData.photo],
            });
            setProfileData((pre: any) => {
                return { ...pre, changed: false }
            })
            return res;
        } else {
            return { Err: "No changes to save" }
        }
    };

    const handlePhotoChange = async (e) => {
        let photo = await convertToBytes(e.target.files[0]);
        setProfileData((pre: any) => {
            return { ...pre, photo, changed: true }
        })

        dispatch(handleRedux("UPDATE_PROFILE", { profile: { photo } }))

    };

    const handleIcpTransfer = async () => {
        if(toPrincipalId === '') {
            enqueueSnackbar("Please enter Principal Id", {variant: "error"});
            return;
        }
        let pid: Principal;
        //check for valid principal id
        try{
            pid=Principal.fromText(toPrincipalId);
        }catch(e){
            enqueueSnackbar("Invalid Principal Id ", {variant: "error"});
            return;
        }

        try{
            const res = await icpLedger.transferIcp(pid, transferAmount);
        }
        catch(e) {
            enqueueSnackbar("Error: " + e, {variant: "error"});
            return;
        }
        enqueueSnackbar("ICP Transfered Successfully", {variant: "success"});
    };

    return (
        <Box sx={{ width: '80%' }}>
            {profile && (
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar
                                alt="Profile Photo"
                                src={convertToBlobLink(profileData.photo)}
                                sx={{ width: 128, height: 128, marginRight: 1 }}
                            />
                        </ListItemAvatar>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    </ListItem>
                    <ListItem>
                        {profile_history &&
                            <Tooltip arrow title={"Your actions rate"}>
                                <Rating readOnly name="half-rating" defaultValue={profile_history.actions_rate}
                                    precision={0.5} /></Tooltip>}
                    </ListItem>
                    <ListItem>
                        {profile_history &&
                            <Tooltip arrow title={"Your users rate"}>
                                <Rating readOnly name="half-rating" defaultValue={profile_history.users_rate}
                                    precision={0.5} /></Tooltip>}
                    </ListItem>

                    <ListItem style={{ display: "flex" }}>
                        <Typography>
                            {Number(wallet ? wallet.balance : 0)} USDT
                        </Typography>

                        <Deposit />
                        <Withdraw />

                    </ListItem>

                    {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {/* ICP Transfer Section */}
                    <ListItem style={{ display: "flex", flexDirection: "column" }}>
                        <Typography>
                            {icpBalance} ICP
                        </Typography>
                        <ListItem>
                            <TextField
                                label="Principal ID"
                                value={toPrincipalId}
                                onChange={(e) => setToPrincipalId(e.target.value)}
                                fullWidth
                                variant="standard"
                            />
                        </ListItem>
                        <ListItem>
                            <TextField
                                label="Amount"
                                type="number"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(Number(e.target.value))}
                                fullWidth
                                variant="standard"
                            />
                        </ListItem>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleIcpTransfer}
                            sx={{ mt: 2 }}
                        >
                            Transfer ICP
                        </Button>
                    </ListItem>

                    {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {Object.entries(profileData).map(([key, value]) => {
                        if (['photo', 'changed'].includes(key)) {
                            return null; // Skip rendering the photo field again
                        }

                        return (
                            <ListItem key={key}>
                                <TextField
                                    disabled={key === 'id'}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={value}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        [key]: e.target.value,
                                        changed: true
                                    })}
                                    fullWidth
                                    variant="standard"
                                    InputLabelProps={{
                                        style: {},
                                    }}
                                    InputProps={{
                                        style: {},
                                    }}
                                />
                            </ListItem>
                        );
                    })}
                    {profileData.changed && <ListItem>
                        <LoaderButton
                            color={'success'}
                            successMessage={"Profile saved"} onClick={handleSaveChanges}>
                            Save changes</LoaderButton>
                    </ListItem>}
                </List>
            )}

            {wallet && <BasicTabs
                items={{
                    "Friends": <Friends friends={friends} />,
                    "Contracts": <ContractsHistory />,
                    "Transactions": <TransactionHistory items={wallet.exchanges} />,
                    "Reputation": user_history && <UserHistoryCom {...user_history} />,
                }}
            />}
        </Box>
    );
}
