import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Editor from "odoc-editor";
import {EditorRenderer} from "../components/editor_components/editor_renderer";

export function useFormulaDialog(saveFormula) {

    const [open, setOpen] = React.useState(false);
    const [formula, setFormula] = React.useState('');
    const [columnId, setColId] = React.useState('');

    const handleClickOpen = (column) => {
        setColId(column.id);
        setFormula(column.dataValidator)
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        saveFormula(columnId, formula)
        handleClose()
    }

    const dialog = (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent style={{width: "500px"}}>
                    <Editor
                        insertFooter={false}
                        autoCompleteOptions={[
                            "COL('name')",
                            "COL('amount')",
                            "COL('sender')",
                            "COL('receiver')",
                            "Apple",]}
                        onChange={setFormula}
                        renderElement={EditorRenderer}
                        searchOptions={"gi"}
                        data={
                            [{
                                "type": "code-block",
                                "language": "typescript",
                                "children": [

                                    {
                                        "type": "code-line",
                                        "children": [{
                                            text: formula[0] || ""
                                        }]
                                    },

                                ]
                            },]
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSave} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    return {dialog, handleClickOpen};
}
