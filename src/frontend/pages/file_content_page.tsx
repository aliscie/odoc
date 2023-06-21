import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import Editor from "odoc-editor";
import {handleRedux} from "../redux/main";
import {logger} from "../dev_utils/log_data";
import {EditorRenderer} from "../components/editor_components/editor_renderer";

let test_data = [
    {
        id: 9,
        type: "h1",
        children: [{id: 10, text: "title ."}],
    },
    {
        id: 10,
        type: "new",
        children: [{id: 10, type: "", text: "child is here."}],
    },
];

function FileContentPage(props: any) {
    let {searchValue} = useSelector((state: any) => state.uiReducer);
    const {current_file, files_content} = useSelector(
        (state: any) => state.filesReducer
    );
    const dispatch = useDispatch();

    function onChange(changes: any) {
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
        dispatch(handleRedux("FILES_CHANGED"));
    }

    const editorKey = current_file.name || ""; // Provide a key based on current_file.name

    if (current_file.id != null) {
        let content = files_content[current_file.id];
        console.log({content});
        logger(content)
        return (
            <span style={{margin: "3px", marginLeft: "20%", marginRight: "10%"}}>
        {current_file.name && (
            <>
                <h1 contentEditable={true}>{current_file.name}</h1>
                <Editor
                    mentionOptions={["Ali", "Aman", "James"]}
                    key={editorKey} // Add key prop to trigger re-render
                    onChange={onChange}
                    renderElement={EditorRenderer}
                    searchOptions={"gi"}
                    search={searchValue}
                    data={content || []}
                />
            </>
        )}
      </span>
        );
    }
    return (
        <span>
      404
      dummy
    </span>
    );
}

export default FileContentPage;
