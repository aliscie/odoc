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
import { FileIndexing } from "../../../declarations/backend/backend.did";
import flattenTree from "../../DataProcessing/deserlize/flatenFiles";
import GetMoreFiles from "../Actions/GetMoreFiles";

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
    let new_index = over.data.current.sortable.index;


    if (updatedFile1.parent.length > 0 && new_index > 0) {
      const parentIndex = flattenedFiles.findIndex(
        (f) => f.id == updatedFile1.parent[0],
      );
      new_index = Math.abs(new_index - parentIndex - 1);
    }

    const reIndexing: FileIndexing = {
      id: updatedFile1.id,
      new_index: new_index,
      parent: updatedFile1.parent,
    };

    dispatch(
      handleRedux("CHANGE_FILE_PARENT", {
        updatedFile1,
        updatedFile2,
        reIndexing,
        flattenedFiles,
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
            <SortableTree
              key={files}
              dragEnd={dragEnd}
              defaultItems={files.length > 0 ? convertToTreeItems(files) : []}
            />
            <Divider />
            <CreateFile />
            <GetMoreFiles />
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
