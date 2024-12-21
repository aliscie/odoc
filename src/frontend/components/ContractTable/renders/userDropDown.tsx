import { useDispatch, useSelector } from "react-redux";
import { MenuItem, Select } from "@mui/material";
import { Principal } from "@dfinity/principal";
import { handleRedux } from "../../../redux/store/handleRedux";
import { randomString } from "../../../DataProcessing/dataSamples";
import { CPayment } from "../../../../declarations/backend/backend.did";

export function UserDropDown(props) {
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
  let users = [...all_friends, profile];
  let u = users.find((u) => u.id == props.value);

  const dispatch = useDispatch();
  function handleChanges(newValue) {
    props.onChange && props.onChange(newValue);
    let user = users.find((i) => i.name == newValue);

    let contract = { ...props.contract };
    const id = props.data.id == "0" ? randomString() : props.data.id;

    let promise: CPayment | null = contract.promises.find(
      (p) => p.id == props.data.id,
    );

    if (!promise) {
      promise = {
        id,
        receiver: Principal.fromText(user.id),
        sender: Principal.fromText(profile.id),
        amount: 0,
        status: { None: null },
        date_created: Number(new Date().toISOString()),
        date_released: Number(new Date().toISOString()),
        cells: [],
        contract_id: contract.id,
      };
    }
    //     || {
    //   id,
    // };
    //
    // promise = { ...promise, [props.column.colId]: Principal.fromText(user.id) };
    //
    contract.promises = contract.promises
      .filter((p) => p.id !== promise.id)
      .concat(promise);
    // console.log({ contract });
    dispatch(handleRedux("UPDATE_CONTRACT", { contract }));
  }
  // console.log({ z: props.column.colId == "receiver" });
  // console.log({ x: props.column.colId == "sender" });

  return (
    <Select
      {...props}
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={u && u.name}
      label="User"
      fullWidth={true}
      onChange={(event) => handleChanges(event.target.value)}
    >
      {[...all_friends].map((u) => {
        return <MenuItem value={u.name}>{u.name}</MenuItem>;
      })}
    </Select>
  );
}
