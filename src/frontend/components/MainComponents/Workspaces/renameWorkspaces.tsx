import { WorkSpace } from "../../../../declarations/backend/backend.did";
import { Input } from "@mui/material";
import LoaderButton from "../../MuiComponents/LoaderButton";
import { useRef, useState } from "react";
import { useBackendContext } from "../../../contexts/BackendContext";
import { useDispatch } from "react-redux";
import { handleRedux } from "../../../redux/store/handleRedux";

function RenameWorkspace(workspace: WorkSpace) {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const [state, setState] = useState(false);
  const ref = useRef(workspace.name);
  return (
    <div>
      <Input
        onChange={(e) => {
          !state && setState(true);
          ref.current = e.target.value;
        }}
        defaultValue={workspace.name}
      />
      {state && (
        <LoaderButton
          onClick={() => {
            let name = ref.current;
            let res = backendActor?.save_work_space({ ...workspace, name });
            dispatch(
              handleRedux("UPDATE_WORKSPACE", {
                workspace: { ...workspace, name },
              }),
            );
            return res;
          }}
        >
          Save
        </LoaderButton>
      )}
    </div>
  );
}

export default RenameWorkspace;
