import * as React from 'react';
import {GridColDef, GridValueGetterParams} from '@mui/x-data-grid';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import {StyledDataGrid} from "./spread_sheet";
import FreeSoloCreateOption from "../genral/auto_complete";
import {useSelector} from "react-redux";

const usernames = [
    'John',
    'Jane',
    'Alice',
    'Bob',
    'Charlie',
    // Add more usernames here
];


const init_columns: GridColDef[] = [
    {
        field: 'username',
        headerName: 'Username',
        width: 250,
        editable: false,
        renderCell: (params: GridValueGetterParams) => (
            <FreeSoloCreateOption options={usernames} value={params.row.username}/>
        ),
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

// const init_rows = [
//     {id: 1, username: 'John', amount: 100, released: false},
//     {id: 2, username: 'Jane', amount: 200, released: true},
//     {id: 3, username: 'Alice', amount: 150, released: false},
// ];

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

function handleUsernameChange(id: number, value: string | null) {
    // Update the 'username' property of the corresponding row
    // Set the state or dispatch an action to update the data
}

function handleRelease(id: number) {
    // Perform release logic here
    // Update the 'released' property of the corresponding row
    // Set the state or dispatch an action to update the data
}


export default function PaymentContract(props: any) {
    const {contracts} = useSelector((state: any) => state.filesReducer);
    console.log({contracts, props});


    let init_rows = props.children[0].data[0].Table.rows
    let normalized_row = init_rows.map((row: any) => {
        let contract = contracts[row.Contract.PaymentContract]
        console.log({contract});
        return {
            id: row.Contract.PaymentContract,
            username: contract.receiver.name,
            amount: contract.amount,
            released: contract.released,
        }
    });
    let [rows, setRows] = React.useState(normalized_row)
    let [columns, setColumns] = React.useState(init_columns)
    // ToDo this should be instead // let t_rows = props.data

    // const handleAddRow = () => {
    //     const newRow = {id: rows.length + 1, username: '', amount: 0, released: false};
    //     setRows([...rows, newRow]);
    // };
    //
    // const handleAddColumn = () => {
    //     const newColumn: GridColDef = {
    //         field: `column${columns.length + 1}`,
    //         headerName: `Column ${columns.length + 1}`,
    //         width: 150,
    //         editable: true,
    //     };
    //     setColumns([...columns, newColumn]);
    // };

    return (
        <div contentEditable={false}
            // style={{height: 300, width: '100%'}}
        >
            <StyledDataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu
                disableColumnSelector
                hideFooterPagination
                // components={{
                //     Toolbar: () => (
                //         <>
                //             <Button onClick={handleAddRow} variant="outlined" color="primary">
                //                 Add Row
                //             </Button>
                //             <Button onClick={handleAddColumn} variant="outlined" color="primary">
                //                 Add Column
                //             </Button>
                //         </>
                //     ),
                // }}
            />


        </div>
    );
}
