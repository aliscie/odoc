import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {useSnackbar} from "notistack";
import {useBackendContext} from "../../../contexts/BackendContext";
import LoaderButton from "../../MuiComponents/LoaderButton";
import {handleRedux} from "../../../redux/store/handleRedux";
import {useDispatch} from "react-redux";

function DeleteTableContract(props) {
    if (!props.view.contract) {
        return null;
    }
    let contractId = props.view.contract.id;
    const dispatch = useDispatch();
    const onClick = async () => {

        let contracts = props.contract.contracts.filter(c => c.id !== contractId);
        let updateContract = {...props.contract, contracts}
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updateContract}));
        return {"Ok": "Ok"};
    }
    let icon = <DeleteIcon color={'error'}/>;
    return (<LoaderButton startIcon={icon} onClick={onClick}>Delete table contract</LoaderButton>)
}

export default DeleteTableContract;
