"use strict";
import "@astrouxds/ag-grid-theme/dist/main.css";

import React, { useMemo, useState } from "react";
// import { createRoot } from "react-dom/client";
import { AgGridReact } from "@ag-grid-community/react";

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  GetContextMenuItemsParams,
  MenuItemDef,
  ModuleRegistry,
} from "@ag-grid-community/core";

import { themeQuartz } from "@ag-grid-community/theming";
import { GridTheme } from "@ag-grid-community/core/dist/types/src/entities/gridOptions";
import { useSelector } from "react-redux";
import { ColDef } from "@ag-grid-community/core/dist/types/src/entities/colDef";

ModuleRegistry.registerModules([ClientSideRowModelModule]);
const GridExample = (props) => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "500px" }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(props.rows);

  const [columnDefs, setColumnDefs] = useState(props.columns);
  const defaultColDef = {
    editable: true,
    // contextMenu: true,
  };

  const myTheme: GridTheme = themeQuartz.withParams({
    browserColorScheme: "dark",
  });

  const getContextMenuItems = (params) => [
    {
      // custom item
      name: "Alert " + params.value,
      action: () => {
        window.alert("Alerting about " + params.value);
      },
      cssClasses: ["red", "bold"],
    },
  ];

  const { isDarkMode } = useSelector((state: any) => state.uiState);
  return (
    <div style={containerStyle}>
      <div
        style={gridStyle}
        className={`ag-theme-quartz-${isDarkMode ? "dark" : "light"}`}
      >
        <AgGridReact
          cellSelection={true}
          // allowContextMenuWithControlKey={true}
          getContextMenuItems={getContextMenuItems}
          // theme={myTheme}
          // onCellContextMenu={(p) => {
          //   console.log({ p });
          // }}
          rowDragManaged={true}
          // onRowDragEnd={(event) => console.log({ event })}
          // onColumnMoved={(event) => console.log({ event })}
          // onColumnResized={(event) => console.log({ event })}
          // onColumnRowGroupChanged={(event) => console.log({ event })}
          onCellValueChanged={props.onCellValueChanged}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};
export default GridExample;
