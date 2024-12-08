import DataGridSheet from "../../DataGrid";
import React from "react";
import { RenderUser } from "../renders/renderUser";


function Payments(props) {
  // let rows = [];

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
      cellRenderer: RenderUser,
      frozen: true,
      editable: false,
    },
    {
      key: "sender",
      name: "sender",
      width: "max-content",
      frozen: true,
      cellRenderer: RenderUser,
      editable: false,
    },
    {
      key: "amount",
      name: "amount",
      width: "max-content",
      frozen: true,
      editable: false,
    },
    {
      key: "status",
      name: "status",
      width: "max-content",
      frozen: true,
      editable: false,
      // resizable: true,
      // sortable: true,
      // draggable: true
    },
  ];

  // props.contract.payments.forEach((payment: CPayment) => {
  //   let status = Object.keys(payment.status)[0];
  //   rows.push({
  //     sender: payment.sender.toString(),
  //     receiver: payment.receiver.toString(),
  //     status,
  //     amount: payment.amount,
  //     id: payment.id,
  //   });
  // });
  let newColumns = {};
  let rows = props.contract.payments.map((promise, index) => {
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
        id: key,
        key,
        name: key,
        width: "max-content",
        frozen: true,
        editable: false,
      });
    }
  });

  return (
    <DataGridSheet

      disableMenu={true}
      initRows={rows}
      initColumns={columns}
      contract={props.contract}
    />
  );
}

export default Payments;
