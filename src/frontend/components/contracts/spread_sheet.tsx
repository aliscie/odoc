import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {styled, Theme} from '@mui/material/styles';
import {process_row} from "../../data_processing/normalize/normalize_tables";

// import { DataGridPro } from '@mui/x-data-grid-pro';


function customCheckbox(theme: Theme) {
    // ... your existing customCheckbox implementation
}

const TableContainer = styled('div')({
    width: '800px', // Set the desired width for the table container
    margin: '0 auto', // Center the table within the container
});

// export const StyledDataGrid = styled(DataGridPro)(({theme}) => ({
export const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    border: 0,
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },

    // ...customCheckbox(theme),

    // Custom styling for borders
    '& .MuiDataGrid-root': {
        border: `1px solid #ccc`, // Border for the entire grid
    },
    '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell:first-child': {
        borderLeft: `1px solid #ccc`, // Border for the first column
    },
    '& .MuiDataGrid-row': {
        '&:last-child .MuiDataGrid-cell': {
            borderBottom: 'none', // Remove bottom border for the last row
        },
    },
}));

export default function SpreadSheet(props: any) {
    let table = props.data[0].Table;
    let rows = process_row(table.rows);

    return (
        <TableContainer>
            <StyledDataGrid
                rows={rows}
                columns={table.columns}
                autoHeight // Add the autoHeight prop to remove extra space
            />
        </TableContainer>
    );
}
