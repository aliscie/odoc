import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {useDispatch, useSelector} from "react-redux";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {Rating, TextField, Tooltip, Typography} from "@mui/material";
import Friends from "./friends";
import Deposit from "./actions/deposit";
import Withdraw from "./actions/withdraw";
import LoaderButton from "../../components/genral/loader_button";
import ContractsHistory from "./contractss_history";
import {convertToBlobLink, convertToBytes} from "../../data_processing/image_to_vec";
import {handleRedux} from "../../redux/main";
import BasicTabs from "./history";
import TransactionHistory from "./transaction_history";
import {actor} from "../../App";
import {UserHistoryCom} from "../user";
import {useEffect} from "react";
import {User, UserHistoryFE} from "../../../declarations/user_canister/user_canister.did";
import {Principal} from "@dfinity/principal";


export default function ProfileComponent() {


    const dispatch = useDispatch();
    const {profile, friends, contracts, wallet} = useSelector((state: any) => state.filesReducer);

    const [user_history, setUserHistory] = React.useState<UserHistoryCom | null>(null);
    const [profileData, setProfileData] = React.useState(profile || {});
    useEffect(() => {
        (async () => {
            let res: undefined | { Ok: [User, UserHistoryFE] } | { Err: string } = actor && await actor.get_user_profile(Principal.fromText(profile.id));
            if ("Ok" in res) {
                setUserHistory(res.Ok[1])
            }

        })()
    }, [profile]);
    const handleSaveChanges = async () => {
        if (profileData.changed) {
            const res = await actor.update_user_profile({
                name: [profileData.name],
                description: [profileData.description],
                photo: [profileData.photo],
            });
            setProfileData((pre: any) => {
                return {...pre, changed: false}
            })
            return res;
        } else {
            return {Err: "No changes to save"}
        }
    };

    const handlePhotoChange = async (e) => {
        let photo = await convertToBytes(e.target.files[0]);
        setProfileData((pre: any) => {
            return {...pre, photo, changed: true}
        })

        dispatch(handleRedux("UPDATE_PROFILE", {profile: {photo}}))

    };


    return (
        <Box sx={{width: '80%'}}>
            {profile && (
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar
                                alt="Profile Photo"
                                src={convertToBlobLink(profileData.photo)}
                                sx={{width: 128, height: 128, marginRight: 1}}
                            />
                        </ListItemAvatar>
                        <input type="file" accept="image/*" onChange={handlePhotoChange}/>
                    </ListItem>
                    <ListItem>
                        <Tooltip arrow title={"Your trust score"}>
                            <Rating readOnly name="half-rating" defaultValue={2.5} precision={0.5}/>
                        </Tooltip>
                    </ListItem>

                    <ListItem style={{display: "flex"}}>
                        <Typography>
                            {Number(wallet.balance)} USDT
                        </Typography>

                        <Deposit/>
                        <Withdraw/>

                    </ListItem>

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
                    "Friends": <Friends friends={friends}/>,
                    "Contracts": <ContractsHistory/>,
                    "Transactions": <TransactionHistory items={wallet.exchanges}/>,
                    "Reputation": user_history && <UserHistoryCom {...user_history}/>,
                }}
            />}
        </Box>
    );
}
