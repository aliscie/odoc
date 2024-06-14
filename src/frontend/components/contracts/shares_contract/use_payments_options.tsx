// create a useState hook
import {ShareRequest} from "../../../../declarations/backend/backend.did";
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