import React from "react";
import {useDispatch, useSelector} from "react-redux";

import {CircularProgress, Typography} from "@mui/material";
import {handleRedux} from "../redux/store/handleRedux";
import EditorComponent from "../components/EditorComponent";

interface Props {
}

const FileContentPage: React.FC<Props> = () => {
    let fileId = window.location.pathname.split("/")[1];
    const dispatch = useDispatch();
    const {inited, files_content, profile, files} = useSelector(
        (state: any) => state.filesState,
    );

    let current_file = files.find((file: any) => file.id === fileId);

    const editorKey = (current_file && current_file.id) || "";
    const onChange = (changes: any) => {

        if (current_file) {
            dispatch(
                handleRedux("UPDATE_CONTENT", {
                    id: current_file.id,
                    content: changes,
                }),
            )
        }

    }

    const handleTitleKeyUp = (event) => {
        {
            let title = event.target.innerText;
            if (title !== current_file.name) {
                dispatch(
                    handleRedux("UPDATE_FILE_TITLE", {id: current_file.id, title}),
                );
            }
        }
    }

    const preventEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };
    if (!inited) {
        return <CircularProgress/>
    }
    if (!current_file) {
        return <span>404 Not Found</span>;
    }

    const editable =
        current_file.author === profile.id ||
        Object.keys(current_file.permission)[0] === "CanUpdate" ||
        current_file.users_permissions.some(
            ([userId, permissions]) => userId === profile.id && permissions.CanUpdate,
        );
    return (
        <div style={{marginTop: "3px", marginLeft: "10%", marginRight: "10%"}}>
            <Typography
                contentEditable={editable}
                variant="h4" style={{marginBottom: "10px"}}
                key={current_file.id + current_file.name}
                style={{outline: "none"}}
                // onKeyUp={handleTitleKeyUp}
                onKeyDown={preventEnter}
                onBlur={handleTitleKeyUp}

            >
                {current_file.name || "Untitled"}
            </Typography>
            <EditorComponent
                title={current_file.name || "Untitled"}
                id={current_file.id}
                contentEditable={editable}
                onChange={onChange}
                editorKey={editorKey}
                content={files_content[current_file.id]}
            />
        </div>
    );
};

export default FileContentPage;
