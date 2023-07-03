import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {useSelector} from "react-redux";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {Button, Rating, TextField, Tooltip, Typography} from "@mui/material";
import {actor} from "../../backend_connect/ic_agent";
import {LoadingButton} from "../../components/genral/load_buttton";
import {useSnackbar} from "notistack";
import Friends from "./friends";
import TransactionsHistory from "./transactions_history";

export function convertToBlobLink(imageData) {
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
        new Blob([imageContent.buffer], {type: "image/png"})
    );
    return image;
}


export default function ProfileComponent() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {profile, friends, contracts} = useSelector((state: any) => state.filesReducer);
    // const dispatch = useDispatch();
    const [profileData, setProfileData] = React.useState(profile || {});

    const handleSaveChanges = async () => {

        const res = await actor.update_user_profile({
            name: [profileData.name],
            description: [profileData.description],
            photo: [profileData.photo],
        });

        // console.log({profileData, res});
        if (res.Ok) {
            enqueueSnackbar("Profile updated successfully", {variant: "success"});
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        // const reader = new FileReader();
        // reader.onload = (event) => {
        //     setProfileData({...profileData, photo: event.target.result});
        // };
        // reader.readAsDataURL(file);
    };

    return (
        <Box sx={{bgcolor: 'var(--background)', color: 'var(--color)', width: '80%'}}>
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
                        <Typography style={{color: "var(--money-color)"}}>
                            1000 ICPs
                        </Typography>
                        <Button>Deposit</Button>
                    </ListItem>

                    {Object.entries(profileData).map(([key, value]) => {
                        if (key === 'photo') {
                            return null; // Skip rendering the photo field again
                        }
                        return (
                            <ListItem key={key}>
                                <TextField
                                    disabled={key === 'id'}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={value}
                                    onChange={(e) => setProfileData({...profileData, [key]: e.target.value})}
                                    fullWidth
                                    variant="standard"
                                    InputLabelProps={{
                                        style: {color: 'var(--secondary-text-color)'},
                                    }}
                                    InputProps={{
                                        style: {color: "var(--color)"},
                                    }}
                                />
                            </ListItem>
                        );
                    })}
                    <ListItem>
                        <LoadingButton onClick={handleSaveChanges} name={"Save changes"}/>
                    </ListItem>
                </List>
            )}
            {friends[0] && <Friends friends={friends}/>}
            {Object.keys(contracts).length > 0 && <TransactionsHistory contracts={contracts}/>}
        </Box>
    );
}
