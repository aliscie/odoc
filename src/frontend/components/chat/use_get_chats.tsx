import {actor} from "../../App";
import {handleRedux} from "../../redux/main";
import {useDispatch, useSelector} from "react-redux";
import {Principal} from "@dfinity/principal";
import {Chat, FEChat} from "../../../declarations/user_canister/user_canister.did";

function useGetChats() {
    const {profile} = useSelector((state: any) => state.filesReducer);
    const {chats} = useSelector((state: any) => state.chatsReducer);

    const dispatch = useDispatch();


    function getPrivateChat(user: Principal): Chat | undefined {
        return (
            user &&
            chats &&
            chats.length > 0 &&
            chats.find((chat: Chat) => chat.admins[0].toString() === user.toString()))
            ;
    }

    let getChats = async () => {
        if (!chats || chats.length === 0) {
            let res: undefined | Array<FEChat> = actor && await actor.get_my_chats();
            res && dispatch(handleRedux("SET_CHATS", {chats: res}));
            return res
        } else {
            return chats
        }

    }


    let getOther = (chat: FEChat) => {
        if (chat.creator.id.toString() === profile.id) {
            return chat.admins[0]
        } else {
            return chat.creator
        }
    }


    return {getChats, getPrivateChat, getOther}

}

export default useGetChats