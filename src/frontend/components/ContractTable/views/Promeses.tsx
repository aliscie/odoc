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
import {renderUser} from "../renders/renderUser";
import {renderStatusCell} from "../renders/renderStatusCell";
import rowToCells from "../serializers/rowToCells";
import {logger} from "../../../DevUtils/logData";

export const MAIN_FIELDS = ['id', 'sender', 'receiver', 'receiver', 'amount', 'status']


function Promises(props) {

    const {profile} = useSelector((state: any) => state.filesState);
    const dispatch = useDispatch();


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
            renderCell: renderUser,
            frozen: true,

        },
        {
            key: 'sender',
            name: 'sender',
            width: 'max-content',
            frozen: true,
            renderCell: renderUser,
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
            renderCell: renderStatusCell,
            frozen: true,
            // resizable: true,
            // sortable: true,
            // draggable: true
        },

    ];

    let newColumns = {};
    let rows = props.contract.promises.map((promise, index) => {
        if (promise.cells.length > 0) {

            promise.cells.forEach((cell) => {
                newColumns[cell.field] = cell.value
            });


        }
        return {
            id: promise.id,
            receiver: promise.receiver.toString(),
            sender: promise.sender.toString(),
            amount: promise.amount,
            status: Object.keys(promise.status)[0],
            ...newColumns,
        }
    });

    Object.keys(newColumns).forEach(key => {
        if (!columns.find(c => c.key == key)) {
            columns.push({
                key: key,
                name: key,
                width: 'max-content',
                renderEditCell: textEditor,
                frozen: false,
            })
        }


    })

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


    function onChangeRow(rows, column) {
        let promises = rows.map((row) => {
            let status = {}
            let cells = rowToCells(row)
            status[row.status] = null;
            let updatedPayment: CPayment = {
                'id': row.id,
                'status': status as PaymentStatus,
                'date_created': 0,
                'date_released': 0,
                cells,
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

    function onAddColumn(column: any) {
        let promises = props.contract.promises.map((p) => {
            let newCell: CCell = {field: column.key, value: column.name};
            return {
                ...p,
                cells: [...p.cells, newCell]
            };
        })
        let updateContract = {
            ...props.contract,
            promises
        };
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updateContract}));
    }

    function onRenameColumn(k, n) {

        let updateContract = {
            ...props.contract,
            promises: props.contract.promises.map((p) => {
                let cells = p.cells.map((c: CCell) => {
                    if (c.field == k) {
                        return {field: n, value: c.value}
                    }
                    return c
                })
                return {
                    ...p,
                    cells
                };
            })
        };
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updateContract}));


    }


    return (
        <DataGridSheet
            onRenameColumn={onRenameColumn}
            onDeleteRow={onDeleteRow}
            onChangeRow={onChangeRow}
            onAddColumn={onAddColumn}
            initRows={rows}
            initColumns={columns}
        />
    )
}

export default Promises;
