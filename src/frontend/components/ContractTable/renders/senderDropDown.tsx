import { RenderEditCellProps } from "react-data-grid";
import { useSelector } from "react-redux";

export function senderDropDown({ row, onRowChange }: RenderEditCellProps) {
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
  return (
    <select
      className={"textEditorClassname"}
      value={row.sender}
      onChange={(event) =>
        onRowChange({ ...row, sender: event.target.value }, true)
      }
      autoFocus
    >
      {[...all_friends, profile].map((u) => (
        <option key={u.name} value={u.name}>
          {u.name}
        </option>
      ))}
    </select>
  );
}
