import {useSelector} from "react-redux";
import {useSnackbar} from "notistack";

export function useTotalDept() {

    const {contracts, profile} = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let balance = 1000;

    let revoke_message = () => {
        let total_dept = 0;
        Object.keys(contracts).map((contract_id) => {
            let contract = contracts[contract_id];
            if (contract.receiver !== profile.id) {
                total_dept += Number(contract.amount);
            }
        })

        if (total_dept > 1000) {
            enqueueSnackbar(
                `Your balance is ${balance}ICPs and your dept is ${total_dept}ICPs.
                You can't promos more than you have.
                You need to deposit about ${total_dept - balance}ICPs.`, {variant: "error"})
            return true;
        }
        return false;
    };
    return {revoke_message}

}