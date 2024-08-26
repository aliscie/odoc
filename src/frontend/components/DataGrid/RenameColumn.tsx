import { Input } from "@mui/material";
import { debounce } from "lodash";
import { logger } from "../../DevUtils/logData";

function RenameColumn(props: any) {
  const { setColumns, column, onRenameColumn } = props;
  const debouncedOnChange = debounce((e: any) => {
    setColumns((prev: any) => {
      return prev.map((c: any) => {
        if (c.id === column.id) {
          onRenameColumn(column.key || column.id, e.target.value);
          return { ...c, name: e.target.value };
        }
        return c;
      });
    });
  }, 300); // delay in ms

  const onBlur = (e: any) => {};
  const onClick = (e: any) => {
    // e.preventDefault()
  };
  return (
    <Input
      onClick={onClick}
      defaultValue={props.column.name}
      onChange={debouncedOnChange}
      onBlur={onBlur}
    />
  );
}

export default RenameColumn;
