import { useDispatch, useSelector } from "react-redux";
import { MenuItem, Select } from "@mui/material";
import { Principal } from "@dfinity/principal";
import { handleRedux } from "../../../redux/store/handleRedux";

export function UserDropDown(props) {
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
  let users = [...all_friends, profile];
  let u = users.find((u) => u.id == props.value);

  const dispatch = useDispatch();
  function handleChanges(newValue) {
    let user = users.find((i) => i.name == newValue);

    let contract = { ...props.contract };
    let promise = contract.promises.find((p) => p.id == props.data.id) || {
      id: props.data.id,
    };
    promise = { ...promise, [props.column.colId]: Principal.fromText(user.id) };

    contract.promises = contract.promises
      .filter((p) => p.id !== promise.id)
      .concat(promise);

    dispatch(handleRedux("UPDATE_CONTRACT", { contract }));
  }
  // console.log({ z: props.column.colId == "receiver" });
  // console.log({ x: props.column.colId == "sender" });

  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={u && u.name}
      label="Age"
      fullWidth={true}
      onChange={
        (event) => handleChanges(event.target.value)
      }
    >
      {[...all_friends].map((u) => {
        return <MenuItem value={u.name}>{u.name}</MenuItem>;
      })}
    </Select>
  );
}
