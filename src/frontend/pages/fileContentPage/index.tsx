import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import {
  CircularProgress,
  Input,
  styled,
  Box,
  Switch,
  Tooltip,
  IconButton,
  Collapse,
  alpha,
} from "@mui/material";
import ViewListIcon from '@mui/icons-material/ViewList';
import { handleRedux } from "../../redux/store/handleRedux";
import EditorComponent from "../../components/EditorComponent";
import NestedTabMenu from "./contentTab";

const ExpandingInput = styled(Input)(({ theme }) => ({
  '& input': {
    width: '100%',
    fontSize: '1.5rem',
    minWidth: 0,
    padding: '4px 8px',
    transition: 'all 0.2s ease',

    '&:hover, &:focus': {
      background: alpha(theme.palette.common.black, 0.02),
    },
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '&.active': {
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.1),
  },
}));

const ToggleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  '&.hidden': {
    opacity: 0,
    transform: 'translateX(-20px)',
  },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.05),
    opacity: 1,
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

function FileContentPage() {
  const { isLoggedIn } = useSelector((state: any) => state.uiState);
  const [showContentTabs, setShowContentTabs] = useState(false);
  let fileId = window.location.pathname.split("/")[1];
  const dispatch = useDispatch();

  const { inited, files_content, profile, files } = useSelector(
    (state: any) => state.filesState
  );

  const current_file = files.find((file: any) => file.id === fileId);
  const editorKey = (current_file && current_file.id) || "";

  const handleContentTabsToggle = () => {
    setShowContentTabs(!showContentTabs);
  };

  const handleDispatchChange = useCallback(
    debounce((title: string) => {
      if (title !== current_file?.name) {
        dispatch(
          handleRedux("UPDATE_FILE_TITLE", { id: current_file.id, title })
        );
      }
    }, 250),
    [dispatch, current_file]
  );

  const handleInputChange = (title: string) => {
    handleDispatchChange(title);
  };

  const onChange = debounce((changes: any) => {
    if (!current_file) return;

    const prevContent = JSON.stringify(files_content[current_file.id]);
    const newContent = JSON.stringify(changes);

    if (prevContent !== newContent) {
      dispatch(
        handleRedux("UPDATE_CONTENT", {
          id: current_file.id,
          content: changes,
        })
      );
    }
  }, 250);

  if (inited && files.length === 0) {
    return <span>404 Not Found</span>;
  }
  if (files.length === 0 && isLoggedIn) {
    return <CircularProgress />;
  }
  if (!current_file) {
    return <span>404 Not Found</span>;
  }

  const editable =
    current_file.author === profile.id ||
    Object.keys(current_file.permission)[0] === "CanUpdate" ||
    current_file.users_permissions.some(
      ([userId, permissions]) => userId === profile.id && permissions.CanUpdate
    );

  const isAuthor = current_file.author === profile.id;

  return (
    <div style={{ marginTop: "3px", marginLeft: "10%", marginRight: "10%" }}>
      <TopBar>
        <Collapse in={!showContentTabs} timeout={300}>
          <ToggleWrapper className={showContentTabs ? 'hidden' : ''}>
            <Tooltip title="Toggle Content Tabs" arrow>
              <AnimatedIconButton
                onClick={handleContentTabsToggle}
                className={showContentTabs ? 'active' : ''}
                size="small"
              >
                <ViewListIcon />
              </AnimatedIconButton>
            </Tooltip>
          </ToggleWrapper>
        </Collapse>
        <ExpandingInput
          key={current_file.id}
          fullWidth
          multiline
          rows={1}
          sx={{
            minWidth: "200px",
            maxWidth: "100%",
          }}
          inputProps={{
            style: {
              fontSize: "1.5rem",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            },
          }}
          disabled={!isAuthor}
          defaultValue={current_file.name}
          placeholder="Untitled"
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </TopBar>

      <NestedTabMenu
        onClose={() => {
          setShowContentTabs(false);
        }}
        open={showContentTabs}
        content={files_content[current_file.id]}
      />

      <EditorComponent
        readOnly={!isAuthor}
        id={current_file.id}
        contentEditable={editable}
        onChange={onChange}
        editorKey={editorKey}
        content={files_content[current_file.id]}
      />
    </div>
  );
}

export default FileContentPage
