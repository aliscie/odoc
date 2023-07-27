import {useSelector} from "react-redux";

function useGetUser() {
    const {profile, all_friends} = useSelector((state: any) => state.filesReducer);

    function getUser(userId: string) {
        if (userId.toString() === profile.id.toString()) {
            return profile.name;
        } else {
            const friend = all_friends.find((f) => f.id == userId.toString())
            return friend ? friend.name : null;
        }
    }

    return {getUser}
}

export default useGetUser;