import { RenderEditCellProps } from "react-data-grid";
import { useSelector } from "react-redux";
import convertCamelToTitle from "../../../utils/convertCamelToTitle";

export function renderStatusCell({ row, onRowChange }: RenderEditCellProps) {
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
  return <div>{convertCamelToTitle(row.status)}</div>;
}
