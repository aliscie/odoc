import React, { useCallback } from "react";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import { Grid, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../../contexts/BackendContext";
import {RootState} from "../../../redux/reducers";
import {AvailabilityTimezone, EventTimezone} from "./serializers";

function ResetCalendarData() {
  const { calendarChanged, calendar, calendar_actions } = useSelector(
    (state: RootState) => state.calendarState,
  );

  const dispatch = useDispatch();
  const theme = useTheme();
  const { backendActor } = useBackendContext();

  const handleReset = useCallback(async () => {
    let res = await backendActor.get_calendar(calendar?.id);
    res.events = res.events.map((event) => EventTimezone(event));
    res.availabilities = res.availabilities.map((event) => AvailabilityTimezone(event));
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
