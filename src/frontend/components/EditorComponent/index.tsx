import * as React from "react";
import {useCallback} from "react";
// import {custom_contract, data_grid} from "../../data_processing/data_samples";
import {useDispatch, useSelector} from "react-redux";
import OdocEditor, {MyMentionItem} from "odoc_editor_v2";
import {Principal} from "@dfinity/principal";
import createContractPlugin, {CONTRACT_KEY} from "../ContractTable/ContractPlugin";
import debounce from "../../utils/debounce";
import TableChartIcon from '@mui/icons-material/TableChart';
import {handleRedux} from "../../redux/store/handleRedux";
import {custom_contract} from "../../DataProcessing/dataSamples";

interface Props {
    handleOnInsertComponent?: any;
    onChange?: any;
    searchValue?: string;
    editorKey?: any;
    content: any[];
    readOnly?: boolean;
    id?: string;

}

function EditorComponent(props: Props) {
    const dispatch = useDispatch();
    let {searchValue} = useSelector((state: any) => state.uiReducer);
    const {all_friends, profile} = useSelector((state: any) => state.filesReducer);
    let content = props.content
    if (props.content.length == 0) {
        content = [{type: "p", children: [{text: ""}]}];
    }
    let extraPlugins = [
        {plugin: createContractPlugin, key: CONTRACT_KEY, icon: TableChartIcon}
    ];
    const mentions: MyMentionItem[] = all_friends.map((i: any) => {
        return {key: i.id, text: i.name}
    });

    function handleOnInsertComponent(component: any, component_id: string) {
        switch (component.key) {
            case "custom_contract":
                custom_contract.id = component_id;
                custom_contract.creator = Principal.fromText(profile.id)
                custom_contract.date_created = Date.now() * 1e6
                dispatch(handleRedux("ADD_CONTRACT", {contract: custom_contract}))
                return null;

            case "data_grid":
                return null
            default:
                return null;
            // case "data_grid":
            //     dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract_sample}));

        }

    }


    const handleInputChange = useCallback(
        debounce((changes: string) => {
            if (changes !== content) {
                props.onChange(changes);
            }
        }, 250),
        [dispatch]
    );


    return (
        <div>
            <OdocEditor
                key={props.id}
                id={props.id || ""}
                readOnly={props.readOnly}
                initialValue={content}
                onChange={handleInputChange}
                extraPlugins={extraPlugins}
                onInsertComponent={handleOnInsertComponent}
                userMentions={mentions}
            />

            {/*<Editor*/}
            {/*    contentEditable={props.contentEditable}*/}
            {/*    insertFooter={true}*/}
            {/*    componentsOptions={[*/}
            {/*        {*/}
            {/*            "type": "code-block",*/}
            {/*            "language": "typescript",*/}
            {/*            "children": [*/}

            {/*                {*/}
            {/*                    "type": "code-line",*/}
            {/*                    "children": [{"text": ""}]*/}
            {/*                },*/}

            {/*            ]*/}
            {/*        },*/}
            {/*        slate_Custom_contract,*/}
            {/*        data_grid,*/}
            {/*        payment_contract,*/}
            {/*        {type: "custom_contract"},*/}
            {/*    ]}*/}
            {/*    onInsertComponent={props.handleOnInsertComponent}*/}
            {/*    mentionOptions={all_friends ? all_friends.map((i) => i.name) : []}*/}
            {/*    key={props.editorKey} // Add key prop to trigger re-render*/}
            {/*    onChange={props.onChange}*/}
            {/*    renderElement={EditorRenderer}*/}
            {/*    searchOptions={"gi"}*/}
            {/*    search={searchValue || ""}*/}
            {/*    data={content}*/}
            {/*    {...props}*/}
            {/*/>*/}

        </div>
    )
}

export default EditorComponent;
