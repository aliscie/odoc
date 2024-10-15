import React from "react";
import "./style/navBar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import CreateFile from "../Actions/CreateFile";
import { handleRedux } from "../../redux/store/handleRedux";
import InfoIcon from "@mui/icons-material/Info";
import ExploreIcon from "@mui/icons-material/Explore";
import { Z_INDEX_SIDE_NAVBAR } from "../../constants/zIndex";
import SortableTree from "./SortableTree";
import convertToTreeItems from "../../DataProcessing/convertToTree";
import { logger } from "../../DevUtils/logData";

const NavBar = (props: any) => {
  const { files } = useSelector((state: any) => state.filesState);

  // logger({ files });

  const dispatch = useDispatch();
  const { isNavOpen, isLoggedIn } = useSelector((state: any) => state.uiState);

  const navLinks = [
    { label: "About Us", to: "/", icon: <InfoIcon /> },
    { label: "Discover", to: "/discover", icon: <ExploreIcon /> },
  ];
  const dragEnd = ({ active, over }) => {
    let sample = {
      active: {
        id: "rq2yk8",
        data: {
          current: {
            sortable: {
              containerId: "Sortable-1",
              index: 3,
              items: ["v4gbi3", "91ndg2", "noskko", "rq2yk8"],
            },
          },
        },
        rect: {
          current: {
            initial: {
              top: 265.3984375,
              left: 26,
              width: 129.0625,
              height: 35.1328125,
              bottom: 300.53125,
              right: 155.0625,
            },
            translated: {
              top: 133.4375,
              left: 39.92578125,
              width: 129.0625,
              height: 35.1328125,
              bottom: 168.5703125,
              right: 168.98828125,
            },
          },
        },
      },
      over: {
        id: "v4gbi3",
        rect: {
          width: 217,
          height: 45.1328125,
          top: 153,
          bottom: 198.1328125,
          right: 233,
          left: 16,
        },
        data: {
          current: {
            sortable: {
              containerId: "Sortable-1",
              index: 0,
              items: ["v4gbi3", "91ndg2", "noskko", "rq2yk8"],
            },
          },
        },
        disabled: false,
      },
    };

    // dispatch(
    //   handleRedux("CHANGE_FILE_PARENT", {
    //     position: dragOverPosition,
    //     id: active.id,
    //     parent: [over.id],
    //     index: over.data.index,
    //   }),
    // );
  };

  return (
    <div>
      <Drawer
        open={isNavOpen}
        variant="persistent"
        anchor="left"
        PaperProps={{
          className: "sidenav card bg-blur",
          style: {
            zIndex: Z_INDEX_SIDE_NAVBAR,
            width: "250px",
            padding: "16px",
          },
        }}
      >
        <List>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.label}
              onClick={() => {
                dispatch(handleRedux("CURRENT_FILE", { file: null }));
              }}
              component={Link}
              to={link.to}
              sx={{
                margin: "8px 0",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              {link.icon}
              <ListItemText primary={link.label} sx={{ marginLeft: "16px" }} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        {isLoggedIn && (
          <>
            {/*<NestedList />*/}
            <SortableTree
              dragEnd={dragEnd}
              defaultItems={convertToTreeItems(files)}
            />
            <Divider />
            <CreateFile />
          </>
        )}
      </Drawer>
      <div id="main" style={{ marginLeft: isNavOpen ? "250px" : 0 }}>
        <span>{props.children}</span>
      </div>
    </div>
  );
};

export default NavBar;
