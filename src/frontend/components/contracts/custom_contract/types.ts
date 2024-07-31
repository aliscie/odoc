export let PAYMENTS = "payments";
export let PROMISES = "promises";
export let CONTRACT = "contract";
export let ACTION_BUTTON = 'action_button'
export let CREATE_CONTRACT = "create_contract"
export let CREATE_ACTION_BUTTON = "create_action_button"

export type PaymentRow = {
    id: string,
    amount: number,
    sender: string,
    receiver: string,
    released: boolean,
}
