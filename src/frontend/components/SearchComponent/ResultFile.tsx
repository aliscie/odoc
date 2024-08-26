import { Divider } from "@mui/material";
import * as React from "react";
import { FileNode } from "../../../declarations/backend/backend.did";
import { useDispatch, useSelector } from "react-redux";
import { handleRedux } from "../../redux/store/handleRedux";
import EditorComponent from "../EditorComponent";

interface Props {
  file_id: string;
}

const resultFileContainerStyle: React.CSSProperties = {
  maxHeight: "200px",
  overflowY: "scroll",
  background: "black",
  border: "5px solid gray",
};

// const editorContainerStyle: React.CSSProperties = {
//     maxHeight: "calc(100% - 2em)", // Adjust as needed
//     overflowY: "auto",
// };

function ResultFile(props: Props) {
  let dispatch = useDispatch();

  const { files, files_content } = useSelector(
    (state: any) => state.filesState,
  );
  let file: FileNode = files.find((file: FileNode) => file.id == props.file_id);

  let title = file && file.name;
  let content = files_content[props.file_id];
  return (
    <div
      onMouseDown={() => {
        dispatch(
          handleRedux("CURRENT_FILE", {
            file: { id: props.file_id, name: title },
          }),
        );
      }}
      style={resultFileContainerStyle}
    >
      <EditorComponent
        id={"result-title"}
        readlOnly={true}
        editorKey={props.file_id}
        content={[{ type: "h1", children: [{ text: String(title) }] }]}
      />
      <div>
        <EditorComponent
          id={"result-content"}
          contentEditable={false}
          editorKey={props.file_id}
          content={content || []}
        />
      </div>
      <Divider />
    </div>
  );
}

export default ResultFile;
