import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import {useEffect} from "react";
import Editor from "odoc-editor";
import {handleRedux} from "../redux/main";
import {EditorRenderer} from "../components/editor_components/editor_renderer";
import {Button} from "@mui/material";
import {actor} from "../backend_connect/ic_agent";
import denormalize_file_contents from "../data_processing/denormalize/denormalize_file_contents";
import {logger} from "../dev_utils/log_data";


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
    let handleSave = async () => {

        let parent_file = []
        // let content_tree = denormalize_file_contents(files_content[current_file.id])
        let id = "1nynol";
        let title = "";
        let content_tree = {
            "0": {
                "id": 0,
                "_type": "payment_contract",
                "data": [],
                "text": "",
                "parent": null,
                "children": [1]
            },
            "1": {
                "id": 1,
                "data": [{"Contract": {"PaymentContract": "mzez0q"}}],
                "text": "",
                "parent": null,
                "children": [2]
            },
            "2": {"id": 2, "data": [], "text": "", "parent": null, "children": []},
            "undefined": {"data": [], "text": "", "parent": null, "children": []}
        };

        let contracts = {
            "mzez0q": {
                "contract_id": "mzez0q",
                "sender": "",
                "released": false,
                "amount": 100,  // Corrected the data type to an integer
                "receiver": "dbrpy-d77yw-azutg-7ndrq-kw55i-72uhh-eonyl-hks6f-cugod-h5wgl-lae"
            }
        };

        let res = await actor.save_payment_contract(id, title, [], content_tree, contracts);
        // let res = await actor.save_payment_contract(current_file.id, title || "", [], content_tree, contracts)
        console.log({res})
        //     TODO
        //      Uncaught (in promise) Error: Invalid vec record {text; record {id:text; _type:text; data:opt variant {Comment:text; Image:vec nat64; Table:record {rows:vec variant {Contract:variant {PaymentContract:text}; NormalCell:vec record {text; text}}; columns:vec record {_type:variant {Tag; Date; File; Text; Person; Category; Number}; field:text; filters:vec record {name:text; operations:vec variant {Equal; Contains; Bigger; BiggerOrEqual}; formula:opt text}; permissions:vec record {_type:variant {CanRead; CanUpdate}; granted_to:vec principal}; dataValidator:opt text; editable:bool; formula:opt record {trigger_target:text; trigger:variant {Timer; Update}; operation:variant {Equal; Contains; Bigger; BiggerOrEqual}; execute:variant {TransferNft; TransferToken; TransferUsdt}}}}}; text:text; children:vec text; parent:opt text}} argument: {"0":{"id":0,"_type":"payment_contract","data":[],"text":"","parent":null,"children":[1]},"1":{"id":1,"data":[{"Table":{"rows":[{"Contract":{"PaymentContract":"f93n9j"}}],"columns":[]}}],"text":"","parent":null,"children":[2]},"2":{"id":2,"data":[],"text":"","parent":null,"children":[]},"undefined":{"data":[],"text":"","parent":null,"children":[]}}
        //      Uncaught (in promise) Error: Invalid vec record {text; record {id:text; _type:text; data:opt variant {Comment:text; Image:vec nat64; Table:record {rows:vec variant {Contract:variant {PaymentContract:text}; NormalCell:vec record {text; text}}; columns:vec record {_type:variant {Tag; Date; File; Text; Person; Category; Number}; field:text; filters:vec record {name:text; operations:vec variant {Equal; Contains; Bigger; BiggerOrEqual}; formula:opt text}; permissions:vec record {_type:variant {CanRead; CanUpdate}; granted_to:vec principal}; dataValidator:opt text; editable:bool; formula:opt record {trigger_target:text; trigger:variant {Timer; Update}; operation:variant {Equal; Contains; Bigger; BiggerOrEqual}; execute:variant {TransferNft; TransferToken; TransferUsdt}}}}}; text:text; children:vec text; parent:opt text}} argument: {"0":{"id":0,"_type":"payment_contract","data":[],"text":"","parent":null,"children":[1]},"1":{"id":1,"data":[{"Contract":{"PaymentContract":"mzez0q"}}],"text":"","parent":null,"children":[2]},"2":{"id":2,"data":[],"text":"","parent":null,"children":[]},"undefined":{"data":[],"text":"","parent":null,"children":[]}}
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
