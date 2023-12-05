import * as React from "react";
import {useState} from "react";
import {Typography} from "@mui/material";
import DialogOver from "../../genral/daiolog_over";
import {SharePaymentOption} from "../../../../declarations/user_canister/user_canister.did";
import {actor} from "../../../App";
import {logger} from "../../../dev_utils/log_data";
import {LoadingButton} from "@mui/lab";

function PayButton({contract}: { SharesContract }) {
    const [loading, setLoading] = useState(false);
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    // const dispatch = useDispatch();

    const handlePay = async (option: any) => {
        setLoading(true);
        let payment_res = actor && await actor.pay_for_share_contract(contract.contract_id, option.amount);
        setLoading(false);
        logger({payment_res})
    }

    let Dialog = (props: any) => {
        return <>
            {/*<Typography bold={true} color={"orange"} variant={'subtitle2'}>Confirmation</Typography>*/}
            {contract.payment_options.map((option: SharePaymentOption) => {
                return <Typography>
                    <Typography variant={"subtitle2"}>{option.title + " "}</Typography>
                    <Typography variant={"caption"}>{" " + option.amount.toString()}<span
                        style={{color: "lightgreen"}}>USDC</span></Typography>
                    <Typography variant={"caption"}>{" " + option.description}</Typography>
                    <LoadingButton
                        loading={loading}
                        onClick={async () => await handlePay(option)}
                    >Pay now</LoadingButton>
                </Typography>
            })
            }
        </>
    }
    // let children = contract.released ? <DoneAllIcon color={"success"}/> : <SendIcon/>
    return (
        <DialogOver
            size={"small"}
            color={"success"}
            // disabled={contract.released}
            variant="text"
            DialogContent={Dialog}>
            Pay
            {/*{loading ? <span className={"loader"}></span> : children}*/}

        </DialogOver>
    );
}

export default PayButton