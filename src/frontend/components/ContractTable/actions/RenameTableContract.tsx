import { useEffect } from "react";
import { handleRedux } from "../../../redux/store/handleRedux";
import { useDispatch } from "react-redux";
import { Input } from "@mui/material";
import { debounce } from "lodash";

function RenameTableContract({ contract, view }) {
  if (view.contract) {
    return null;
  }

  let contractId = view.contract.id;
  const dispatch = useDispatch();
  // const onChange = debounce((event: any) => {
  //   let contracts = props.contract.contracts.map((c) => {
  //     if (c.id === contractId) {
  //       return { ...c, name: event.target.value };
  //     }
  //     return c;
  //   });
  //   let updateContract = { ...props.contract, contracts };
  //   dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
  //   return { Ok: "Ok" };
  // }, 300);

  const onChange = debounce((event: any) => {
    try {
      let contracts = contract.contracts.map((c) =>
        c.id === contractId ? { ...c, name: event.target.value } : c,
      );
      dispatch(handleRedux("UPDATE_CONTRACT", { contracts }));
    } catch (error) {
      console.error("Error updating contract:", error);
    }
  }, 300);

  useEffect(() => {
    return () => {
      onChange.cancel();
    };
  }, [onChange]);

  return (
    <div>
      <Input onChange={onChange} defaultValue={view.contract.name} />
    </div>
  );
}

export default RenameTableContract;
