import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Editor from "odoc-editor";
import {EditorRenderer} from "../components/editor_components/editor_renderer";

export function useFormulaDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dialog = (
        <div>
            <Dialog
                // style={{width: "900px"}}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {/*<DialogTitle id="alert-dialog-title">*/}
                {/*    {"Use Google's location service?"}*/}
                {/*</DialogTitle>*/}
                <DialogContent style={{width: "500px"}}>
                    <Editor
                        // componentsOptions={[
                        //     {...table},
                        //     {type: 'code-block', language: 'typescript', children: [{text: ""}]},
                        //     payment_contract,
                        //     {type: "accumulative_contract"},
                        //     {type: "custom_contract"},
                        // ]}
                        // onInsertComponent={props.handleOnInsertComponent}
                        // mentionOptions={all_friends ? all_friends.map((i) => i.name) : []}
                        // key={props.editorKey} // Add key prop to trigger re-render
                        // onChange={props.onChange}
                        renderElement={EditorRenderer}
                        searchOptions={"gi"}
                        // search={searchValue || ""}
                        data={[{type: 'code-block', language: 'typescript', children: [{text: ""}]}]}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleClose} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    return {dialog, handleClickOpen};
}
