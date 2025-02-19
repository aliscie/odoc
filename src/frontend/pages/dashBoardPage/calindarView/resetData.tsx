import React, { useCallback } from "react";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import { Grid, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../../contexts/BackendContext";
import {RootState} from "../../../redux/reducers";

function ResetCalendarData() {
  const { calendarChanged, calendar, calendar_actions } = useSelector(
    (state: RootState) => state.calendarState,
  );

  const dispatch = useDispatch();
  const theme = useTheme();
  const { backendActor } = useBackendContext();

  const handleReset = useCallback(async () => {
    const res = await backendActor.get_my_calendar();
    dispatch({
      type: "SET_CALENDAR",
      calendar: res,
    });
    return { Ok: "" };
  }, []);

  return (
    <LoaderButton
      disabled={!calendarChanged}
      onClick={handleReset}
    >
      Reset
    </LoaderButton>
  );
}
export default ResetCalendarData;
