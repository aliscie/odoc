import {RenderEditCellProps} from "react-data-grid";
import convertCamelToTitle from "../../../utils/convertCamelToTitle";
import {MenuItem, Select} from "@mui/material";

const statuses = [
  "None",
  "RequestCancellation",
  "Released",
  "Objected",
  "Confirmed",
  "ConfirmedCancellation",
  "ApproveHighPromise",
  "HighPromise",
];

export function statusDropDown({ row, onRowChange }: RenderEditCellProps) {
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={row.status}
      label="Age"
      onChange={(event) =>
        onRowChange({ ...row, status: event.target.value }, true)
      }
    >
      {statuses.map((status) => (
        <MenuItem value={status}>{convertCamelToTitle(status)}</MenuItem>
      ))}
    </Select>
  );
}
