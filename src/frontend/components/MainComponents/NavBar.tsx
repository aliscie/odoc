import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  styled,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import ExploreIcon from "@mui/icons-material/Explore";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloseIcon from "@mui/icons-material/Close";
import CreateFile from "../Actions/CreateFile";
import { handleRedux } from "../../redux/store/handleRedux";
import { Z_INDEX_SIDE_NAVBAR } from "../../constants/zIndex";
import SortableTree from "./SortableTree";
import { FileIndexing } from "../../../declarations/backend/backend.did";
import flattenTree from "../../DataProcessing/deserlize/flatenFiles";
import GetMoreFiles from "../Actions/GetMoreFiles";
import { buildTree } from "./SortableTree/utilities";

// Styled components for theme-aware styling
const StyledDrawerPaper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  backdropFilter: "blur(10px)",
  width: "100%",
  height: "100%",
  // overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  [theme.breakpoints.up("sm")]: {
    width: "250px",
    // padding: "8px 16px",
    marginTop: "25px", // Reduced fixed height for desktop top spacing
  },
}));

const MobileHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px",
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: "8px 0",
  padding: "12px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  [theme.breakpoints.down("sm")]: {
    margin: "4px 16px",
    padding: "16px",
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const NavBar = (props: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { files, profile_history, currentWorkspace } = useSelector(
    (state: any) => state.filesState,
  );
  const dispatch = useDispatch();
  const { isNavOpen, isLoggedIn } = useSelector((state: any) => state.uiState);
  const [defaultItems, setDefaultItems] = useState([]);

  const navLinks = [
    { label: "About Us", to: "/about", icon: <InfoIcon /> },
    { label: "Discover", to: "/discover", icon: <ExploreIcon /> },
    {
      label: "Subscriptions",
      to: "/subscriptions",
      icon: <WorkspacePremiumIcon />,
    },
    { label: "White Paper", to: "/white_paper", icon: <ReceiptIcon /> },
    { label: "Vote", to: "/vote", icon: <HowToVoteIcon /> },
  ];

  if (!(profile_history?.actions_rate >= 1)) {
    navLinks.push({
      label: "Dashboard",
      to: "/dashboard",
      icon: <DashboardIcon />,
    });
  } else {
    navLinks.push({ label: "About Us", to: "/about", icon: <InfoIcon /> });
  }

  const handleNavClose = () => {
    dispatch(handleRedux("CURRENT_FILE", { file: null }));
    dispatch(handleRedux("TOGGLE_NAV"));
  };

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

  useEffect(() => {
    let x = buildTree(files);
    if (currentWorkspace.id != "default") {
      x = x.filter((f) => f.workspaces.includes(currentWorkspace.id));
    }
    setDefaultItems(x);
  }, [files, currentWorkspace]);

  return (
    <div>
      <Drawer
        open={isNavOpen}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        onClose={handleNavClose}
        PaperProps={{
          className: "sidenav card bg-blur",
          sx: {
            width: isMobile ? "100%" : "200px",
            // outline:"red 10px",
            zIndex: Z_INDEX_SIDE_NAVBAR,
          },
        }}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        <StyledDrawerPaper>
          <ContentWrapper>
            <List>
              {navLinks.map((link) => (
                <StyledListItemButton
                  key={link.label}
                  onClick={handleNavClose}
                  component={Link}
                  to={link.to}
                  sx={{
                    padding: "4px 8px", // Reduced padding
                    minHeight: "36px", // Reduced height
                  }}
                >
                  {link.icon && (
                    <Box
                      sx={{
                        fontSize: "0.9rem", // Smaller icon
                        minWidth: "24px", // Reduced icon width
                      }}
                    >
                      {link.icon}
                    </Box>
                  )}
                  <ListItemText
                    primary={link.label}
                    sx={{
                      marginLeft: "8px", // Reduced margin
                      "& .MuiTypography-root": {
                        fontSize: isMobile ? "0.875rem" : "0.9rem", // Smaller font
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
                </StyledListItemButton>
              ))}
            </List>

            {isLoggedIn && (
              <>
                <Divider sx={{ my: 2 }} />
                <SortableTree
                  key={defaultItems + defaultItems.map((i) => i.workspaces)}
                  dragEnd={dragEnd}
                  defaultItems={defaultItems}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <CreateFile />
                  <GetMoreFiles />
                </Box>

              </>
            )}
          </ContentWrapper>
        </StyledDrawerPaper>
      </Drawer>

      <Box
        id="main"
        sx={{
          marginLeft: !isMobile && isNavOpen ? "250px" : 0,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {props.children}
      </Box>
    </div>
  );
};

export default NavBar;
