import * as React from 'react';
import {
    GridColDef,
    GridRenderEditCellParams,
    GridRowModel,
    GridValueGetterParams,
    useGridApiContext
} from '@mui/x-data-grid';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import {StyledDataGrid} from "./spread_sheet";
import FreeSoloCreateOption from "../genral/auto_complete";
import {useDispatch, useSelector} from "react-redux";
import {contract_sample, randomString} from "../../data_processing/data_samples";
import {handleRedux} from "../../redux/main";

function ReleaseButton({released, onClick}: { released: boolean, onClick: () => void }) {
    const [open, setOpen] = React.useState(false);
    const [is_released, setReleased] = React.useState(released);

    const handleClick = () => {
        setOpen(true);
    };

    const handleConfirm = () => {
        setOpen(false);
        setReleased(true)
        onClick();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                disabled={is_released}
                onClick={handleClick}
                variant="outlined"
                color={released ? 'success' : 'primary'}
            >
                {released ? 'Released' : 'Release'}
            </Button>
            <Dialog open={open} onClose={handleCancel}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure you want to release?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


function handleRelease(id: number) {
    // Perform release logic here
    // Update the 'released' property of the corresponding row
    // Set the state or dispatch an action to update the data
}


export default function PaymentContract(props: any) {
    // const [gridData, setGridData] = useState([]);
    const dispatch = useDispatch();

    const {files_content, current_file, contracts, all_friends} = useSelector((state: any) => state.filesReducer);
    let content = files_content[current_file.id];

    // ToDo  `props.data[0]` instead of `props.children[0].data[0]`
    let table_content = props.children[0]
    let init_rows = table_content.data[0].Table.rows
    let normalized_row = init_rows.map((row: any) => {
        let contract = contracts[row.Contract.PaymentContract]
        let receiver = all_friends.filter((friend: any) => friend.id === contract.receiver.toString())[0]
        return {
            id: row.Contract.PaymentContract,
            username: receiver && receiver.name,
            amount: contract.amount,
            released: contract.released,
        }
    });

    function CustomEditComponent(props: GridRenderEditCellParams) {
        props.value = props.row.username;
        const {id, value, field} = props;
        const apiRef = useGridApiContext();

        const handleValueChange = (event: any) => {
            apiRef.current.setEditCellValue({id, field, value: event.name});
        };
        return <FreeSoloCreateOption onChange={handleValueChange} options={all_friends} value={value}/>
    }

    const init_columns: GridColDef[] = [
        {
            field: 'username',
            headerName: 'Username',
            width: 250,
            editable: true,
            // renderCell: (params: GridValueGetterParams) => (
            //     <FreeSoloCreateOption options={all_friends} value={params.row.username}/>
            // ),
            renderEditCell: CustomEditComponent,
        },
        {field: 'amount', headerName: 'Amount', width: 150, editable: true},
        {
            field: 'release',
            headerName: 'Release',
            width: 300,
            editable: false,
            renderCell: (params: GridValueGetterParams) => (
                <>
                    <ReleaseButton
                        released={params.row.released}
                        onClick={() => handleRelease(params.row.id)}
                    />
                    <Button>Cancel</Button>
                </>
            ),
        },
    ];


    let [columns, setColumns] = React.useState(init_columns)

    const handleAddRow = () => {
        // const newRow = {id: randomString(), username: '', amount: 0, released: false};
        let id = randomString();
        let contract = contract_sample;
        contract.contract_id = id;
        const newRow = {"Contract": {"PaymentContract": id}}
        content.map((item: any) => {
            if (item.id == props.id) {
                item.children.map((child) => {
                    if (child.data && child.id == table_content.id) {
                        child.data[0].Table.rows = [...child.data[0].Table.rows, newRow];
                    }
                })
            }
        })
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: content}));
        dispatch(handleRedux("ADD_CONTRACT", {id, contract}));
        // setRows([...rows, newRow]);
    };

    const handleAddColumn = () => {
        const newColumn: GridColDef = {
            field: `column${columns.length + 1}`,
            headerName: `Column ${columns.length + 1}`,
            width: 150,
            editable: true,
        };
        setColumns([...columns, newColumn]);
    };
    const processRowUpdate = React.useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) => {
            console.log('Updated row:', newRow);
            console.log('Old row:', oldRow);
            const index = table_content.data[0].Table.rows.findIndex((row) => row.id === oldRow.id);
            content.map((item: any) => {
                if (item.id == props.id) {
                    item.children.map((child) => {
                        if (child.data && child.id == table_content.id) {
                            child.data[0].Table.rows[index] = newRow
                        }
                    })
                }
            })
            dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: content}));
            let id = oldRow.id;
            let contract = {
                "contract_id": id,
                "sender": "",
                "released": newRow.released,
                "confirmed": newRow.confirmed,
                "amount": newRow.amount,
                "receiver": all_friends.filter((friend: any) => friend.name === newRow.username)[0].id,
            }

            dispatch(handleRedux("UPDATE_CONTRACT", {id, contract}));
            return Promise.resolve(newRow);
        },
        []
    );

    const handleProcessRowUpdateError = React.useCallback(
        (params: any) => {
            console.log('An error occurred while updating the row with params:', params);
            return Promise.resolve();
        }
        , []
    );

    return (
        <div contentEditable={false}
             style={{maxHeight: "25%", maxWidth: '100%'}}
        >
            <StyledDataGrid
                rows={normalized_row}
                columns={columns}
                disableColumnMenu
                disableColumnSelector
                hideFooterPagination
                components={{
                    Toolbar: () => (
                        <span style={{display: 'flex'}}>
                            <Button size={"small"} onClick={handleAddRow} variant="text" color="primary">
                                Add Row
                            </Button>
                            <Button size={"small"} onClick={handleAddColumn} variant="text" color="primary">
                                Add Column
                            </Button>
                        </span>
                    ),
                }}
                editMode="row"
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}

            />


        </div>
    );
}
