"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
// import "./style.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  MenuItemDef,
  ModuleRegistry,
  ValidationModule,
  createGrid,
  RowDragModule,
  SelectEditorModule,
  TooltipModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  IntegratedChartsModule,
  NumberEditorModule,
  TextEditorModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

import { themeQuartz } from "ag-grid-community";
import { useSelector } from "react-redux";

ModuleRegistry.registerModules([
  TooltipModule,
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  RowDragModule,
  SelectEditorModule,
  ValidationModule /* Development Only */,
]);

const AgGridDataGrid = (props) => {
  let contextMenu = props.contextMenu || [];
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "300px", width: "100%" }), []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
      minWidth: 100,
    };
  }, []);

  const getContextMenuItems = useCallback(
    (
      params: GetContextMenuItemsParams,
    ): (string | MenuItemDef)[] | Promise<(string | MenuItemDef)[]> => {
      const result: (string | MenuItemDef)[] = [
        ...contextMenu,
        ...props.getContextMenuItems(params),
        "copy",
        "separator",
        "chartRange",
      ];
      if (params.column?.getColId() === "country") {
        return new Promise((res) => setTimeout(() => res(result), 150));
      }
      return result;
    },
    [window],
  );

  const { isDarkMode } = useSelector((state: any) => state.uiState);

  const darkThem = themeQuartz.withParams({
    accentColor: "#15BDE8",
    backgroundColor: "#0C0C0D",
    borderColor: "#ffffff00",
    foregroundColor: "#BBBEC9",
    headerBackgroundColor: "#182226",
    headerTextColor: "#FFFFFF",
  });

  const lightThem = themeQuartz.withParams({
    accentColor: "#15BDE8",
    backgroundColor: "#ffffff",
    borderColor: "#ffffff00",
    foregroundColor: "#000000",
    headerBackgroundColor: "#f4f5f8",
    headerTextColor: "#000000",
  });

  return (
    <div style={gridStyle}>
      <AgGridReact<IOlympicData>
        tooltipShowDelay={0}
        // tooltipHideDelay={500}
        noRowsOverlayComponent={props.noRowsOverlayComponent}
        context={props.context}
        rowDragManaged={true}
        theme={isDarkMode ? darkThem : lightThem}
        style={containerStyle}
        rowData={props.rows}
        columnDefs={props.columns}
        defaultColDef={defaultColDef}
        cellSelection={true}
        allowContextMenuWithControlKey={false}
        getContextMenuItems={getContextMenuItems}
        // suppressNoRowsOverlay={true}
      />
    </div>
  );
};
export default AgGridDataGrid;
