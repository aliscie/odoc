import {Button, Tooltip} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {backend} from "../../backend_connect/main";
import {convertAllDataBack} from "../../data_normalization/convert_data_to_oringal";
import {logger} from "../../dev_utils/log_data";

function ContentSave(props: any) {
    const dispatch = useDispatch();

    let {is_files_saved, files_content} = useSelector((state: any) => state.filesReducer);

    // console.log({files_content})
    async function handleClick() {
        console.log("------- click")
        // logger(files_content)
        // let process_files_content = convertAllDataBack(files_content);
        // console.log("------- process_files_content")
        // logger(process_files_content)

        let process_files_content = [
            {
                0: {
                    0: {
                        "id": 0,
                        "parent": [],
                        "_type": "",
                        "text": "Sample text 1",
                        "children": [],
                        "data": null
                    }
                }
            },
            {
                1: {
                    11: {
                        "id": 11,
                        "parent": [],
                        "_type": "",
                        "text": "Sample text 2",
                        "children": [],
                        "data": null
                    }
                }
            },
            {
                2: {
                    16: {
                        "id": 16,
                        "parent": [],
                        "_type": "",
                        "text": "Sample text 3",
                        "children": [],
                        "data": null
                    }
                }
            }
        ]

        // let process_files_content = {"0": [{"id": 0, "type": "", "children": [{"id": 1, "type": "", "text": "child is here. "}]}]}
        // Uncaught (in promise) Error: Invalid vec vec record {nat64; vec record {nat64; record {id:nat64; _type:text; data:opt variant {Comment:text; Image:vec nat64; Table:record {rows:vec record {data:vec record {text; text}}; columns:vec record {_type:variant {Tag; Date; File; Text; Person; Category; Number}; filters:vec record {name:text; operations:vec variant {Equal; Contains; Bigger; BiggerOrEqual}; formula:opt text}; permissions:vec record {_type:variant {CanRead; CanUpdate}; granted_to:vec principal}; name:text; formula:opt text}}}; text:text; children:vec nat64; parent:opt nat64}}} argument:
        // index 0 -> Invalid vec record {nat64; vec record {nat64; record {id:nat64; _type:text; data:opt variant {Comment:text; Image:vec nat64; Table:record {rows:vec record {data:vec record {text; text}}; columns:vec record {_type:variant {Tag; Date; File; Text; Person; Category; Number}; filters:vec record {name:text; operations:vec variant {Equal; Contains; Bigger; BiggerOrEqual}; formula:opt text}; permissions:vec record {_type:variant {CanRead; CanUpdate}; granted_to:vec principal}; name:text; formula:opt text}}}; text:text; children:vec nat64; parent:opt nat64}}} argument: {"0":{"undefined":{"children":[]}}}
        let res = await backend.multi_update(process_files_content);
        logger(res)
        dispatch(handleRedux("FILES_SAVED"));

    }

    let tip_for_saved = "Your changes saved to the blockchain.";
    let tip_for_changed = "You need to save";
    return <Tooltip title={is_files_saved ? tip_for_saved : tip_for_changed}>
        <Button
            disabled={is_files_saved}
            onClick={handleClick}
        >Save
        </Button>
    </Tooltip>
}

export default ContentSave;