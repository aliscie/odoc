import DataGridSheet from "../../DataGrid";
import React from "react";
import {textEditor} from "react-data-grid";
import {senderDropDown} from "../renders/senderDropDown";
import {statusDropDown} from "../renders/statusDropDown";
import {receiverDropDown} from "../renders/receiverDropDown";


function Payments(props) {

    // let rows = [{
    //     id: `id_${0}`,
    //     receiver: "dummy",
    //     sender: "dummy",
    //     amount: "",
    //     status: "payment",
    // }];
    let rows = [];

    let columns = [
        // SelectColumn,
        // {
        //     key: 'id',
        //     name: 'ID',
        //     width: 30,
        //     resizable: true,
        //     frozen: true,
        // },
        {
            key: 'receiver',
            name: 'receiver',
            width: 'max-content',
            renderEditCell: receiverDropDown,
            frozen: true,

        },
        {
            key: 'sender',
            name: 'sender',
            width: 'max-content',
            frozen: true,
            renderEditCell: senderDropDown,
        },
        {
            key: 'amount',
            name: 'amount',
            width: 'max-content',
            renderEditCell: textEditor,
            frozen: true,
        },
        {
            key: 'status',
            name: 'status',
            width: 'max-content',
            renderEditCell: statusDropDown,
            frozen: true,
            // resizable: true,
            // sortable: true,
            // draggable: true
        },

    ];


    return (
        <DataGridSheet
            initRows={rows}
            initColumns={columns}
        />
    )
}

export default Payments;
