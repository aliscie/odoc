import {actor} from "../../App";
import {handleRedux} from "../../redux/main";
import {useDispatch, useSelector} from "react-redux";

function useGetChats() {
    const {current_chat_id, current_user, chats} = useSelector((state: any) => state.chatsReducer);
    const dispatch = useDispatch();

    let getChats = async () => {
        if (!chats || chats.length === 0) {
            let res = actor && await actor.get_my_chats();
            res && dispatch(handleRedux("SET_CHATS", {chats: res}));
            return res
        }

    }

    return {getChats}

}

export default useGetChats