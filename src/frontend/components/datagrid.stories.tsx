import React from 'react';
import {Meta, Story} from '@storybook/react';
import CustomDataGrid from './datagrid';
import {Button} from '@mui/material';

const meta: Meta = {
    title: 'Components/CustomDataGrid',
    component: CustomDataGrid,
    argTypes: {
        addRow: {action: 'addRow'},
        deleteRow: {action: 'deleteRow'},
        updateRow: {action: 'updateRow'},
        addColumn: {action: 'addColumn'},
        deleteColumn: {action: 'deleteColumn'},
    },
};

export default meta;

const Template: Story<Props> = (args) => <CustomDataGrid {...args} />;

export const Default = Template.bind({});
Default.args = {
    data: {
        rows: [{id: '1', name: 'John Doe', age: 30}, {id: '2', name: 'Jane Smith', age: 25}],
        columns: [
            {field: 'id', headerName: 'ID', width: 70},
            {field: 'name', headerName: 'Name', width: 130},
            {field: 'age', headerName: 'Age', width: 130},
        ],
    },
    tools: <Button>Tools Button</Button>,
    addRow: (index) => ({id: (index + 1).toString(), name: '', age: ''}),
    deleteRow: (rows, rowId) => rows.filter(row => row.id !== rowId),
    updateRow: (rows, updatedRow) => rows.map(row => row.id === updatedRow.id ? updatedRow : row),
    addColumn: (index) => ({field: `newColumn${index}`, headerName: `New Column ${index}`, width: 150}),
    deleteColumn: (columns, colId) => columns.filter(col => col.id !== colId),
};

export const WithAdditionalProps = Template.bind({});
WithAdditionalProps.args = {
    ...Default.args,
    slotProps: {},
    columnMenuSlots: {},
    columnMenuProps: (props) => props,
};
