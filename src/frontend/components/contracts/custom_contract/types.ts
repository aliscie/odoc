export let PAYMENTS = "payments";
export let PROMISES = "promises";
export let CONTRACT = "contract";
export let CREATE_CONTRACT = "create_contract"

export type PaymentRow = {
    id: string,
    amount: number,
    sender: string,
    receiver: string,
    released: boolean,
}