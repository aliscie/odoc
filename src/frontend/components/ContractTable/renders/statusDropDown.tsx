import { RenderEditCellProps } from "react-data-grid";
import convertCamelToTitle from "../../../utils/convertCamelToTitle";
import { MenuItem, Select } from "@mui/material";
import { handleRedux } from "../../../redux/store/handleRedux";
import { useDispatch, useSelector } from "react-redux";
import {
  CPayment,
  PaymentStatus,
} from "../../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { randomString } from "../../../DataProcessing/dataSamples";

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
  const dispatch = useDispatch();
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );

  const onCellValueChanged = (value: PaymentStatus) => {
    let contract = { ...props.contract };

    let promise: CPayment = props.contract.promises.find(
      (p) => p.id === props.data.id,
    );
    const id = props.data.id == "0" ? randomString() : props.data.id;
    if (!promise) {
      promise = {
        id,
        receiver: Principal.fromText(profile.id),
        sender: Principal.fromText(profile.id),
        amount: 0,
        status: { None: null },
        date_created: Number(new Date().toISOString()),
        date_released: Number(new Date().toISOString()),
        cells: [],
        contract_id: contract.id,
      };
    }

    promise = { ...promise, status: value };

    contract.promises = contract.promises
      .filter((p) => p.id !== promise.id)
      .concat(promise);
    dispatch(handleRedux("UPDATE_CONTRACT", { contract }));
  };

  return (
    <Select
      fullWidth={true}
      value={props.value}
      onChange={(event) => {
        let value: PaymentStatus | {} = {};
        value[event.target.value] = null;
        onCellValueChanged(value);
        // onRowChange({ ...row, status: event.target.value }, true);
      }}
    >
      {statuses.map((status) => (
        <MenuItem value={status}>{convertCamelToTitle(status)}</MenuItem>
      ))}
    </Select>
  );
}
