import {table} from "../genral/editor_demo";
import {data_grid, payment_contract} from "../../data_processing/data_samples";
import {EditorRenderer} from "./editor_renderer";
import Editor from "odoc-editor";
import * as React from "react";
import {useSelector} from "react-redux";
import {logger} from "../../dev_utils/log_data";

interface Props {
    handleOnInsertComponent?: any;
    onChange?: any;
    searchValue?: string;
    editorKey?: any;
    content: any[];
}

function EditorComponent(props: Props) {
    let {searchValue} = useSelector((state: any) => state.uiReducer);
    const {all_friends} = useSelector((state: any) => state.filesReducer);
    let content = props.content
    if (props.content.length == 0) {
        content = [{type: "p", children: [{text: ""}]}];
    }
    return (
        <Editor
            insertFooter={true}
            componentsOptions={[
                {...table},
                {
                    "type": "code-block",
                    "language": "typescript",
                    "children": [

                        {
                            "type": "code-line",
                            "children": [{"text": ""}]
                        },

                    ]
                },
                data_grid,
                payment_contract,
                {type: "accumulative_contract"},
                {type: "custom_contract"},
            ]}
            onInsertComponent={props.handleOnInsertComponent}
            mentionOptions={all_friends ? all_friends.map((i) => i.name) : []}
            key={props.editorKey} // Add key prop to trigger re-render
            onChange={props.onChange}
            renderElement={EditorRenderer}
            searchOptions={"gi"}
            search={searchValue || ""}
            data={content}
        />
    )
}

export default EditorComponent;