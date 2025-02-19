import React, { useCallback, useEffect } from "react";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import { Grid, useTheme, styled, keyframes } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../../contexts/BackendContext";
import { RootState } from "../../../redux/reducers";
import { useSnackbar } from "notistack";

// Define keyframes for the shake and scale animation
const shakeAndScaleAnimation = keyframes`
  0% { transform: translateX(0) scale(1); }
  10% { transform: translateX(-5px) scale(1.3); }
  20% { transform: translateX(5px) scale(1.3); }
  30% { transform: translateX(-5px) scale(1.3); }
  40% { transform: translateX(5px) scale(1.3); }
  50% { transform: translateX(-5px) scale(1.3); }
  60% { transform: translateX(5px) scale(1.3); }
  70% { transform: translateX(-5px) scale(1.3); }
  80% { transform: translateX(5px) scale(1.3); }
  90% { transform: translateX(-5px) scale(1.3); }
  100% { transform: translateX(0) scale(1); }
`;

// Styled component for the animated button wrapper
const AnimatedButtonWrapper = styled('div')`
  display: inline-block;
  &.shake {
    animation: ${shakeAndScaleAnimation} 1.2s cubic-bezier(0.36, 0, 0.66, -0.56);
    animation-fill-mode: forwards;
  }
`;

function SaveCalendarData() {
  const { enqueueSnackbar } = useSnackbar();
  const { calendarChanged, calendar, calendar_actions } = useSelector(
    (state: RootState) => state.calendarState,
  );

  const dispatch = useDispatch();
  const theme = useTheme();
  const { backendActor } = useBackendContext();

  // Handle browser/tab close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (calendarChanged) {
        // Show browser's default confirmation dialog
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";

        // Trigger shake and scale animation on the save button
        const buttonWrapper = document.querySelector('.save-button-wrapper');
        if (buttonWrapper) {
          buttonWrapper.classList.remove('shake');
          void buttonWrapper.offsetWidth; // Trigger reflow
          buttonWrapper.classList.add('shake');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [calendarChanged]);

  const handleSave = useCallback(async () => {
    if (!backendActor || !calendar) return;

    try {
      const res = await backendActor.update_calendar(calendar_actions);
      dispatch({
        type: "SET_CALENDAR_CHANGED",
        calendarChanged: false,
      });

      if (res?.Err) {
        enqueueSnackbar(res.Err, { variant: "error" });
      } else {
        enqueueSnackbar("Calendar saved successfully", { variant: "success" });
      }
      return { Ok: "" };
    } catch (err) {
      console.log({ err });
      const errorMessage = err instanceof Error ? err.message : "Failed to save calendar";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    return { Ok: "" };
  }, [backendActor, calendar, calendar_actions, dispatch, enqueueSnackbar]);

  return (
    <AnimatedButtonWrapper className="save-button-wrapper">
      <LoaderButton
        disabled={!calendarChanged}
        onClick={handleSave}
        sx={{
          transition: 'transform 0.3s ease-in-out',
          '&:not(:disabled):hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        Save
      </LoaderButton>
    </AnimatedButtonWrapper>
  );
}

export default SaveCalendarData;
