import { RenderEditCellProps } from "react-data-grid";
import PaidIcon from "@mui/icons-material/Paid";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import convertCamelToTitle from "../../../utils/convertCamelToTitle";

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
    <select
      className={"textEditorClassname"}
      value={row.status}
      onChange={(event) =>
        onRowChange({ ...row, status: event.target.value }, true)
      }
      autoFocus
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {convertCamelToTitle(status)}
        </option>
      ))}
    </select>
  );
}
