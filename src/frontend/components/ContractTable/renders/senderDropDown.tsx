import { RenderEditCellProps } from "react-data-grid";
import { useSelector } from "react-redux";
import { MenuItem, Select } from "@mui/material";

export function senderDropDown({ row, onRowChange }: RenderEditCellProps) {
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={row.sender}
      label="Age"
      onChange={(event) =>
        onRowChange({ ...row, sender: event.target.value }, true)
      }
    >
      {[profile].map((u) => (
        <MenuItem value={u.name}>{u.name}</MenuItem>
      ))}
    </Select>
  );
}
