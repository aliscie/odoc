import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import {useCallback} from "react";
import {handleRedux} from "../redux/main";
import {custom_contract, payment_contract_sample, shares_contract_sample} from "../data_processing/data_samples";
import {FileNode, StoredContract} from "../../declarations/user_canister/user_canister.did";
import EditorComponent from "../components/editor_components/main";
import debounce from "../utils/debounce";
import {Principal} from "@dfinity/principal";


function FileContentPage() {

    const {current_file, files_content, profile} = useSelector((state: any) => state.filesReducer);

    const dispatch = useDispatch();

    function onChange(changes: any) {
        if (files_content[current_file.id] !== changes) {
            dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
            dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: changes}));
        }
    }

    const editorKey = current_file.name || ""; // Provide a key based on current_file.name

    const handleInputChange = useCallback(
        debounce((title: string) => {
            if (title !== current_file.name) {
                let file: FileNode = {
                    // id: current_file.id,
                    ...current_file,
                    name: title,
                    parent: current_file.parent,
                    children: current_file.children,
                    share_id: current_file.share_id || [],
                    // 'users_permissions': [],
                    // 'permission': {'None': null},
                    // author: profile.id,
                    // 'author' : string,
                    // 'permission': ShareFilePermission,
                    // 'users_permissions': Array < [Principal, ShareFilePermission] >,
                };
                dispatch(handleRedux("UPDATE_FILE_TITLE", {id: current_file.id, title: title}));
                dispatch(handleRedux("FILE_CHANGES", {changes: file}));
            }
        }, 250),
        []
    );


    let handleTitleKeyDown = (e: any) => {
        let title = e[0].children[0].text
        handleInputChange(title);
    };
    let preventEnter = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }

    };


    function handleOnInsertComponent(e: any, component: any) {
        switch (component.type) {
            case "payment_contract":
                let stored_payment: StoredContract = {"PaymentContract": payment_contract_sample}
                dispatch(handleRedux("ADD_CONTRACT", {contract: payment_contract_sample}))
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: stored_payment}));
            case "shares_contract":
                let new_contract = {...shares_contract_sample, author: profile.id};
                let stored_shares: StoredContract = {"SharesContract": new_contract}
                dispatch(handleRedux("ADD_CONTRACT", {contract: new_contract}))
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: stored_shares}));
            case "custom_contract":
                custom_contract.creator = Principal.fromText(profile.id)
                custom_contract.date_created = Date.now() * 1e6
                let stored_custom: StoredContract = {"CustomContract": custom_contract}
                dispatch(handleRedux("ADD_CONTRACT", {contract: custom_contract}))
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: stored_custom}));
            case "data_grid":
                return null;
            default:
                return null;
            // case "data_grid":
            //     dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract_sample}));

        }

    }


    if (current_file.id != null) {
        let content = files_content[current_file.id];
        let title = `${current_file.name || "Untitled"}`;
        let editable: boolean = current_file.author === profile.id
            || Object.keys(current_file.permission)[0] === "CanUpdate"
            || current_file.users_permissions.includes([profile.id, {"CanUpdate": null}]);

        return (
            <div style={{marginTop: "3px", marginLeft: "10%", marginRight: "10%"}}>

                <EditorComponent
                    preventSplit={true}
                    preventToolbar={true}
                    onChange={handleTitleKeyDown}
                    contentEditable={editable}
                    editorKey={current_file.id}
                    content={[{
                        "type": "h1",
                        "children": [{"text": title}]
                    }
                    ]}
                />

                <EditorComponent
                    contentEditable={editable}
                    handleOnInsertComponent={handleOnInsertComponent}
                    onChange={onChange}
                    editorKey={editorKey}
                    content={content || []}
                />
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
