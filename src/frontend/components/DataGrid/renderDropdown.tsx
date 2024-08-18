// import type {RenderEditCellProps} from '../../../src';
// import {textEditorClassname} from '../../../src/editors/textEditor';
// import type {Row} from '../AllFeatures';

import {RenderEditCellProps} from "react-data-grid";
import {Row} from "./index";

const titles = ['Dr.', 'Mr.', 'Mrs.', 'Miss', 'Ms.'] as const;

export function renderDropdown({row, onRowChange}: RenderEditCellProps<Row>) {
    return (
        <select
            className={'textEditorClassname'}
            value={row.bs}
            onChange={(event) => onRowChange({...row, bs: event.target.value}, true)}
            autoFocus
        >
            {titles.map((title) => (
                <option key={title} value={title}>
                    {title}
                </option>
            ))}
        </select>
    );
}
