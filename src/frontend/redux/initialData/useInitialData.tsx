import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useBackendContext} from "../../contexts/BackendContext";
import {Principal} from "@dfinity/principal";
import {handleRedux} from "../store/handleRedux";

const fetchInitialData = async (backendActor) => {

    try {
        const res = await backendActor.get_initial_data();
        if ('Err' in res && res.Err == 'Anonymous user.') {
            return {isRegistered: false}
            // dispatch(handleRedux("IS_REGISTERED", {isRegistered: false}));
        } else {

            const getProfileRes = await backendActor.get_user_profile(Principal.fromText(res.Ok.Profile.id))
            return {data: {...res.Ok, ProfileHistory: getProfileRes.Ok}};
            // dispatch(handleRedux("INIT_FILES_STATE",{data: {...res.Ok, ProfileHistory: getProfileRes.Ok}}))
        }

    } catch (error) {
        console.log("Issue fetching initial data from backend: ", error);
        // dispatch(filesActions.errorAction(error));
    }
}


const useInitialData = () => {
    const dispatch = useDispatch();
    const {backendActor} = useBackendContext();
    const {profile_history, profile} = useSelector((state: any) => state.filesState);

    useEffect(() => {
        if (backendActor && !profile) {
            let res = fetchInitialData(backendActor);
            res.then((res) => {
                    if (res.isRegistered == false) {
                        dispatch(handleRedux("IS_REGISTERED", res));
                    } else {
                        dispatch(handleRedux("INIT_FILES_STATE", res))
                    }
                }
            )

        }
    }, [backendActor]);

    // useEffect(() => {
    //
    //
    //     const fetchProfileHistory = async () => {
    //
    //         if (backendActor && profile && !profile_history) {
    //             try {
    //                 const res = await backendActor.get_user_profile(Principal.fromText(profile.id))
    //                 dispatch(handleRedux("CURRENT_USER_HISTORY", {profile_history: res.Ok}));
    //             } catch (error) {
    //                 console.log("Issue with fetching profileHistory: ", error);
    //             }
    //         }
    //     }
    //     fetchProfileHistory();
    //
    //     // if (data && "Ok" in data) {
    //     //     dispatch(handleRedux("INIT_FILES_STATE", {data: data}));
    //     //     // dispatch(filesActions.addWorkspace(data.Workspaces));
    //     // }
    //
    //
    //     // const fetchWorkspaces = async () => {
    //     //     if (backendActor) {
    //     //         try {
    //     //             // const workspaces = await backendActor.get_work_spaces();
    //     //             // setWorkspaces(workspaces);
    //     //             // dispatch(filesActions.addWorkspace(workspaces));
    //     //         } catch (error) {
    //     //             console.error("Issue fetching workspaces: ", error);
    //     //         }
    //     //         ;
    //     //     }
    //     // };
    //     // fetchWorkspaces();
    //
    //     // const fetchNotifications = async () => {
    //     //     if (backendActor) {
    //     //         try {
    //     //             const notifications = await backendActor.get_user_notifications()
    //     //             dispatch(handleRedux("UPDATE_NOT_LIST", {new_list: notifications}));
    //     //         } catch (error) {
    //     //             console.error("Issue fethcing notifications");
    //     //         }
    //     //     }
    //     // };
    //     // fetchNotifications();
    //

    // }, [profile]);


    return {}
};

export default useInitialData;
