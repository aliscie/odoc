import {useEffect} from "react";
import {handleRedux} from "../../../redux/store/handleRedux";
import {useDispatch} from "react-redux";
import {Input} from "@mui/material";
import {debounce} from "lodash";

function RenameTableContract({setView, contract, view}) {

    if (!view.contract) {
        return null;
    }

    let currContractId = view.contract.id;
    const dispatch = useDispatch();

    const onChange = debounce((event: any) => {
        let name = event.target.value;
        try {
            let updatedContract = {...contract}
            updatedContract.contracts = contract.contracts.map((c) =>
                c.id === currContractId ? {...c, name} : c,
            );
            dispatch(handleRedux("UPDATE_CONTRACT", {contract: updatedContract}));
            setView(p => {
                return {...p, name}
            })
        } catch (error) {
            console.log("Error updating contract:", error);
        }
    }, 300);

    // useEffect(() => {
    //   return () => {
    //     onChange.cancel();
    //   };
    // }, [onChange]);

    return <Input onChange={onChange} defaultValue={view.contract.name}/>;
}

export default RenameTableContract;
