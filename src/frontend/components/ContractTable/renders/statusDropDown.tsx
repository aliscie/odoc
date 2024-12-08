import { RenderEditCellProps } from "react-data-grid";
import convertCamelToTitle from "../../../utils/convertCamelToTitle";
import { MenuItem, Select } from "@mui/material";

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

export function StatusDropDown(props) {
  // let contract = props.contract
  // console.log({ contract });
  return (
    <Select
      fullWidth={true}
      value={props.value}
      // onChange={(event) =>
      //   onRowChange({ ...row, status: event.target.value }, true)
      // }
    >
      {statuses.map((status) => (
        <MenuItem value={status}>{convertCamelToTitle(status)}</MenuItem>
      ))}
    </Select>
  );
}
