import * as React from "react";
import {useState} from "react";
import {Button, Typography} from "@mui/material";
import DialogOver from "../../genral/daiolog_over";
import {SharePaymentOption} from "../../../../declarations/user_canister/user_canister.did";

function PayButton({contract}: { SharesContract }) {
    const [loading, setLoading] = useState(false);
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    // const dispatch = useDispatch();

    const handleRelease = async () => {
        setLoading(true)
        // let res = await actor.release_payment(contract.contract_id);
        // console.log({res})
        // setLoading(false)
        // if ("Ok" in res) {
        //     let new_contract = {
        //         contract_id: contract.contract_id,
        //         canceled: false,
        //         released: true,
        //     }
        //     dispatch(handleRedux("UPDATE_CONTRACT", {contract: new_contract}))
        // } else {
        //     enqueueSnackbar(res.Err, {variant: "error"})
        // }

    };

    let Dialog = (props: any) => {
        return <>
            {/*<Typography bold={true} color={"orange"} variant={'subtitle2'}>Confirmation</Typography>*/}
            {contract.payment_options.map((option: SharePaymentOption) => {
                return <Typography>
                    <Typography variant={"subtitle2"}>{option.title + " "}</Typography>
                    <Typography variant={"caption"}>{" " + option.amount.toString()}<span style={{color:"lightgreen"}}>USDC</span></Typography>
                    <Typography variant={"caption"}>{" " + option.description}</Typography>
                    <Button
                        onClick={() => {
                            // handleRelease()
                            // props.handleClick()
                        }}
                    >Pay now</Button>
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