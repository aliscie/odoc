// import type { RenderEditCellProps } from '../../../src';
// import { textEditorClassname } from '../../../src/editors/textEditor';
import {Row} from "./index";
import {RenderEditCellProps} from "react-data-grid";
// import type { Row } from '../AllFeatures';

const titles = ['Dr.', 'Mr.', 'Mrs.', 'Miss', 'Ms.'] as const;
export const textEditorClassname = `rdg-text-editor ${''}`;

export function renderDropdown({ row, onRowChange }: RenderEditCellProps<Row>) {
  return (
    <select
      className={textEditorClassname}
      value={row.title}
      onChange={(event) => onRowChange({ ...row, title: event.target.value }, true)}
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
