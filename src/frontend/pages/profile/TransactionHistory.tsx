import List from "@mui/material/List";
import {Exchange} from "../../../declarations/backend/backend.did";
import ContractItem  from "./ContractItem";

interface TransactionProps {
    transactionRecords: Array<Exchange>
}

const  TransactionHistory = ({ transactionRecords }: TransactionProps) => {
    return (
        <div style={{ height: '300px', overflowY: 'auto' }}>
            <List dense>
                {transactionRecords.map((item: any, index: number) => {
                    return <ContractItem {...item} id={index} sender={item.from} receiver={item.to}/>
                })}
            </List>
        </div>
    );
}

export default TransactionHistory;
