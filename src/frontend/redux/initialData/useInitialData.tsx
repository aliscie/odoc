import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../contexts/BackendContext";
import { Principal } from "@dfinity/principal";
import { handleRedux } from "../store/handleRedux";

const useInitialData = () => {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const { profile } = useSelector((state: any) => state.filesState);
  const { isLoggedIn } = useSelector((state: any) => state.uiState);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const fetchInitialData = async () => {
      try {
        dispatch(handleRedux("IS_FETCHING", { isFetching: true }));
        const res = await backendActor.get_initial_data();
        const workspaces = await backendActor.get_work_spaces();
        if ("Err" in res && res.Err == "Anonymous user.") {
          dispatch(handleRedux("IS_REGISTERED", { isRegistered: false }));
        } else {
          dispatch(handleRedux("IS_REGISTERED", { isRegistered: true }));
          // console.log("why sometimes this call 3 times ");
          const getProfileRes = await backendActor.get_user_profile(
            Principal.fromText(res.Ok.Profile.id),
          );
          // console.log({ getProfileRes });
          dispatch(
            handleRedux("INIT_FILES_STATE", {
              data: { ...res.Ok, ProfileHistory: getProfileRes.Ok, workspaces },
            }),
          );
        }
      } catch (error) {
        console.log("Issue fetching initial data from backend: ", error);
        // dispatch(filesActions.errorAction(error));
      }
      dispatch(handleRedux("IS_FETCHING", { isFetching: false }));
    };
    if (backendActor && !profile) {
      fetchInitialData();
    }
  }, [backendActor, isLoggedIn]);

  return {};
};

export default useInitialData;
