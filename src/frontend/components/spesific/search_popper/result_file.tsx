import {Divider, Typography} from "@mui/material";
import EditorComponent from "../../editor_components/main";
import * as React from "react";
import {FileNode} from "../../../../declarations/user_canister/user_canister.did";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../../redux/main";

interface Props {
    file_id: string;
}

const resultFileContainerStyle: React.CSSProperties = {
    maxHeight: "200px",
    overflowY: "scroll",
    background: 'black',
    border:"5px solid gray",
};

// const editorContainerStyle: React.CSSProperties = {
//     maxHeight: "calc(100% - 2em)", // Adjust as needed
//     overflowY: "auto",
// };

function ResultFile(props: Props) {
    let dispatch = useDispatch();

    const {files, files_content} = useSelector(
        (state: any) => state.filesReducer
    );
    let file: FileNode = files[props.file_id];

    let title = file && file.name;
    let content = files_content[props.file_id];

    return (
        <div
            onMouseDown={() => {
                dispatch(
                    handleRedux("CURRENT_FILE", {file: {id: props.file_id, name: title}})
                );
            }}
            style={resultFileContainerStyle}
        >
            <Typography variant="h3" contentEditable={false}>
                {title}
            </Typography>
            <div >
                <EditorComponent
                    contentEditable={false}
                    editorKey={props.file_id}
                    content={content || []}
                />
            </div>
            <Divider/>
        </div>
    );
}

export default ResultFile;
