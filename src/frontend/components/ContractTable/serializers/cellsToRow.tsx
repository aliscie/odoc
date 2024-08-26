import { CCell } from "../../../../declarations/backend/backend.did";

function cellsToRow(cells: Array<CCell>) {
  let row = {};
  cells.forEach((c) => {
    row[c.field] = c.value;
  });
  return row;
}

export default cellsToRow;
