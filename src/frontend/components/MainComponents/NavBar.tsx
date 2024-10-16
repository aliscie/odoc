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
import { FileIndexing } from "../../../declarations/backend/backend.did";
import { convertAllDataBack } from "../../DataProcessing/serialize/serializeFiles";
import flattenTree from "../../DataProcessing/deserlize/flatenFiles";

const NavBar = (props: any) => {
  const { files } = useSelector((state: any) => state.filesState);

  const dispatch = useDispatch();
  const { isNavOpen, isLoggedIn } = useSelector((state: any) => state.uiState);

  const navLinks = [
    { label: "About Us", to: "/", icon: <InfoIcon /> },
    { label: "Discover", to: "/discover", icon: <ExploreIcon /> },
  ];
  const dragEnd = ({ active, over, newItems }) => {
    const flattenedFiles = flattenTree(newItems);
    let updatedFile1 = flattenedFiles.find((f) => f.id == active.id);
    let updatedFile2 = flattenedFiles.find((f) => f.id == over.id);
    updatedFile1 = {
      ...files.find((f) => f.id == updatedFile1.id),
      parent: updatedFile1.parentId ? [updatedFile1.parentId] : [],
      children: updatedFile1.children,
    };

    updatedFile2 = {
      ...files.find((f) => f.id == updatedFile2.id),
      parent: updatedFile2.parentId ? [updatedFile2.parentId] : [],
      children: updatedFile2.children,
    };
    console.log({ updatedFile1, updatedFile2 });
    let reIndexing: FileIndexing = {
      id: updatedFile1.id,
      new_index: BigInt(over.data.current.sortable.index),
      parent: updatedFile1.parent,
    };
    dispatch(
      handleRedux("CHANGE_FILE_PARENT", {
        updatedFile1,
        updatedFile2,
        reIndexing,
      }),
    );
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
              key={files}
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
