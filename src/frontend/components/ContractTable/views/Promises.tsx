import DataGridSheet from "../../DataGrid";
import React from "react";
import { textEditor } from "react-data-grid";
import { RenderUser } from "../renders/renderUser";
import { UserDropDown } from "../renders/userDropDown";
import {
  CCell,
  CPayment,
  PaymentStatus,
} from "../../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { useDispatch, useSelector } from "react-redux";
import { handleRedux } from "../../../redux/store/handleRedux";
import { renderStatusCell } from "../renders/renderStatusCell";
import rowToCells from "../serializers/rowToCells";
import { randomString } from "../../../DataProcessing/dataSamples";
import { StatusDropDown } from "../renders/statusDropDown";

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
      // cellRenderer: ReceiverDropDown,
      cellRenderer: RenderUser,
      cellEditor: (p) => <UserDropDown {...p} {...props} />,
      frozen: true,
      resizable: true,
      rowDrag: true,
      contextMenuItems: [
        {
          name: "Delete Row",
          action: function () {
            onDeleteRow(p.row.id);
          },
        },
      ],
    },
    {
      key: "sender",
      name: "sender",
      width: 100,
      frozen: true,
      resizable: true,
      // renderCell: RenderSenderUser,
      cellRenderer: RenderUser,
      cellEditor: (p) => <UserDropDown {...p} {...props} />,
    },
    {
      resizable: true,
      key: "amount",
      name: "amount",
      width: "max-content",
      // cellRenderer: textEditor,
    },
    {
      resizable: true,
      key: "status",
      name: "status",
      width: "max-content",
      // cellRenderer: StatusDropDown,
      cellEditor: (p) => <StatusDropDown {...p} {...props} />,
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
        cellRenderer: textEditor,
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

  // function onRenameColumn(k, n) {
  //   let updateContract = {
  //     ...props.contract,
  //     promises: props.contract.promises.map((p) => {
  //       let cells = p.cells.map((c: CCell) => {
  //         if (c.id == k) {
  //           return { ...c, field: n };
  //         }
  //         return c;
  //       });
  //       return {
  //         ...p,
  //         cells,
  //       };
  //     }),
  //   };
  //   dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
  // }
  // const onDeleteColumn = (index: number, column: any) => {
  //   let updateContract = {
  //     ...props.contract,
  //     promises: props.contract.promises.map((p) => {
  //       let cells = p.cells.filter((c: CCell) => c.field !== column.key);
  //       return {
  //         ...p,
  //         cells,
  //       };
  //     }),
  //   };
  //   dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
  // };
  const onCellValueChanged = (event) => {
    // let promise = props.contract.promises.find((p) => p.id === event.data.id);
    let contract = { ...props.contract };
    let columnField = event.colDef.field;
    switch (columnField) {
      case "amount":
        contract.promises = contract.promises.map((p) => {
          if (p.id === event.data.id) {
            return {
              ...p,
              amount: Number(event.value),
            };
          }
          return p;
        });

        break;
      case "receiver":
        break;
      default:
        break;
    }
    dispatch(handleRedux("UPDATE_CONTRACT", { contract }));
  };

  return (
    <DataGridSheet
      key={JSON.stringify(props.contract.promises)}
      contract={props.contract}
      // onDeleteColumn={onDeleteColumn}
      // onRenameColumn={onRenameColumn}
      // onDeleteRow={onDeleteRow}
      // onChangeRow={onChangeRow}
      // onAddColumn={onAddColumn}
      onCellValueChanged={onCellValueChanged}
      initRows={rows}
      initColumns={columns}
    />
  );
}

export default Promises;
