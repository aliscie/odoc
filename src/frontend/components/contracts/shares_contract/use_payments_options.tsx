// create a useState hook
import {ShareRequest} from "../../../../declarations/user_canister/user_canister.did";
import {useSelector} from "react-redux";

function usePaymentsOptions({setView, setData}) {
    const {
        files_content,
        current_file,
        all_friends,
        profile,
        contracts
    } = useSelector((state: any) => state.filesReducer);

    let handleClickReq = (req: ShareRequest) => {
        setView(req.name)

    };
    return {handleClickReq};
}

export default usePaymentsOptions;