import React, {useCallback, useLayoutEffect, useMemo, useReducer, useRef, useState} from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, {CopyEvent, FillEvent, PasteEvent, RenderRowProps, Row, SortColumn, textEditor} from 'react-data-grid';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DraggableRowRenderer} from "./DraggableRowRenderer";
import {createPortal} from "react-dom";
import {Menu, MenuItem} from "@mui/material";
import RenameColumn from "./RenameColumn";
import {randomString} from "../../DataProcessing/dataSamples";
import InsertFormula from "./InsertFormula";
import FormulaCell from "./FormulaCell";
import {CColumn, Filter, PermissionType} from "../../../declarations/backend/backend.did";

export interface Row {
    id: string;
    avatar: string;
    email: string;
    title: string;
    firstName: string;
    lastName: string;
    street: string;
    zipCode: string;
    date: string;
    bs: string;
    catchPhrase: string;
    companyName: string;
    words: string;
    sentence: string;
}

function rowKeyGetter(row: Row) {
    return row.id;
}

interface Props {
    onChangeRow: (rows: any, column: any) => void
    onDeleteRow: (rowId: string) => void
    onAddColumn: (newColumn: CColumn) => void
    onRenameColumn: (key, name) => void
}

export default function DataGridSheet(props: Props) {
    const {initRows, initColumns, direction} = props
    const [columns, setColumns] = useState(initColumns);
    const [rows, setRows] = useState(initRows);
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<string> => new Set());

    function handleFill({columnKey, sourceRow, targetRow}: FillEvent<Row>): Row {
        return {...targetRow, [columnKey]: sourceRow[columnKey as keyof Row]};
    }

    function handlePaste({
                             sourceColumnKey,
                             sourceRow,
                             targetColumnKey,
                             targetRow
                         }: PasteEvent<Row>): Row {
        const incompatibleColumns = ['email', 'zipCode', 'date'];
        if (
            sourceColumnKey === 'avatar' ||
            ['id', 'avatar'].includes(targetColumnKey) ||
            ((incompatibleColumns.includes(targetColumnKey) ||
                    incompatibleColumns.includes(sourceColumnKey)) &&
                sourceColumnKey !== targetColumnKey)
        ) {
            return targetRow;
        }

        return {...targetRow, [targetColumnKey]: sourceRow[sourceColumnKey as keyof Row]};
    }

    function handleCopy({sourceRow, sourceColumnKey}: CopyEvent<Row>): void {
        if (window.isSecureContext) {
            navigator.clipboard.writeText(sourceRow[sourceColumnKey as keyof Row]);
        }
    }

    function onSelectedRowsChange(selectedRow: ReadonlySet<string>) {
        setSelectedRows(selectedRow);
    }

    const handleRowsChange = (newRows, column) => {
        props.onChangeRow(newRows, column)
        setRows(newRows);
    };

    function hanldeColumnResize(index: number, width: number) {
        // console.log({index, width});
    }

    const [columnsOrder, setColumnsOrder] = useState((): readonly number[] =>
        columns.map((_, index) => index)
    );

    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
    const reorderedColumns = useMemo(() => {
        return columnsOrder.map((index) => {
            if (columns[index].formula) {
                return {...columns[index], renderCell: FormulaCell}
            }
            return {...columns[index], key: columns[index].id || columns[index].key}
        });
    }, [columnsOrder, columns]);
    const onSortColumnsChange = useCallback((sortColumns: SortColumn[]) => {
        setSortColumns(sortColumns.slice(-1));
    }, []);


    function onColumnsReorder(sourceKey: string, targetKey: string) {
        setColumnsOrder((columnsOrder) => {
            const sourceColumnOrderIndex = columnsOrder.findIndex(
                (index) => columns[index].key === sourceKey
            );
            const targetColumnOrderIndex = columnsOrder.findIndex(
                (index) => columns[index].key === targetKey
            );
            const sourceColumnOrder = columnsOrder[sourceColumnOrderIndex];
            const newColumnsOrder = columnsOrder.toSpliced(sourceColumnOrderIndex, 1);
            newColumnsOrder.splice(targetColumnOrderIndex, 0, sourceColumnOrder);
            return newColumnsOrder;
        });
    }

    const [nextId, setNextId] = useReducer((id: number) => id + 1, rows.length > 0 && rows[rows.length - 1].id + 1);

    const renderRow = useCallback((key: React.Key, props: RenderRowProps<Row>) => {
        function onRowReorder(fromIndex: number, toIndex: number) {
            setRows((rows) => {
                const newRows = [...rows];
                newRows.splice(toIndex, 0, newRows.splice(fromIndex, 1)[0]);
                return newRows;
            });
        }

        return <DraggableRowRenderer
            {...props}
            key={key}
            onRowReorder={onRowReorder}
        />;
    }, [columns]);

    const menuRef = useRef<HTMLMenuElement | null>(null);
    const [contextMenuProps, setContextMenuProps] = useState<{
        rowIdx: number;
        top: number;
        left: number;
    } | null>(null);

    const isContextMenuOpen = contextMenuProps !== null;

    useLayoutEffect(() => {
        if (!isContextMenuOpen) return;

        function onClick(event: MouseEvent) {
            if (event.target instanceof Node && menuRef.current?.contains(event.target)) {
                return;
            }
            // setContextMenuProps(null);
        }

        addEventListener('click', onClick);

        return () => {
            removeEventListener('click', onClick);
        };
    }, [isContextMenuOpen]);

    function insertRow(insertRowIdx: number) {
        const newRow: Row = {
            id: randomString(),
        };

        setRows([...rows.slice(0, insertRowIdx), newRow, ...rows.slice(insertRowIdx)]);
        setNextId();
    }


    const onAddColumn = () => {
        const key = contextMenuProps?.column.key;
        let index = columns.findIndex((column) => column.key === key);
        let id = randomString();
        let newColumn: CColumn = {
            id,
            'formula_string': '',
            'field': id,
            'column_type': '',
            'filters': [],
            'permissions': [],
            'editable': true,
            'deletable': true,
            name: 'Untitled',
        };
        setColumns([...columns.slice(0, index + 1), newColumn, ...columns.slice(index + 1)]);
        setColumnsOrder([...columnsOrder, columns.length]);
        props.onAddColumn(newColumn);
    };

    const onDeleteColumn = () => {
        const key = contextMenuProps?.column.key;
        let index = columns.findIndex((column) => column.key === key);
        setColumns([...columns.slice(0, index), ...columns.slice(index + 1)]);
        setColumnsOrder([...columnsOrder.slice(0, index), ...columnsOrder.slice(index + 1)]);
    };


    const onAddFormula = (formula) => {
        const key = contextMenuProps?.column.key;
        let index = columns.findIndex((column) => column.key === key);
        setColumns(prev => {
                const newColumns = [...prev];
                newColumns[index] = {...newColumns[index], formula};
                return newColumns;
            }
        );
    };


    return (

        <DndProvider backend={HTML5Backend}>
            <DataGrid
                onCellClick={(args, event) => {
                    if (args.column.key === 'title') {
                        event.preventGridDefault();
                        args.selectCell(true);
                    }
                }}

                columns={reorderedColumns}
                sortColumns={sortColumns}
                onSortColumnsChange={onSortColumnsChange}
                defaultColumnOptions={{width: '1fr'}}
                onColumnsReorder={onColumnsReorder}

                onColumnResize={hanldeColumnResize}
                onRowsChange={handleRowsChange}

                rows={rows}
                renderers={{renderRow, noRowsFallback: <h1>No rows to show.</h1>}}
                rowKeyGetter={rowKeyGetter}
                onFill={handleFill}
                onCopy={handleCopy}
                onPaste={handlePaste}
                rowHeight={30}
                selectedRows={selectedRows}
                onSelectedRowsChange={onSelectedRowsChange}
                className="fill-grid"
                rowClass={(row, index) =>
                    row.id.includes('7') || index === 0 ? '' : undefined
                }
                // direction={direction}
                onCellClick={(args, event) => {
                    if (args.column.key === 'title') {
                        // setContextMenuProps(pre => {
                        //     return {...pre}
                        // });
                        event.preventGridDefault();
                        args.selectCell(true);
                    }
                }}

                onCellContextMenu={(args, event) => {
                    const {row, column} = args;
                    event.preventGridDefault();
                    // Do not show the default context menu
                    event.preventDefault();
                    setContextMenuProps({
                        rowIdx: rows.indexOf(row),
                        top: event.clientY,
                        left: event.clientX,
                        row,
                        column,
                    });
                }}

            />


            {isContextMenuOpen &&
                createPortal(
                    <Menu
                        open={isContextMenuOpen}
                        onClose={() => setContextMenuProps(null)}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            contextMenuProps ? {top: contextMenuProps.top, left: contextMenuProps.left} : undefined
                        }
                    >
                        <RenameColumn onRenameColumn={props.onRenameColumn}
                                      setColumns={setColumns} {...contextMenuProps}/>

                        <MenuItem onClick={() => {
                            onAddColumn();
                            setContextMenuProps(null);
                        }}>
                            Add Column
                        </MenuItem>

                        <MenuItem onClick={() => {
                            onDeleteColumn();
                            setContextMenuProps(null);
                        }}>
                            Delete Column
                        </MenuItem>


                        <MenuItem onClick={() => {

                            const {rowIdx} = contextMenuProps;
                            const rowId = rows[rowIdx].id;
                            props.onDeleteRow(rowId);
                            if (rows.length <= 1) {
                                setRows([{
                                    id: nextId,
                                    product: faker.commerce.productName(),
                                    price: faker.commerce.price()
                                }]);
                                return
                            }

                            setRows([...rows.slice(0, rowIdx), ...rows.slice(rowIdx + 1)]);
                            setContextMenuProps(null);
                        }}>
                            Delete Row
                        </MenuItem>
                        <MenuItem onClick={() => {
                            const {rowIdx} = contextMenuProps;
                            insertRow(rowIdx);
                            setContextMenuProps(null);
                        }}>
                            Insert Row Above
                        </MenuItem>
                        <MenuItem onClick={() => {
                            const {rowIdx} = contextMenuProps;
                            insertRow(rowIdx + 1);
                            setContextMenuProps(null);
                        }}>
                            Insert Row Below
                        </MenuItem>

                        <InsertFormula contextMenuProps={contextMenuProps} onAddFormula={onAddFormula}/>

                    </Menu>,
                    document.body
                )}
        </DndProvider>
    );
}
