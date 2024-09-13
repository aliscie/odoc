import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../contexts/BackendContext";
import { Principal } from "@dfinity/principal";
import { handleRedux } from "../store/handleRedux";

const useInitialData = () => {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const { profile } = useSelector((state: any) => state.filesState);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await backendActor.get_initial_data();
        if ("Err" in res && res.Err == "Anonymous user.") {
          dispatch(handleRedux("IS_REGISTERED", { isRegistered: false }));
        } else {
          const getProfileRes = await backendActor.get_user_profile(
            Principal.fromText(res.Ok.Profile.id),
          );
          dispatch(
            handleRedux("INIT_FILES_STATE", {
              data: { ...res.Ok, ProfileHistory: getProfileRes.Ok },
            }),
          );
        }
      } catch (error) {
        console.log("Issue fetching initial data from backend: ", error);
        // dispatch(filesActions.errorAction(error));
      }
    };

    if (backendActor && !profile) {
      fetchInitialData();
    }
  }, [backendActor]);

  return {};
};

export default useInitialData;
