import {useSelector} from "react-redux";
import {useSnackbar} from "notistack";

export function useTotalDept() {

    const {contracts, profile, wallet} = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let balance = Number(wallet.balance) || 0;

    let revoke_message = () => {
        let total_dept = 0;
        Object.keys(contracts).map((contract_id) => {
            let contract = contracts[contract_id];
            if (contract.receiver !== profile.id) {
                total_dept += Number(contract.amount);
            }
        })

        if (Number(total_dept) > Number(wallet.balance)) {
            enqueueSnackbar(
                <span style={{display: 'block'}}>
                    <div>Insufficient balance: <b>{balance} USDTs</b> </div>
                    <div>Dept:                 <b>{total_dept} USDTs</b> </div>
                    <div>Deposit required:     <b>${total_dept - balance} USDTs</b> </div>
                </span>, {variant: "error"})
            return true;
        }
        return false;
    };
    return {revoke_message}

}