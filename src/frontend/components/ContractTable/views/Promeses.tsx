import DataGridSheet from "../../DataGrid";
import React from "react";
import {textEditor} from "react-data-grid";
import {senderDropDown} from "../renders/senderDropDown";
import {statusDropDown} from "../renders/statusDropDown";
import {receiverDropDown} from "../renders/receiverDropDown";
import {CCell, CPayment, PaymentStatus} from "../../../../declarations/backend/backend.did";
import {Principal} from "@dfinity/principal";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../../redux/store/handleRedux";
import {renderSender} from "../renders/renderSender";
import {renderReceiver} from "../renders/renderReciver";
import {logger} from "../../../DevUtils/logData";


function Promises(props) {
    const {profile} = useSelector((state: any) => state.filesState);
    const dispatch = useDispatch();

    let rows = props.contract.promises.map((promise, index) => {
        if (promise.cells.length > 0) {
            console.log({xxx: promise.cells})
            columns.push({
                key: 'cells',
                name: 'cells',
                width: 'max-content',
                renderEditCell: textEditor,
                frozen: true,
            })

        }
        return {
            id: promise.id,
            receiver: promise.receiver.toString(),
            sender: promise.sender.toString(),
            amount: promise.amount,
            status: Object.keys(promise.status)[0],
        }
    });

    if (rows.length === 0) {
        rows = [
            {
                id: "0",
                receiver: Principal.fromText("2vxsx-fae").toString(),
                sender: Principal.fromText(profile.id).toString(),
                amount: 0,
                status: "pending",
            }
        ]
    }

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
            renderCell: renderReceiver,
            frozen: true,

        },
        {
            key: 'sender',
            name: 'sender',
            width: 'max-content',
            frozen: true,
            renderCell: renderSender,
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

    function onChangeRow(rows, column) {

        let promises = rows.map((row) => {
            let status = {}
            status[row.status] = null;
            let updatedPayment: CPayment = {
                'id': row.id,
                'status': status as PaymentStatus,
                'date_created': 0,
                'date_released': 0,
                'cells': [],
                'contract_id': props.contract.id,
                'sender': Principal.fromText(profile.id),
                'amount': Number(row.amount),
                'receiver': Principal.fromText("2vxsx-fae"),
            }
            return updatedPayment
        });
        let updateContract = {...props.contract, promises}
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updateContract}));
    }

    function onDeleteRow(id) {
        let promises = props.contract.promises.filter((row) => row.id !== id)
        let updateContract = {...props.contract, promises}
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updateContract}));
    }

    function onAddColumn() {
        let promises = props.contract.promises.map((p) => {
            let newCell: CCell = {'field': '', 'value': ''}
            p.cells.push(newCell)
            return p
        });
        let updateContract = {...props.contract, promises}
        logger({updateContract})
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updateContract}));
    }

    return (
        <DataGridSheet
            onDeleteRow={onDeleteRow}
            onChangeRow={onChangeRow}
            onAddColumn={onAddColumn}
            initRows={rows}
            initColumns={columns}
        />
    )
}

export default Promises;
