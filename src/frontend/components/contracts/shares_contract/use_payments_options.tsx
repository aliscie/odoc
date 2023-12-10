// create a useState hook
import {useEffect, useState} from "react";
import {Share, ShareRequest} from "../../../../declarations/user_canister/user_canister.did";
import useGetUser from "../../../utils/get_user_by_principal";
import {useDispatch, useSelector} from "react-redux";

function usePaymentsOptions({setView, setData}) {
    let {getUser, getUserByName} = useGetUser();
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