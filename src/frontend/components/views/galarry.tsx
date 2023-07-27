import * as React from 'react';
import Box from '@mui/material/Box';
import {useSelector} from "react-redux";
import ReleaseButton from "../contracts/payment_contract/release_button";
import ConfirmButton from "../contracts/payment_contract/confirm_button";
import CancelButton from "../contracts/payment_contract/cancel_button";
import BasicCard from "../genral/card";
import useGetUser from "../../utils/get_user_by_principal";

// const VISIBLE_FIELDS = ['id', 'contract', 'cells', 'requests'];

function GalleryView({items}: any) {

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px'}}>
            {items.map((item) => (
                <GalleryItem key={item.id} item={item}/>
            ))}
        </Box>
    );
}

interface GalleryItemProps {
    item: any;
}

function GalleryItem({item}: GalleryItemProps) {
    const {contracts, all_friends} = useSelector((state: any) => state.filesReducer);
    const contract = contracts && contracts[item.id]
    let {getUser} = useGetUser();
    console.log({contract})
    return (
        <BasicCard
            actions={<><ReleaseButton contract={contract}/>
                <ConfirmButton
                    sender={contract.sender}
                    id={contract.contract_id}
                    confirmed={contract.confirmed}
                />
                <CancelButton contract={contract}/></>}
        >
            <div>receiver:{getUser(contract.receiver)}</div>
            <div>sender:{getUser(contract.sender)}</div>
            {/*<div>{item.id}</div>*/}
            {/*<div>{contract.amount}</div>*/}
            {/*<div>{contract.released ? "i" : "X"}</div>*/}
            {/*<div>{contract.canceled && "X"}</div>*/}
            {/*<div>{contract.confirmed && <ShareIcon/>}</div>*/}


        </BasicCard>
    );
}

export default GalleryView;
