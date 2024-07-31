import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@mui/material/Avatar';
import {
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    IconButton,
    Rating,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import Friends from "./friends";
import Deposit from "./actions/deposit";
import Withdraw from "./actions/withdraw";
import LoaderButton from "../../components/genral/loader_button";
import { convertToBlobLink, convertToBytes } from "../../data_processing/image_to_vec";
import { handleRedux } from "../../redux/main";
import BasicTabs from "./history";
import TransactionHistory from "./transaction_history";
import { actor } from "../../App";
import { UserHistoryCom } from "../user";
import { Button } from "@mui/material";
import { useSnackbar } from 'notistack';
import ShareProfileButton from './actions/share_profile-button';
import ProfilePhotoDialog from './actions/profile_photo_dialog';

export default function ProfileComponent() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { profile, friends, profile_history, wallet } = useSelector((state: any) => state.filesReducer);

    const [user_history, setUserHistory] = React.useState<UserHistoryCom | null>(null);
    const [profileData, setProfileData] = React.useState({
        id: profile?.id || '',
        name: profile?.name || '',
        description: profile?.description || '',
        photo: profile?.photo || '',
        changed: false,
    });

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

    //     })()
    // }, [profile]);

    const [openDialog, setOpenDialog] = useState(false);

    const handleSaveChanges = async () => {
        if (profileData.changed) {
            try {
                const res = await actor?.update_user_profile({
                    name: [profileData.name],
                    description: [profileData.description],
                    photo: [profileData.photo],
                });
                setProfileData((pre: any) => ({
                    ...pre, changed: false
                }));
                return res;
            } catch (error) {
                console.log("There was an issue with saving profile update: ", error);
            }
        } else {
            return { Err: "No changes to save" }
        }
    };

    const handlePhotoChange = async (e) => {
        const fileInput = e.target;
        let photo = await convertToBytes(fileInput.files[0]);
        setProfileData((prev) => ({ ...prev, photo, changed: true }));

        dispatch(handleRedux("UPDATE_PROFILE", { profile: { photo } }));

        fileInput.value = '';
    };

    const handleAvatarClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
                        <CardContent>
                            <Typography variant="h4" align="center" gutterBottom>
                                Profile
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                        <input
                                            type="file"
                                            id="photo"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            style={{ display: 'none' }}
                                        />
                                        <IconButton component="span" onClick={(e) => e.stopPropagation()}>
                                            <Avatar
                                                alt="Profile Photo"
                                                src={convertToBlobLink(profileData.photo)}
                                                sx={{ width: 128, height: 128, mb: 2 }}
                                                onClick={handleAvatarClick}
                                            />
                                        </IconButton>
                                        <IconButton
                                            aria-label="edit"
                                            component="span"
                                            sx={{
                                                position: 'absolute',
                                                bottom: 20,
                                                right: 300,
                                                backgroundColor: 'white',
                                                borderRadius: '50%',
                                                '&:hover': {
                                                    backgroundColor: 'secondary.light',
                                                },
                                            }}
                                            onClick={() => document.getElementById('photo')?.click()}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1, mt: 2}}>
                                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                                            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Success Rating
                                                </Typography>
                                                {profile_history && (
                                                    <Tooltip arrow title={'Your actions rate'}>
                                                        <Rating
                                                            readOnly
                                                            name="half-rating"
                                                            defaultValue={profile_history.actions_rate}
                                                            precision={0.5}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                                                <ShareProfileButton profileName={profileData.name} profileId={profileData.id} />
                                            </Grid>
                                            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Community Rating
                                                </Typography>
                                                {profile_history && (
                                                    <Tooltip arrow title={'Your users rate'}>
                                                        <Rating
                                                            readOnly
                                                            name="half-rating"
                                                            defaultValue={profile_history.users_rate}
                                                            precision={0.5}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                <List>
                                    {Object.entries(profileData).map(([key, value]) => {
                                        if (['photo', 'changed'].includes(key)) {
                                            return null;
                                        }
                                        return (
                                            <ListItem key={key}>
                                                <TextField
                                                    disabled={key === 'id'}
                                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                                    value={value}
                                                    onChange={(e) =>
                                                        setProfileData({
                                                            ...profileData,
                                                            [key]: e.target.value,
                                                            changed: true,
                                                        })
                                                    }
                                                    fullWidth
                                                    multiline={key === 'description'}
                                                    rows={key === 'description' ? 4 : 1}
                                                    variant="outlined"
                                                    InputLabelProps={{ style: { fontWeight: 'bold' } }}
                                                    InputProps={{ style: { borderRadius: 8 } }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                {profileData.changed && (
                                    <Box sx={{ width: '100%', mt: 2 }}>
                                        <LoaderButton
                                            color="primary"
                                            successMessage="Profile saved"
                                            onClick={handleSaveChanges}
                                            variant="contained"
                                            sx={{  width: '100% !important' }} 
                                        >
                                            Save changes
                                        </LoaderButton>
                                    </Box>
                                )}

                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
                        <CardContent>
                            <Typography variant="h5" align="center" gutterBottom>
                                Wallet
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" align="center" gutterBottom>
                                {Number(wallet ? wallet.balance : 0)} USDC
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Deposit />
                                <Box sx={{ mx: 1 }} />
                                <Withdraw />
                            </Box>
                        </CardContent>
                    </Card>
                    <Divider sx={{ my: 4 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <BasicTabs
                            items={{
                                Friends: <Friends friends={friends} />,
                                Reputation: user_history && <UserHistoryCom {...user_history} />,
                                ...(wallet && { Transactions: <TransactionHistory items={wallet.exchanges} /> }),
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
            <ProfilePhotoDialog
                open={openDialog}
                onClose={handleDialogClose}
                imageSrc={convertToBlobLink(profileData.photo)}
            />
        </Container>
    );
}
