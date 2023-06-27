import * as React from 'react';
import {DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector,} from '@mui/x-data-grid';
import {useDemoData} from '@mui/x-data-grid-generator';
import {styled, Theme} from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import {process_row} from "../../data_processing/normalize/normalize_tables";

function customCheckbox(theme: Theme) {
    return {
        '& .MuiCheckbox-root svg': {
            width: 16,
            height: 16,
            backgroundColor: 'transparent',
            border: `1px solid var(--color)`,
            borderRadius: 2,
        },
        '& .MuiCheckbox-root svg path': {
            display: 'none',
        },
        '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
            backgroundColor: "var(--secondary-background-color)",
            borderColor: '#1890ff',
        },
        '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
            position: 'absolute',
            display: 'table',
            border: '2px solid #fff',
            borderTop: 0,
            borderLeft: 0,
            transform: 'rotate(45deg) translate(-50%,-50%)',
            opacity: 1,
            transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
            content: '""',
            top: '50%',
            left: '39%',
            width: 5.71428571,
            height: 9.14285714,
        },
        '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
            width: 8,
            height: 8,
            backgroundColor: '#1890ff',
            transform: 'none',
            top: '39%',
            border: 0,
        },
    };
}

export const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    border: 0,
    color: "var(--color)",
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
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: "var(--background-color)",
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: `1px solid var(--color)`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid var(--color)`,
    },
    '& .MuiDataGrid-cell': {
        color: "var(--text-color)",
    },
    // '& .MuiPaginationItem-root': {
    //     borderRadius: 0,
    // },
    // ...customCheckbox(theme),
}));

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            page={page + 1}
            // count={pageCount}
            // @ts-expect-error
            // renderItem={(props2: any) => <PaginationItem {...props2} disableRipple/>}
            onChange={(event: React.ChangeEvent<unknown>, value: number) =>
                apiRef.current.setPage(value - 1)
            }
        />
    );
}

const PAGE_SIZE = 5;

export default function SpreadSheet(props: any) {
    const {data} = useDemoData({
        dataSet: 'Commodity',
        rowLength: 10,
        maxColumns: 10,
    });

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: PAGE_SIZE,
        page: 0,
    });

    let table = props.data[0].Table;
    let rows = process_row(table.rows)

    return (
        <StyledDataGrid
            // checkboxSelection
            // paginationModel={paginationModel}
            // onPaginationModelChange={setPaginationModel}
            // pageSizeOptions={[PAGE_SIZE]}
            // slots={{
            //     pagination: CustomPagination,
            // }}
            rows={rows}
            columns={table.columns}
        />
    );
}