import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import {useEffect} from "react";
import {handleRedux} from "../redux/main";
import {contract_sample, payment_contract} from "../data_processing/data_samples";
import {FileNode} from "../../declarations/user_canister/user_canister.did";
import EditorComponent from "../components/editor_components/main";
import {logger} from "../dev_utils/log_data";


function FileContentPage(props: any) {

    const {current_file, files_content} = useSelector((state: any) => state.filesReducer);


    let [title, setTitle] = React.useState(current_file.name);


    const dispatch = useDispatch();


    function onChange(changes: any) {
        if (files_content[current_file.id] !== changes) {
            dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
            dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: changes}));
        }
    }

    const editorKey = current_file.name || ""; // Provide a key based on current_file.name
    let handleTitleKeyDown = (e: any) => {
        setTitle(e.target.innerText);
    };
    let preventEnter = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }

    };

    useEffect(() => {
        let timeout = setTimeout(() => {

            if (title !== current_file.name) {
                let file: FileNode = {
                    ...current_file,
                    name: title,
                    parent: current_file.parent,
                    children: current_file.children,
                    share_id: current_file.share_id || []
                };
                dispatch(handleRedux("UPDATE_FILE_TITLE", {id: current_file.id, title: title}));
                dispatch(handleRedux("FILE_CHANGES", {changes: file}));
            }
        }, 250);
        return () => clearTimeout(timeout);
    }, [title])


    function handleOnInsertComponent(e: any, component: any) {
        console.log("handleOnInsertComponent", component);
        if (component.type == "payment_contract") {
            dispatch(handleRedux("ADD_CONTRACT", {contract: contract_sample}))
            dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract_sample}));
        }

    }

    let fileName = current_file.name; // Making a copy of the name, in order to prevent content conflict on setTitle

    if (current_file.id != null) {
        let content = files_content[current_file.id];
        return (
            <div style={{marginTop: "3px", marginLeft: "10%", marginRight: "10%"}}>

                {current_file.name && (
                    <>
                        <h1
                            onKeyDown={preventEnter}
                            onKeyUp={handleTitleKeyDown}
                            contentEditable={true}>{fileName}</h1>
                        <EditorComponent
                            handleOnInsertComponent={handleOnInsertComponent}
                            onChange={onChange}
                            editorKey={editorKey}
                            content={content || []}
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
