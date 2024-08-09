import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useBackendContext } from "../../contexts/BackendContext";
import * as filesActions from "../actions/filesAction";

const InitialDataFetcher = () => {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const [data, setData] = useState<any>();
  const [profileHistory, setProfileHistory] = useState<any | { Ok: UserProfile } | { Err: string }>();
  const [workspaces, setWorkspaces] = useState<Array<WorkSpace> | undefined>();
  const [notifications, setNotifications] = useState<Notification>();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (backendActor) {
        try {
          const res = await backendActor.get_initial_data();
          setData(res);
        } catch (error) {
          console.log("Issue fetching initial data from backend: ", error);
          dispatch(filesActions.errorAction(error));
        }
      }
    };
    fetchInitialData();
  }, [backendActor, dispatch]);

  useEffect(() => {
    if (data && "Ok" in data) {
      dispatch(filesActions.updateProfile(data.Ok.Profile));
      dispatch(filesActions.addFile(data.Ok.Files));
      dispatch(filesActions.filesSaved(normalizeFilesContents(data.Ok.FilesContents[0])));
      dispatch(filesActions.addContract(normalizeContracts(data.Ok.Contracts)));
      dispatch(filesActions.addWorkspace(data.Ok.Workspaces));
      dispatch(filesActions.confirmFriend(data.Ok.Friends));
      dispatch(filesActions.updateAllFriends(data.Ok.Friends.map((f: Friend) => {
        return f.sender.id != data.Ok.Profile.id ? f.sender : f.receiver
      })));
      dispatch(filesActions.updateBalance(data.Ok.Wallet));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const fetchProfileHistory = async () => {
      if (backendActor) {
        try {
          const res = await backendActor.get_user_profile(Principal.fromText(data.Ok.Profile.id))
          setProfileHistory(res);
          dispatch(filesActions.setCurrentUserHistory(res));
        } catch(error) {
          console.log("Issue with fetching profileHistory: ", error);
        };
      }
    };
    fetchProfileHistory();
  }, [backendActor, data, dispatch]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (backendActor) {
        try {
          const workspaces = await backendActor.get_work_spaces();
          setWorkspaces(workspaces);
          dispatch(filesActions.addWorkspace(workspaces));
        } catch(error) {
          console.log("Issue fetching workspaces: ", error); 
        };
      }
    };
    fetchWorkspaces();
  }, [backendActor, dispatch]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (backendActor) {
        try {
          const notifications = await backendActor.get_user_notifications()
          setNotifications(notifications);
          dispatch(filesActions.updateNotificationList(notifications));
        } catch (error) {
          console.log("Issue fethcing notifications");
        }
      }
    };
    fetchNotifications();
  }, [backendActor, dispatch]);

  return null;
};

export default InitialDataFetcher;