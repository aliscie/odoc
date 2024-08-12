import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FileNode} from '../../declarations/backend/backend.did';
import debounce from '../utils/debounce';
import {Input} from "@mui/material";
import {handleRedux} from "../redux/store/handleRedux";
import EditorComponent from "../components/EditorComponents/editor_component";

interface Props {
}

const FileContentPage: React.FC<Props> = () => {
    const dispatch = useDispatch();
    const {current_file, files_content, profile} = useSelector((state: any) => state.filesReducer);

    // const [title, setTitle] = React.useState(current_file.name || 'Untitled')

    const editorKey = current_file && current_file.id || '';
    const onChange = (changes: any) => {
        if (current_file) {
            dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
        }
    }
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


    const handleTitleKeyDown = useCallback((title: string) => {
        handleInputChange(title);
        // setTitle(title);
    }, [handleInputChange]);

    const preventEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLElement).blur();
        }
    };


    if (!current_file) {
        return <span>404 Not Found</span>;
    }


    const editable =
        current_file.author === profile.id ||
        Object.keys(current_file.permission)[0] === 'CanUpdate' ||
        current_file.users_permissions.some(([userId, permissions]) => userId === profile.id && permissions.CanUpdate);

    return (
        <div style={{marginTop: '3px', marginLeft: '10%', marginRight: '10%'}}>
            <Input
                key={current_file.id}
                inputProps={{
                    style: {
                        width: '100%',
                        fontSize: '1.5rem',
                        overflow: 'visible',
                        whiteSpace: 'nowrap'
                    }
                }}
                defaultValue={current_file.name}
                // value={current_file.name}
                placeholder="Untitled"
                onKeyDown={preventEnter}
                onChange={(e) => handleTitleKeyDown(e.target.value)}
            />
            <EditorComponent
                id={current_file.id}
                contentEditable={editable}
                onChange={onChange}
                editorKey={editorKey}
                content={files_content[current_file.id]}
            />
        </div>
    );
};

export default FileContentPage;
