import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import {useEffect} from "react";
import Editor from "odoc-editor";
import {handleRedux} from "../redux/main";
import {EditorRenderer} from "../components/editor_components/editor_renderer";
import {payment_contract} from "../data_processing/data_samples";
import {table} from "../components/genral/editor_demo";
import {logger} from "../dev_utils/log_data";


function FileContentPage(props: any) {

    const {all_friends} = useSelector((state: any) => state.filesReducer);

    let {searchValue} = useSelector((state: any) => state.uiReducer);
    const {current_file, files_content} = useSelector(
        (state: any) => state.filesReducer
    );

    let [title, setTitle] = React.useState(current_file.name);
    console.log({title})


    const dispatch = useDispatch();


    function onChange(changes: any) {
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: changes}));
        // dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
        // if (file_name || file_parent) {
        //      dispatch(handleRedux("FILE_CHANGES", {id: current_file.id, changes: current_file}));
        // }

        console.log("changes", changes);
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
            dispatch(handleRedux("UPDATE_FILE_TITLE", {id: current_file.id, title: title}));
            dispatch(handleRedux("FILE_CHANGES", {id: current_file.id, changes: current_file}));
        }, 250);
        return () => clearTimeout(timeout);
    }, [title])

    // let {revoke_message} = useTotalDept();
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    // let handleSave = async () => {
    //
    //     let loading = enqueueSnackbar(<span>saving... <span className={"loader"}/></span>, {});
    //     let content_tree = denormalize_file_contents(files_content[current_file.id])
    //
    //     let res = await actor.save_payment_contract(current_file.id, title || current_file.name, [], content_tree, [])
    //     closeSnackbar(loading);
    //     enqueueSnackbar(`Your file is saved`, {variant: "success"});
    //
    // }

    function handleOnInsertComponent(e: any, component: any) {
        if (component.type == "payment_contract") {
            // dispatch(handleRedux("ADD_CONTENT", {id: current_file.id, content: payment_contract_content}))
        }

    }

    if (current_file.id != null) {
        let content = files_content[current_file.id];
        return (
            <div style={{marginTop: "3px", marginLeft: "10%", marginRight: "10%"}}>

                {current_file.name && (
                    <>
                        {/*<Button onClick={handleSave} style={{width: "100%"}} contentEditable={false}>Save</Button>*/}
                        <h1
                            onKeyDown={preventEnter}
                            onKeyUp={handleTitleKeyDown}
                            contentEditable={true}>{current_file.name}</h1>
                        <Editor
                            componentsOptions={[
                                table,
                                payment_contract,
                                {type: "accumulative_contract"},
                                {type: "custom_contract"},
                            ]}
                            onInsertComponent={handleOnInsertComponent}
                            mentionOptions={all_friends ? all_friends.map((i) => i.name) : []}
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
