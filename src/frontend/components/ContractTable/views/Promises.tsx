import DataGridSheet from "../../DataGrid";
import React from "react";
import { textEditor } from "react-data-grid";
import { senderDropDown } from "../renders/senderDropDown";
import { statusDropDown } from "../renders/statusDropDown";
import { receiverDropDown } from "../renders/receiverDropDown";
import {
  CCell,
  CPayment,
  PaymentStatus,
} from "../../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { useDispatch, useSelector } from "react-redux";
import { handleRedux } from "../../../redux/store/handleRedux";
import { renderSenderUser } from "../renders/renderSenderUser";
import { renderStatusCell } from "../renders/renderStatusCell";
import rowToCells from "../serializers/rowToCells";
import { randomString } from "../../../DataProcessing/dataSamples";
import { renderReceiver } from "../renders/renderReceiver";

export const MAIN_FIELDS = [
  "id",
  "sender",
  "receiver",
  "receiver",
  "amount",
  "status",
];

function Promises(props) {
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
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
      key: "receiver",
      name: "receiver",
      width: "max-content",
      renderEditCell: receiverDropDown,
      renderCell: renderReceiver,
      frozen: true,
      resizable: false,
      draggable: false,
    },
    {
      key: "sender",
      name: "sender",
      width: 100,
      frozen: true,
      renderCell: renderSenderUser,
      renderEditCell: senderDropDown,
    },
    {
      key: "amount",
      name: "amount",
      width: "max-content",
      renderEditCell: textEditor,
      frozen: true,
    },
    {
      key: "status",
      name: "status",
      width: "max-content",
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
        newColumns[cell.field] = cell.value;
      });
    }
    return {
      id: promise.id,
      receiver: promise.receiver.toString(),
      sender: promise.sender.toString(),
      amount: promise.amount,
      status: Object.keys(promise.status)[0],
      ...newColumns,
    };
  });

  Object.keys(newColumns).forEach((key) => {
    if (!columns.find((c) => c.key == key)) {
      columns.push({
        key: key,
        name: key,
        width: "max-content",
        renderEditCell: textEditor,
        resizable: true,
        draggable: true,
        frozen: false,
      });
    }
  });

  columns = columns.map((c) => {
    return { ...c, id: c.key || c.id || randomString() };
  });

  if (rows.length === 0) {
    rows = [
      {
        id: "0",
        receiver: null,
        sender: null,
        amount: "",
        status: "",
      },
    ];
  }

  function onChangeRow(rows, column) {
    let promises = rows.map((row) => {
      let status = {};
      let cells = rowToCells(row);
      status[row.status || "None"] = null;

      let sender = [...all_friends, profile].find(
        (f) => f.id === row.sender || f.name === row.sender,
      );

      let receiver = [...all_friends, profile].find(
        (f) => f.id === row.receiver || f.name === row.receiver,
      );

      sender = Principal.fromText(sender ? sender.id : profile.id);
      receiver = Principal.fromText(receiver ? receiver.id : "2vxsx-fae");
      let updatedPayment: CPayment = {
        id: row.id,
        status: status as PaymentStatus,
        date_created: 0,
        date_released: 0,
        cells,
        contract_id: props.contract.id,
        amount: Number(row.amount),
        sender,
        receiver,
      };
      return updatedPayment;
    });
    let updateContract = { ...props.contract, promises };
    dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
  }

  function onDeleteRow(id) {
    let promises = props.contract.promises.filter((row) => row.id !== id);
    let updateContract = { ...props.contract, promises };
    dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
  }

  function onAddColumn(column: any) {
    let promises = props.contract.promises.map((p) => {
      let newCell: CCell = {
        id: column.id,
        field: column.id,
        value: column.name,
      };
      return {
        ...p,
        cells: [...p.cells, newCell],
      };
    });
    let updateContract = {
      ...props.contract,
      promises,
    };
    dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
  }

  function onRenameColumn(k, n) {
    let updateContract = {
      ...props.contract,
      promises: props.contract.promises.map((p) => {
        let cells = p.cells.map((c: CCell) => {
          if (c.id == k) {
            return { ...c, field: n };
          }
          return c;
        });
        return {
          ...p,
          cells,
        };
      }),
    };
    dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
  }
  const onDeleteColumn = (index: number, column: any) => {
    let updateContract = {
      ...props.contract,
      promises: props.contract.promises.map((p) => {
        let cells = p.cells.filter((c: CCell) => c.field !== column.key);
        return {
          ...p,
          cells,
        };
      }),
    };
    dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
  };

  return (
    <DataGridSheet
      contract={props.contract}
      onDeleteColumn={onDeleteColumn}
      onRenameColumn={onRenameColumn}
      onDeleteRow={onDeleteRow}
      onChangeRow={onChangeRow}
      onAddColumn={onAddColumn}
      initRows={rows}
      initColumns={columns}
    />
  );
}

export default Promises;
