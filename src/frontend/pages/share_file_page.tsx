import * as React from "react";
import {useEffect, useState} from "react";
import Editor from "odoc-editor";
import {table} from "../components/genral/editor_demo";
import {payment_contract} from "../data_processing/data_samples";
import {EditorRenderer} from "../components/editor_components/editor_renderer";
import {ContentNode, FileNode} from "../../declarations/backend/backend.did";
import {normalize_content_tree, SlateNode} from "../data_processing/normalize/normalize_contents";
import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../redux/main";
import {actor} from "../App";

export type FileQuery = undefined | { Ok: [FileNode, Array<[string, ContentNode]>] } | { Err: string };

function ShareFilePage(props: any) {
    let url = window.location.search;
    let id = url.split("=")[1];

    const {files, files_content} = useSelector((state: any) => state.filesReducer);
    let file_id: null | String = files.find((file: FileNode) => file.share_id[0] == id);

    let [file, setFile] = useState<null | FileNode>(files[file_id]);
    let [state, setState]: any = useState(file ? files_content[file.id] : null);
    const dispatch = useDispatch();

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {

        if (!file) {
            (async () => {
                let loading = enqueueSnackbar(<span><span className={"loader"}/></span>);
                let res: FileQuery = actor && await actor.get_shared_file(id)

                closeSnackbar(loading);

                if ("Ok" in res) {
                    let file: FileNode = res.Ok[0]
                    let content_tree: Array<[string, ContentNode]> = res.Ok[1]
                    let normalized_tree: Array<SlateNode> = normalize_content_tree(content_tree);
                    setFile(file);
                    setState(normalized_tree)
                    dispatch(handleRedux("CURRENT_FILE", {file}));
                    dispatch(handleRedux("ADD_CONTENT", {id: file.id, content: normalized_tree}))
                    dispatch(handleRedux("ADD_FILE", {data: file}))
                } else {
                    enqueueSnackbar(`Error: ${res.Err}`, {variant: "error"});
                }
            })()
        }

    }, [file])

    return (
        <>
            <h1>{file && file.name}</h1>
            {state && <Editor
                contentEditable={false}
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