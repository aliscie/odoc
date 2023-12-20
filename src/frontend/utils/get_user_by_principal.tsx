import {useSelector} from "react-redux";
import {User} from "../../declarations/user_canister/user_canister.did";
import {actor} from "../App";

function useGetUser() {
    const {profile, all_friends} = useSelector((state: any) => state.filesReducer);
    // console.log({all_friends})
    let users = all_friends && [...all_friends, profile];

    async function getUser(userId: string): Promise<User | null> {
        if (userId == "") {
            return null;
        }

        const friend = users && users.find((f) => f.id === userId);
        if (friend) {
            return friend;
        }
        let user: undefined | { Ok: User } | { Err: string } = actor && await actor.get_user(userId.toString());
        if ('Ok' in user) {
            // TODO save this user somewhere in order to prevent calling unnecessary queries again and again.
            return user.Ok;
        } else {
            console.error(`//------------ getUser Error: ${user.Err} ------------\\`);
            return null;
        }

    }

    // make a function that get return the user principal by getting name as input
    function getUserByName(name: string): User | null {
        return users.find((f) => f.name == name)
    }

    return {getUser, getUserByName}
}

export default useGetUser;