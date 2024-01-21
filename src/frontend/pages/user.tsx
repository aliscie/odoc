import {useSnackbar} from "notistack";
import React, {useEffect} from "react";
import {actor} from "../App";
import {User} from "../../declarations/user_canister/user_canister.did";
import {Friend} from "./profile/friends";
import {useSelector} from "react-redux";


function UserPage() {
    const [user, setUser] = React.useState<User | undefined>(undefined);

    let url = window.location.search;
    let user_id = url.split("=")[1];
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const labelId = user && `checkbox-list-secondary-label-${user.name}`;


    const {profile, friends, contracts, wallet} = useSelector((state: any) => state.filesReducer);

    useEffect(() => {
        (async () => {
            let res: undefined | { Ok: User } | { Err: string } = actor && await actor.get_user(user_id);
            if ("Ok" in res) {
                setUser(res.Ok)
            } else if ("Err" in res) {
                console.log(res.Err)
            }

        })()
    }, []);

    return <>
        {/*<IconButton aria-label="add to favorites">*/}
        {/*    <FavoriteIcon/>*/}
        {/*</IconButton>*/}
        {/*<IconButton aria-label="share">*/}
        {/*    <ShareIcon/>*/}
        {/*</IconButton>*/}
        id: {user && user.id}
        <Friend {...user} labelId={labelId}/>
        description: {user && user.description}
        <div>spent: 3000 USDT</div>
        <div>USDT interactions : 40 Users</div>
        <div>USDT transactions : 63 transactions</div>
        <div>payment cancellations : 5</div>
        <div>shares : 5</div>
        <div>shares changes: 1</div>
        <div>custom contracts : 5</div>
        <div>custom contracts changes : 1</div>
    </>;
}


export default UserPage