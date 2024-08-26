import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {useSnackbar} from "notistack";
import {useBackendContext} from "../../../contexts/BackendContext";
import LoaderButton from "../../MuiComponents/LoaderButton";
import {handleRedux} from "../../../redux/store/handleRedux";
import {useDispatch} from "react-redux";
import {Input} from "@mui/material";
import {debounce} from "lodash";

function RenameTableContract(props) {

    if (!props.view.contract) {
        return null;
    }

    let contractId = props.view.contract.id;
    const dispatch = useDispatch();
    const onChange = debounce((event: any) => {


        let contracts = props.contract.contracts.map(c => {
            if (c.id === contractId) {
                return {...c, name: event.target.value}
            }
            return c;
        });
        let updateContract = {...props.contract, contracts}
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updateContract}));
        return {"Ok": "Ok"};


    }, 300)

    return (<Input
        onChange={onChange}
        defaultValue={props.view.contract.name}/>)
}

export default RenameTableContract;
