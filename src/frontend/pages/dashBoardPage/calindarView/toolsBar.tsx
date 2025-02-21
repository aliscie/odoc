import {
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CalendarManagement from "./AvailabilityComonent";
import React, { useState } from "react";
import CopyButton from "../../../components/MuiComponents/copyButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
import SaveCalendarData from "./saveData";
import ResetCalendarData from "./resetData";
import { MoreVert, NavigateBefore, NavigateNext } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import TimeZoneSelector from "./timezone";

const CustomToolbar = (toolbar) => {
  const { calendarChanged, calendar, calendar_actions } = useSelector(
    (state: RootState) => state.calendarState,
  );
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Menu states
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);

  const navigate = (action) => {
    toolbar.onNavigate(action);
    handleActionMenuClose();
  };

  const handleActionMenuClick = (event) => {
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleViewMenuClick = (event) => {
    setViewMenuAnchor(event.currentTarget);
  };

  const handleViewMenuClose = () => {
    setViewMenuAnchor(null);
  };

  const viewNames = toolbar.views;
  const view = toolbar.view;
  const currentPage = window.location.pathname;
  const isCalendarPage = currentPage === "/calendar";
  const copyLink = React.useMemo(() => {
    return `${window.location.href}calendar?id=${calendar?.id}`;
  }, [calendar?.id]);

  // Mobile/Tablet Action Menu
  const ActionMenu = () => (
    <Menu
      anchorEl={actionMenuAnchor}
      open={Boolean(actionMenuAnchor)}
      onClose={handleActionMenuClose}
    >
      <TimeZoneSelector />
      {!isCalendarPage && (
        <MenuItem>
          <CopyButton title="Share" value={copyLink} />
        </MenuItem>
      )}
      <MenuItem>
        <CalendarManagement />
      </MenuItem>
      <MenuItem>
        <ResetCalendarData />
      </MenuItem>
      {/*<MenuItem onClick={() => navigate("TODAY")}>*/}
      {/*  Today <TimeZoneSelector />*/}
      {/*</MenuItem>*/}
    </Menu>
  );

  // Mobile/Tablet View Menu
  const ViewMenu = () => (
    <Menu
      anchorEl={viewMenuAnchor}
      open={Boolean(viewMenuAnchor)}
      onClose={handleViewMenuClose}
    >
      {viewNames.map((name) => (
        <MenuItem
          key={name}
          onClick={() => {
            toolbar.onView(name);
            handleViewMenuClose();
          }}
          selected={view === name}
        >
          <Typography sx={{ ml: 1 }}>{name}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <Stack direction="column" spacing={2} sx={{ mb: 3, px: { xs: 1, sm: 2 } }}>
      {/* Top row with navigation and current date */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Navigation controls */}
        <Stack direction="row" spacing={1} alignItems="center">
          {isMobile || isTablet ? (
            <>
              <IconButton onClick={handleActionMenuClick}>
                <MoreVert />
              </IconButton>
              <SaveCalendarData />
              <ActionMenu />
            </>
          ) : (
            <ButtonGroup variant="contained" size="small">
              {!isCalendarPage && <CopyButton title="Share" value={copyLink} />}
              <CalendarManagement />
              <SaveCalendarData />
              <ResetCalendarData />
              {/*<Button onClick={() => navigate("TODAY")}>*/}
              {/*  Today <TimeZoneSelector />*/}
              {/*</Button>*/}
            </ButtonGroup>
          )}

          {/* Navigation arrows - always visible */}
          <ButtonGroup variant="contained" size="small">
            <Tooltip title="Previous">
              <IconButton onClick={() => navigate("PREV")} size="small">
                <NavigateBefore />
              </IconButton>
            </Tooltip>
            <Tooltip title="Today">
              <IconButton onClick={() => navigate("TODAY")} size="small">
                <CircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Next">
              <IconButton onClick={() => navigate("NEXT")} size="small">
                <NavigateNext />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          {isMobile || isTablet ? (
            <>
              <Button
                variant="contained"
                onClick={handleViewMenuClick}
                endIcon={<MoreVert />}
              >
                {view}
              </Button>
              <ViewMenu />
            </>
          ) : (
            <ButtonGroup variant="contained" size="small">
              {viewNames.map((name) => (
                <Tooltip key={name} title={name}>
                  <Button
                    onClick={() => toolbar.onView(name)}
                    variant={view === name ? "contained" : "outlined"}
                    sx={{
                      bgcolor: view === name ? "primary.main" : "transparent",
                      "&:hover": {
                        bgcolor:
                          view === name ? "primary.dark" : "action.hover",
                      },
                    }}
                  >
                    <Typography
                      sx={{ ml: 1, display: { xs: "none", md: "block" } }}
                    >
                      {name}
                    </Typography>
                  </Button>
                </Tooltip>
              ))}
            </ButtonGroup>
          )}
        </Stack>

        {/* Current Date Display */}
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{
            fontWeight: 500,
            textAlign: "center",
            flex: 1,
          }}
        >
          {toolbar.label} :
          <TimeZoneSelector />
        </Typography>
      </Stack>

      {/* Bottom row with view selection */}
    </Stack>
  );
};

export default CustomToolbar;
