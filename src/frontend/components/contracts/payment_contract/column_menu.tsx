import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import {GridColumnMenu, GridColumnMenuItemProps, GridColumnMenuProps,} from '@mui/x-data-grid';
import {Input} from "@mui/material";

// import {useDemoData} from '@mui/x-data-grid-generator';

function CustomUserItem(props: GridColumnMenuItemProps) {
    const {myCustomHandler, myCustomValue} = props;
    return (
        <MenuItem onClick={myCustomHandler}>
            <ListItemIcon>
                <Input placeholder={"rename"}/>
            </ListItemIcon>
        </MenuItem>
    );
}

function DeleteColumnMenuItem(props: GridColumnMenuItemProps) {
    const {handleDeleteColumn, myCustomValue} = props;
    return (
        <MenuItem onClick={() => handleDeleteColumn(props.colDef.field)}>
            <ListItemIcon>
                Delete column
            </ListItemIcon>
        </MenuItem>
    );
}

function CustomColumnMenu(props: GridColumnMenuProps) {
    const itemProps = {
        colDef: props.colDef,
        onClick: props.hideMenu,
    };

    let slots = {}
    if (!['sender', 'receiver', "amount", "release"].includes(itemProps.colDef.field)) {
        slots = {
            columnMenuUserItem: CustomUserItem,
            DeleteColumnMenuItem,
        };
    }
    return (
        <GridColumnMenu
            {...props}
            slots={slots}
            slotProps={{
                columnMenuUserItem: {
                    // set `displayOrder` for new item
                    displayOrder: 1,
                    // pass additional props
                    // myCustomValue: 'Do custom action',
                    // myCustomHandler: () => alert('Custom handler fired'),
                },
                DeleteColumnMenuItem: {
                    displayOrder: 2,
                    // handleDeleteColumn
                }
            }}
        />
    );
}

// export default function AddNewColumnMenuGrid() {
//     const {data} = useDemoData({
//         dataSet: 'Commodity',
//         rowLength: 20,
//         maxColumns: 5,
//     });
//
//     return (
//         <div style={{height: 400, width: '100%'}}>
//             <DataGrid {...data} slots={{columnMenu: CustomColumnMenu}}/>
//         </div>
//     );
// }
export default CustomColumnMenu