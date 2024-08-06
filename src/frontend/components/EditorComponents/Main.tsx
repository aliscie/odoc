import * as React from "react";
import { dataGrid, paymentContract, sharesContract, slateCustomContract } from "../../DataProcessing/dataSamples";
import {EditorRenderer} from "./EditorRenderer";
import Editor from "odoc-editor";
import {useSelector} from "react-redux";

interface Props {
    handleOnInsertComponent?: any;
    onChange?: any;
    searchValue?: string;
    editorKey?: any;
    content: any[];
    contentEditable?: boolean;
}

function EditorComponent(props: Props) {
    let {searchValue} = useSelector((state: any) => state.uiState);
    const {all_friends} = useSelector((state: any) => state.filesState);
    let content = props.content
    if (props.content.length == 0) {
        content = [{type: "p", children: [{text: ""}]}];
    }

    return (
        <>
            <Editor
                contentEditable={props.contentEditable}
                insertFooter={true}
                componentsOptions={[
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
                    slateCustomContract,
                    dataGrid,
                    paymentContract,
                    sharesContract,
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
                {...props}
            />

        </>
    )
}

export default EditorComponent;
