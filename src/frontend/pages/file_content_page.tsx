import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import {useEffect} from "react";
import Editor from "odoc-editor";
import {handleRedux} from "../redux/main";
import {EditorRenderer} from "../components/editor_components/editor_renderer";
import {Button} from "@mui/material";


function FileContentPage(props: any) {

    const {all_friends, contracts} = useSelector((state: any) => state.filesReducer);
    let {searchValue} = useSelector((state: any) => state.uiReducer);
    const {current_file, files_content} = useSelector(
        (state: any) => state.filesReducer
    );
    let [title, setTitle] = React.useState(current_file.name);


    const dispatch = useDispatch();

    function onChange(changes: any) {
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
        dispatch(handleRedux("FILES_CHANGED"));
        console.log("changes", changes);
    }

    const editorKey = current_file.name || ""; // Provide a key based on current_file.name
    let handleTitleKeyDown = (e: any) => {
        setTitle(e.target.innerText);
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }

    };

    useEffect(() => {
        let timeout = setTimeout(() => {
            console.log("UPDATE_FILE_TITLE")
            dispatch(handleRedux("UPDATE_FILE_TITLE", {id: current_file.id, title: title}));
        }, 250);
        return () => clearTimeout(timeout);
    }, [title])
    let handleSave = () => {
        console.log({title, current_file, files_content, contracts});
    }

    if (current_file.id != null) {
        let content = files_content[current_file.id];
        return (
            <div style={{marginTop: "3px", marginLeft: "10%", marginRight: "10%"}}>
                {current_file.name && (
                    <>
                        <Button onClick={handleSave} style={{width: "100%"}} contentEditable={false}>Save</Button>
                        <h1 onKeyDown={handleTitleKeyDown} contentEditable={true}>{current_file.name}</h1>
                        <Editor
                            mentionOptions={all_friends.map((i) => i.name)}
                            key={editorKey} // Add key prop to trigger re-render
                            onChange={onChange}
                            renderElement={EditorRenderer}
                            searchOptions={"gi"}
                            search={searchValue}
                            data={content || []}
                        />
                    </>
                )}
            </div>
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
