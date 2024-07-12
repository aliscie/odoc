import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {handleRedux} from '../redux/main';
import {custom_contract, shares_contract_sample} from '../data_processing/data_samples';
import {FileNode, StoredContract} from '../../declarations/backend/backend.did';
import EditorComponent from '../components/editor_components/main';
import debounce from '../utils/debounce';
import {Principal} from '@dfinity/principal';

interface Props {
}

const FileContentPage: React.FC<Props> = () => {
    const dispatch = useDispatch();
    const {current_file, files_content, profile} = useSelector((state: any) => state.filesReducer);

    const editorKey = current_file && current_file.id || '';

    const onChange = useCallback((changes: any) => {
        if (current_file && files_content[current_file.id] !== changes) {
            dispatch(handleRedux('UPDATE_CONTENT', {id: current_file.id, content: changes}));
            dispatch(handleRedux('CONTENT_CHANGES', {id: current_file.id, changes}));
        }
    }, [dispatch, files_content, current_file]);

    const handleInputChange = useCallback(
        debounce((title: string) => {
            if (title !== current_file.name) {
                const file: FileNode = {
                    ...current_file,
                    name: title,
                    parent: current_file.parent,
                    children: current_file.children,
                    share_id: current_file.share_id || [],
                };
                dispatch(handleRedux('UPDATE_FILE_TITLE', {id: current_file.id, title}));
            }
        }, 250),
        [dispatch, current_file]
    );

    const handleTitleKeyDown = useCallback((e: any) => {
        const title = e[0].children[0].text;
        handleInputChange(title);
    }, [handleInputChange]);

    const preventEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLElement).blur();
        }
    };

    function handleOnInsertComponent(e: any, component: any) {
        const insertText = () => {
            e.apply({
                type: 'insert_text',
                path: [0, 0],
                offset: 15,
                text: ' ',
            });
        }

        switch (component.type) {
            case "shares_contract":
                let new_contract = {...shares_contract_sample, author: profile.id};
                let stored_shares: StoredContract = {"SharesContract": new_contract}
                dispatch(handleRedux("ADD_CONTRACT", {contract: new_contract}))
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: stored_shares}));
                insertText();
                return null
            case "custom_contract":
                custom_contract.creator = Principal.fromText(profile.id)
                custom_contract.date_created = Date.now() * 1e6
                let stored_custom: StoredContract = {"CustomContract": custom_contract}
                dispatch(handleRedux("ADD_CONTRACT", {contract: custom_contract}))
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: stored_custom}));
                insertText();
                return null;


            case "data_grid":
                return null
            default:
                return null;
            // case "data_grid":
            //     dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract_sample}));

        }

    }

    if (!current_file) {
        return <span>404 Not Found</span>;
    }

    const content = files_content[current_file.id] || [];
    const title = current_file.name || 'Untitled';
    const editable =
        current_file.author === profile.id ||
        Object.keys(current_file.permission)[0] === 'CanUpdate' ||
        current_file.users_permissions.some(([userId, permissions]) => userId === profile.id && permissions.CanUpdate);

    return (
        <div style={{marginTop: '3px', marginLeft: '10%', marginRight: '10%'}}>
            <EditorComponent
                preventSplit={true}
                preventToolbar={true}
                onChange={handleTitleKeyDown}
                contentEditable={editable}
                editorKey={editorKey}
                content={[{type: 'h1', children: [{text: title}]}]}
            />
            <EditorComponent
                contentEditable={editable}
                handleOnInsertComponent={handleOnInsertComponent}
                onChange={onChange}
                editorKey={editorKey}
                content={content}
            />
        </div>
    );
};

export default FileContentPage;
