import { RenderEditCellProps } from "react-data-grid";
import { useSelector } from "react-redux";
import { MenuItem, Select } from "@mui/material";

export function receiverDropDown({ row, onRowChange }: RenderEditCellProps) {
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={row.receiver}
      label="Age"
      onChange={(event) =>
        onRowChange({ ...row, receiver: event.target.value }, true)
      }
    >
      {[...all_friends].map((u) => (
        <MenuItem value={u.name}>{u.name}</MenuItem>
      ))}
    </Select>
  );
}
