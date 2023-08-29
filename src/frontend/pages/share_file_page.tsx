import * as React from "react";
import {useEffect, useState} from "react";
import Editor from "odoc-editor";
import {table} from "../components/genral/editor_demo";
import {payment_contract} from "../data_processing/data_samples";
import {EditorRenderer} from "../components/editor_components/editor_renderer";
import {ContentNode, FileNode} from "../../declarations/user_canister/user_canister.did";
import {normalize_content_tree, SlateNode} from "../data_processing/normalize/normalize_contents";
import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../redux/main";
import {actor} from "../App";

function ShareFilePage(props: any) {
    let url = window.location.search;
    let id = url.split("=")[1];

    const {files, files_content} = useSelector((state: any) => state.filesReducer);
    let file_id: null | String = Object.keys(files).find((key: string) => files[key].share_id[0] == id);

    let [file, setFile] = useState<null | FileNode>(files[file_id]);
    let [state, setState]: any = useState(file ? files_content[file.id] : null);
    const dispatch = useDispatch();

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {

        if (!file) {
            (async () => {
                let loading = enqueueSnackbar(<span><span className={"loader"}/></span>);
                let res = actor && await actor.get_shared_file(id)

                closeSnackbar(loading);

                if (res.Ok) {
                    let file: FileNode = res.Ok[0]
                    let content_tree: Array<[string, ContentNode]> = res.Ok[1]
                    let normalized_tree: Array<SlateNode> = normalize_content_tree(content_tree);
                    setFile(file);
                    setState(normalized_tree)
                } else {
                    enqueueSnackbar(`Error: ${res.Err}`, {variant: "error"});
                }
            })()
        }

        dispatch(handleRedux("CURRENT_FILE", {file}));

    }, [file])

    return (
        <>
            <h1>{file && file.name}</h1>
            {state && <Editor
                contentcontentEditable={false}
                componentsOptions={[
                    table,
                    payment_contract,
                    {type: "shares_contract"},
                    {type: "custom_contract"},
                ]}
                renderElement={EditorRenderer}
                searchOptions={"gi"}
                data={state || []}
            />}

        </>
    )
}

export default ShareFilePage;