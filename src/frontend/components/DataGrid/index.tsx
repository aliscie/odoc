import { useState } from 'react';
import { faker } from '@faker-js/faker';
// import { css } from '@linaria/core';
import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';
import {renderDropdown} from './dropDown';
// import DataGrid, { SelectColumn, textEditor } from '../../src';
// import type { Column, CopyEvent, FillEvent, PasteEvent } from '../../src';
// import { renderAvatar, renderDropdown } from './renderers';

// import type { Props } from '../ContractTable/types';
import {Column, CopyEvent, FillEvent, PasteEvent, SelectColumn, textEditor} from "react-data-grid";
import {renderAvatar} from "@mui/x-data-grid-generator";
// import {SelectColumn, textEditor} from "react-data-grid";
// import {DataGrid} from "@mui/x-data-grid";

// const highlightClassname = css`
//   .rdg-cell {
//     background-color: #9370db;
//     color: white;
//   }
//
//   &:hover .rdg-cell {
//     background-color: #800080;
//   }
// `;

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
    width: 80,
    resizable: true,
    frozen: true
  },
  {
    key: 'avatar',
    name: 'Avatar',
    width: 40,
    resizable: true,
    renderCell: renderAvatar
  },
  {
    key: 'title',
    name: 'Title',
    width: 200,
    resizable: true,
    renderEditCell: renderDropdown
  },
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
    resizable: true,
    renderEditCell: textEditor
  },
  {
    key: 'street',
    name: 'Street',
    width: 200,
    resizable: true,
    renderEditCell: textEditor
  },
  {
    key: 'zipCode',
    name: 'ZipCode',
    width: 200,
    resizable: true,
    renderEditCell: textEditor
  },
  {
    key: 'date',
    name: 'Date',
    width: 200,
    resizable: true,
    renderEditCell: textEditor
  },
  {
    key: 'bs',
    name: 'bs',
    width: 200,
    resizable: true,
    renderEditCell: textEditor
  },
  {
    key: 'catchPhrase',
    name: 'Catch Phrase',
    width: 'max-content',
    resizable: true,
    renderEditCell: textEditor
  },
  {
    key: 'companyName',
    name: 'Company Name',
    width: 200,
    resizable: true,
    renderEditCell: textEditor
  },
  {
    key: 'sentence',
    name: 'Sentence',
    width: 'max-content',
    resizable: true,
    renderEditCell: textEditor
  }
];

function createRows(): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < 2000; i++) {
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

export default function AllFeatures({ direction }: Props) {
  const [rows, setRows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState((): ReadonlySet<string> => new Set());

  function handleFill({ columnKey, sourceRow, targetRow }: FillEvent<Row>): Row {
    return { ...targetRow, [columnKey]: sourceRow[columnKey as keyof Row] };
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

    return { ...targetRow, [targetColumnKey]: sourceRow[sourceColumnKey as keyof Row] };
  }

  function handleCopy({ sourceRow, sourceColumnKey }: CopyEvent<Row>): void {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(sourceRow[sourceColumnKey as keyof Row]);
    }
  }

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      onFill={handleFill}
      onCopy={handleCopy}
      onPaste={handlePaste}
      rowHeight={30}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      className="fill-grid"
      rowClass={(row, index) =>
        row.id.includes('7') || index === 0 ? '' : undefined
      }
      direction={direction}
      onCellClick={(args, event) => {
        if (args.column.key === 'title') {
          event.preventGridDefault();
          args.selectCell(true);
        }
      }}
    />
  );
}
