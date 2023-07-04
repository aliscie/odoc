import * as React from "react";
import {useEffect, useState} from "react";
import {actor} from "../backend_connect/ic_agent";
import Editor from "odoc-editor";
import {table} from "../components/genral/editor_demo";
import {payment_contract} from "../data_processing/data_samples";
import {EditorRenderer} from "../components/editor_components/editor_renderer";
import {ContentNode, FileNode} from "../../declarations/user_canister/user_canister.did";
import {normalize_content_tree, SlateNode} from "../data_processing/normalize/normalize_contents";
import {useSnackbar} from "notistack";

function ShareFilePage(props: any) {
    console.log("ShareFilePage") // TODO why this is rendered twice?
    let [file, setFile]: any = useState();
    let [state, setState]: any = useState();
    let url = window.location.search;
    let id = url.split("=")[1];
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
let loading = enqueueSnackbar(<span><span className={"loader"}/></span>);
    useEffect(() => {

        (async () => {
            let res = await actor.get_shared_file(id)
            closeSnackbar(loading)
            if (res.Ok) {
                let file: FileNode = res.Ok[0]
                let content_tree: Array<[string, ContentNode]> = res.Ok[1]
                let normalized_tree: Array<SlateNode> = normalize_content_tree(content_tree);
                setFile(file);
                setState(normalized_tree)
                console.log({file, content_tree})
            } else {
                enqueueSnackbar(`Error: ${res.Err}`, {variant: "error"});
            }
            console.log({res})
        })()

    }, [])

    return (
        <>
            <h1>{file && file.name}</h1>
            {state && <Editor
                contentcontentEditable={false}
                componentsOptions={[
                    table,
                    payment_contract,
                    {type: "accumulative_contract"},
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