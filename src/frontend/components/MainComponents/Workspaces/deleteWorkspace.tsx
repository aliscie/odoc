import { WorkSpace } from "../../../../declarations/backend/backend.did";
import { useBackendContext } from "../../../contexts/BackendContext";
import { handleRedux } from "../../../redux/store/handleRedux";
import { useDispatch } from "react-redux";
import ConformationMessage from "../../MuiComponents/conformationButton";

function DeleteWorkspace(workspace: WorkSpace) {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  return (
    <ConformationMessage
      message={"Yes delete it!"}
      conformationMessage={`Are you sure you want to delete ${workspace.name} workspace? `}
      onClick={async () => {
        let res = await backendActor?.delete_work_space({ ...workspace });
        dispatch(
          handleRedux("DELETE_WORKSPACE", {
            workspace,
          }),
        );
        return res;
      }}
    >
      Delete
    </ConformationMessage>
  );
}
export default DeleteWorkspace;
