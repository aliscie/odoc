import {Divider, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, useTheme} from "@mui/material";
import {useSelector} from "react-redux";
import React from "react";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


const VideoList = ({ videos, selectedIndex, onSelect }: any) => {
  const theme = useTheme();
  const state = {
    uiState: useSelector((state: any) => state.uiState),
    filesState: useSelector((state: any) => state.filesState),
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {videos.map((video: Tutorial, index: number) => (
        <React.Fragment key={index}>
          <ListItem
            button
            selected={selectedIndex === index}
            onClick={() => onSelect(index)}
            sx={{
              py: 2,
              transition: theme.transitions.create([
                "background-color",
                "color",
              ]),
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                },
              },
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon>
              {selectedIndex === index ? (
                <PlayCircleFilledIcon color="primary" />
              ) : (
                <PlayCircleOutlineIcon />
              )}
            </ListItemIcon>
            <ListItemText
              primary={video.title}
              primaryTypographyProps={{
                sx: {
                  fontWeight: selectedIndex === index ? 600 : 400,
                },
              }}
            />
            {video.checkCondition && video.checkCondition({ ...state }) && (
              <ListItemSecondaryAction>
                <CheckCircleIcon
                  color="success"
                  sx={{
                    animation: "fadeIn 0.5s ease-in",
                    "@keyframes fadeIn": {
                      "0%": {
                        opacity: 0,
                        transform: "scale(0.8)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "scale(1)",
                      },
                    },
                  }}
                />
              </ListItemSecondaryAction>
            )}
          </ListItem>
          {index < videos.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default VideoList;
