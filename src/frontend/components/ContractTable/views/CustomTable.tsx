import DataGridSheet from "../../DataGrid";
import React, { useMemo, useCallback } from "react";
import { textEditor } from "react-data-grid";
import {
  CColumn,
  CustomContract,
} from "../../../../declarations/backend/backend.did";
import { useDispatch } from "react-redux";
import { VIEW_OPTIONS } from "./index";
import { handleRedux } from "../../../redux/store/handleRedux";
import cellsToRow from "../serializers/cellsToRow";
import rowToCells from "../serializers/rowToCells";

interface Props {
  view: VIEW_OPTIONS;
  contract: CustomContract;
}

function CustomTable(props: Props) {
  const dispatch = useDispatch();

  const rows = useMemo(() => {
    return props.view.contract.rows.map((r) => {
      return { id: r.id, ...cellsToRow(r.cells) };
    });
  }, [props.view.contract.rows]);

  const columns = useMemo(() => {
    return props.view.contract.columns.map((c) => {
      return { ...c, renderEditCell: textEditor, resizable: true };
    });
  }, [props.view.contract.columns]);

  const onChangeRow = useCallback(
    (rows, column) => {
      let contracts = props.contract.contracts.map((c) => {
        if (c.id == props.view.contract.id) {
          let newRows = rows.map((r) => {
            let id = r.id;
            return { id, cells: rowToCells(r) };
          });
          return { ...c, rows: newRows };
        }
        return c;
      });
      let updateContract = { ...props.contract, contracts };
      dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
    },
    [props.contract, props.view.contract, dispatch],
  );

  const onRenameColumn = useCallback(
    (key, column) => {
      let contracts = props.contract.contracts;
      let contract = props.view.contract;
      let columns: any = props.view.contract?.columns;

      contracts = contracts.map((c) => {
        if (c.id == contract.id) {
          columns = columns.map((col) => {
            if (col.id == key) {
              return { ...col, name: column };
            }
            return { ...col };
          });
          return { ...c, columns };
        }
        return c;
      });
      let updateContract = { ...props.contract, contracts };
      dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
    },
    [props.contract, props.view.contract, dispatch],
  );

  const onAddColumn = useCallback(
    (column: any) => {
      let contracts = props.contract.contracts.map((c) => {
        if (c.id == props.view.contract.id) {
          return { ...c, columns: [...props.view.contract.columns, column] };
        }
        return c;
      });
      let updateContract = { ...props.contract, contracts };
      dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
    },
    [props.contract, props.view.contract, dispatch],
  );

  return (
    <DataGridSheet
      contract={props.contract}
      onRenameColumn={onRenameColumn}
      onChangeRow={onChangeRow}
      onAddColumn={onAddColumn}
      initRows={rows}
      initColumns={columns}
    />
  );
}

export default CustomTable;
