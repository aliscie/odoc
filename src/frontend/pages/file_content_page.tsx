import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import {useEffect} from "react";
import {handleRedux} from "../redux/main";
import {payment_contract_sample} from "../data_processing/data_samples";
import {FileNode} from "../../declarations/user_canister/user_canister.did";
import EditorComponent from "../components/editor_components/main";
import {Typography} from "@mui/material";


function FileContentPage(props: any) {

    const {current_file, files_content} = useSelector((state: any) => state.filesReducer);


    let [title, setTitle] = React.useState(current_file.name);


    const dispatch = useDispatch();


    function onChange(changes: any) {
        if (files_content[current_file.id] !== changes) {
            dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
            dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: changes}));
        }
    }

    // const history = useHistory();


    const editorKey = current_file.name || ""; // Provide a key based on current_file.name
    let handleTitleKeyDown = (e: any) => {
        setTitle(e.target.innerText);
        // history.push(e.target.innerText.replace(""));
    };
    let preventEnter = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }

    };

    useEffect(() => {
        let timeout = setTimeout(() => {

            if (title !== current_file.name) {
                let file: FileNode = {
                    ...current_file,
                    name: title,
                    parent: current_file.parent,
                    children: current_file.children,
                    share_id: current_file.share_id || []
                };
                dispatch(handleRedux("UPDATE_FILE_TITLE", {id: current_file.id, title: title}));
                dispatch(handleRedux("FILE_CHANGES", {changes: file}));
            }
        }, 250);
        return () => clearTimeout(timeout);
    }, [title])


    function handleOnInsertComponent(e: any, component: any) {
        switch (component.type) {
            case "payment_contract":
                dispatch(handleRedux("ADD_CONTRACT", {contract: payment_contract_sample}))
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: payment_contract_sample}));
            case "shares_contract":

            // let payment = {
            //     "contract_id": contract_id,
            //     "sender": Principal.fromText("2vxsx-fae"),
            //     "receiver": Principal.fromText("2vxsx-fae"),
            //     "released": false,
            //     "confirmed": false,
            //     "canceled": false,
            //     "amount": BigInt(0),
            // }

            // let share1 = {
            //     contract_id: ContractId,
            //     receiver: Principal,
            //     share: u64,
            // }

            // let shares_contract = {
            //     shares: [share1, share2],
            //     payments: [payment, payment]
            // };
            // dispatch(handleRedux("ADD_CONTRACT", {contract: shares_contract}))
            // dispatch(handleRedux("CONTRACT_CHANGES", {changes: shares_contract}));
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


        return (
            <div style={{marginTop: "3px", marginLeft: "10%", marginRight: "10%"}}>

                {current_file.name && (
                    <>
                        <Typography
                            variant="h3"
                            onKeyDown={preventEnter}
                            onKeyUp={handleTitleKeyDown}
                            contentEditable={true}>{current_file.name}</Typography>
                        <EditorComponent
                            handleOnInsertComponent={handleOnInsertComponent}
                            onChange={onChange}
                            editorKey={editorKey}
                            content={content || []}
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
