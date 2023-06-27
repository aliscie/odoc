export function normalize_contracts(json) {
    const dataStructure = {};
    for (const [key, value] of json) {
        const contractData = value.PaymentContract;
        dataStructure[key] = {
            contract_id: contractData.contract_id,
            sender: contractData.sender,
            released: contractData.released,
            confirmed: contractData.confirmed,
            amount: contractData.amount,
            receiver: contractData.receiver,
        };
    }
    return dataStructure;
}
