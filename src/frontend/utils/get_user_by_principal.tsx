import {useSelector} from "react-redux";
import {User} from "../../declarations/backend/backend.did";
import {useBackendContext} from "../contexts/BackendContext";

function useGetUser() {
    const { backendActor } = useBackendContext();
    const {profile, all_friends} = useSelector((state: any) => state.filesState);
    let users = all_friends && [...all_friends, profile];

    async function getUser(userId: string): Promise<User | null> {
        if (userId == "") {
            return null;
        }

        const friend = users && users.find((f) => f.id === userId);
        if (friend) {
            return friend;
        }
        let user: undefined | { Ok: User } | { Err: string } = await backendActor.get_user(userId.toString());
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
