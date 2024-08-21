import React from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {CustomContract} from "../../../declarations/backend/backend.did";
import {CONTRACT, CREATE_CONTRACT, PAYMENTS, PROMISES} from "./types";
import BasicMenu from "../MuiComponents/DropDown";
import {ButtonGroup, Input} from "@mui/material";
import Button from "@mui/material/Button";
import DataGridSheet, {Row} from "../DataGrid";
import {Column, SelectColumn, textEditor} from "react-data-grid";
import {renderDropdown} from "../DataGrid/renderDropdown";
import {faker} from "@faker-js/faker";
import {Principal} from "@dfinity/principal";

interface VIEW {
    id?: string,
    name: string,
    type: CONTRACT | CREATE_CONTRACT | PAYMENTS | PROMISES,
}


const initColumns: readonly Column<Row>[] = [
    SelectColumn,
    {
        key: 'id',
        name: 'ID',
        width: 30,
        resizable: true,
        frozen: true,
    },
    {
        key: 'title',
        name: 'title',
        width: 100,
        renderEditCell: renderDropdown,
        resizable: true,
        sortable: true,
        draggable: true,

    },
    {
        key: 'lastName',
        name: 'Last Name',
        width: 100,
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

let contractSample: CustomContract = {
    "id": "2wjej",
    "permissions": [],
    "creator": Principal.fromText("oo54d-aga7v-5qouy-mijkh-pookd-bhj7t-3eh2z-pqf3m-pgkb7-u65lk-bqe"),
    "date_created": 1723950331764397000,
    "payments": [],
    "name": "Custom contract",
    "formulas": [],
    "contracts": [],
    "date_updated": 0,
    "promises": []
}


export function CustomContractComponent({contract}: { contract: CustomContract }) {

    let rows = createRows();
    let columns = initColumns;


    let options = [
        {
            content: "item 1", onClick: () => {
            }
        },
        {
            content: "item 2", onClick: () => {
            }
        }
    ];

    let viewOptions = [
        {
            content: "Promises", onClick: () => {
            }
        },
        {
            content: "Payments", onClick: () => {
            }
        },
        {
            content: "Others", onClick: () => {
            }
        }
    ];
    // logger({contract})

    return (<div>
        <ButtonGroup size="small" variant="contained" aria-label="Basic button group">
            <Input defaultValue={'Untitled'}/>
            <Button>Filter</Button>
            <BasicMenu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                options={viewOptions}
            >
                Promises
            </BasicMenu>
            <BasicMenu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                options={options}
            >
                <MoreVertIcon/>
            </BasicMenu>

        </ButtonGroup>
        <DataGridSheet
            initRows={rows}
            initColumns={columns}
        />
    </div>);
}

