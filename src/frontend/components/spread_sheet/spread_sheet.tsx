import * as React from 'react';
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import {process_row} from "../../data_normalization/process_table_rows";

// const columns: GridColDef[] = [
//     {
//         field: 'Column 1',
//         headerClassName: 'super-app-theme--header',
//         headerAlign: 'center',
//         width: 140,
//     },
//     {
//         field: 'Column 2',
//         headerClassName: 'super-app-theme--header',
//         headerAlign: 'center',
//         width: 140,
//     },
// ];
//
// const rows = [
//     {
//         id: 1,
//         first: 'Jane',
//         last: 'Carter',
//     },
//     {
//         id: 2,
//         first: 'Jack',
//         last: 'Smith',
//     },
//     {
//         id: 3,
//         first: 'Gill',
//         last: 'Martin',
//     },
// ];


export default function SpreadSheet(props: any) {
    let table = props.data[0].Table;
    let rows = process_row(table.rows)

    return (
        <Box
            contentEditable={false}
            sx={{

                // height: 300,
                // width: '100%',
                // '& .super-app-theme--header': {
                //     backgroundColor: 'rgba(255, 7, 0, 0.55)',
                // },
            }}
        >
            <DataGrid
                style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}
                editMode="row"
                rows={rows}
                columns={table.columns}
                // disableColumnMenu
                // disablePagination
            />
        </Box>
    );
}