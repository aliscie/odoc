import {useCallback, useLayoutEffect, useMemo, useReducer, useRef, useState} from 'react';
import {faker} from '@faker-js/faker';
import 'react-data-grid/lib/styles.css';
import DataGrid, {
    Column,
    CopyEvent,
    FillEvent,
    PasteEvent,
    RenderRowProps,
    Row,
    SelectColumn,
    SortColumn,
    textEditor
} from 'react-data-grid';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DraggableRowRenderer} from "./DraggableRowRenderer";
import {createPortal} from "react-dom";
import {Menu, MenuItem} from "@mui/material";
import {renderStreet} from "./renderStreet";
import {renderDropdown} from "./renderDropdown";


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

const columns: readonly Column<Row>[] = [
    SelectColumn,
    {
        key: 'id',
        name: 'ID',
        width: 50,
        resizable: true,
        frozen: true
    },
    // {
    //     key: 'avatar',
    //     name: 'Avatar',
    //     width: 40,
    //     resizable: true,
    //     renderCell: renderAvatar
    // },
    // {
    //     key: 'title',
    //     name: 'Title',
    //     width: 200,
    //     resizable: true,
    //     renderEditCell: renderDropdown
    // },
    {
        key: 'firstName',
        name: 'First Name',
        width: 200,
        resizable: true,
        frozen: true,
        renderEditCell: textEditor
    },
    {
        key: 'lastName',
        name: 'Last Name',
        width: 200,
        resizable: true,
        frozen: true,
        renderEditCell: textEditor
    },
    {
        key: 'email',
        name: 'Email',
        width: 'max-content',
        renderEditCell: textEditor,
        resizable: true,
        sortable: true,
        draggable: true
    },
    // {
    //     key: 'street',
    //     name: 'Street',
    //     width: 200,
    //     renderEditCell: textEditor,
    //     resizable: true,
    //     sortable: true,
    //     draggable: true,
    //     renderCell: renderStreet,
    // },
    // {
    //     key: 'zipCode',
    //     name: 'ZipCode',
    //     width: 200,
    //     renderEditCell: textEditor,
    //     resizable: true,
    //     sortable: true,
    //     draggable: true
    // },
    // {
    //     key: 'date',
    //     name: 'Date',
    //     width: 200,
    //     renderEditCell: textEditor,
    //     resizable: true,
    //     sortable: true,
    //     draggable: true,
    // },
    {
        key: 'bs',
        name: 'bs',
        width: 200,
        renderEditCell: renderDropdown,
        resizable: true,
        sortable: true,
        draggable: true,

    },
    // {
    //     key: 'catchPhrase',
    //     name: 'Catch Phrase',
    //     width: 'max-content',
    //     renderEditCell: textEditor,
    //     resizable: true,
    //     sortable: true,
    //     draggable: true,
    // },
    // {
    //     key: 'companyName',
    //     name: 'Company Name',
    //     width: 200,
    //     renderEditCell: textEditor,
    //     resizable: true,
    //     sortable: true,
    //     draggable: true,
    // },
    // {
    //     key: 'sentence',
    //     name: 'Sentence',
    //     width: 'max-content',
    //     renderEditCell: textEditor,
    //     resizable: true,
    //     sortable: true,
    //     draggable: true,
    // }
];

function createRows(): Row[] {
    const rows: Row[] = [];

    for (let i = 0; i < 3; i++) {
        rows.push({
            id: `id_${i}`,
            avatar: faker.image.avatar(),
            email: faker.internet.email(),
            title: faker.person.prefix(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            street: faker.location.street(),
            zipCode: faker.location.zipCode(),
            date: faker.date.past().toLocaleDateString(),
            bs: faker.company.buzzPhrase(),
            catchPhrase: faker.company.catchPhrase(),
            companyName: faker.company.name(),
            words: faker.lorem.words(),
            sentence: faker.lorem.sentence()
        });
    }

    return rows;
}


export default function AllFeatures({direction}: Props) {
    const [rows, setRows] = useState(createRows);
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<string> => new Set());

    function handleFill({columnKey, sourceRow, targetRow}: FillEvent<Row>): Row {
        console.log({columnKey, sourceRow, targetRow});
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

    const handleRowsChange = (newRows) => {
        setRows(newRows);
        // logger(newRows); // This will log the new rows to the console
    };

    function hanldeColumnResize(index: number, width: number) {
        console.log({index, width});
    }

    const [columnsOrder, setColumnsOrder] = useState((): readonly number[] =>
        columns.map((_, index) => index)
    );

    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
    const reorderedColumns = useMemo(() => {
        return columnsOrder.map((index) => columns[index]);
    }, [columnsOrder]);
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

    const [nextId, setNextId] = useReducer((id: number) => id + 1, rows[rows.length - 1].id + 1);
    const renderRow = useCallback((key: React.Key, props: RenderRowProps<Row>) => {
        function onRowReorder(fromIndex: number, toIndex: number) {
            setRows((rows) => {
                const newRows = [...rows];
                newRows.splice(toIndex, 0, newRows.splice(fromIndex, 1)[0]);
                return newRows;
            });
        }

        // return <Row {...props} />
        return <DraggableRowRenderer
            {...props}
            key={key}
            onRowReorder={onRowReorder}
        />;
    }, []);

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
            setContextMenuProps(null);
        }

        addEventListener('click', onClick);

        return () => {
            removeEventListener('click', onClick);
        };
    }, [isContextMenuOpen]);

    function insertRow(insertRowIdx: number) {
        const newRow: Row = {
            id: nextId,
            product: faker.commerce.productName(),
            price: faker.commerce.price()
        };

        setRows([...rows.slice(0, insertRowIdx), newRow, ...rows.slice(insertRowIdx)]);
        setNextId();
    }


    const onAddColumn = () => {
        let newColumn = {
            key: 'newColumn',
            name: 'New Column',
            width: 200,
            resizable: true,
            sortable: true,
            draggable: true
        };
        // setColumnsOrder([...columnsOrder, columns.length]);
        // setSortColumns(prev => [...prev, {columnKey: 'newColumn', direction: 'NONE'}]);

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
                renderers={{renderRow}}
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
                        event.preventGridDefault();
                        args.selectCell(true);
                    }
                }}

                onCellContextMenu={({row}, event) => {
                    event.preventGridDefault();
                    // Do not show the default context menu
                    event.preventDefault();
                    setContextMenuProps({
                        rowIdx: rows.indexOf(row),
                        top: event.clientY,
                        left: event.clientX
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
                        <MenuItem onClick={() => {
                            onAddColumn();
                            setContextMenuProps(null);
                        }}>
                            Add Column
                        </MenuItem>

                        <MenuItem onClick={() => {
                            const {rowIdx} = contextMenuProps;
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
                    </Menu>,
                    document.body
                )}


        </DndProvider>
    );
}
