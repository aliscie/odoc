import {table} from "../genral/editor_demo";
import {payment_contract} from "../../data_processing/data_samples";
import {EditorRenderer} from "./editor_renderer";
import Editor from "odoc-editor";
import * as React from "react";
import {useSelector} from "react-redux";

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

    return (
        <Editor
            componentsOptions={[
                {...table},
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
            data={props.content}
        />
    )
}

export default EditorComponent;