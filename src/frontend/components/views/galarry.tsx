import * as React from 'react';
import Box from '@mui/material/Box';
import {useSelector} from "react-redux";
import ReleaseButton from "../contracts/payment_contract/release_button";
import ConfirmButton from "../contracts/payment_contract/confirm_button";
import CancelButton from "../contracts/payment_contract/cancel_button";
import BasicCard from "../genral/card";
import useGetUser from "../../utils/get_user_by_principal";
import {ContractItem} from "../../pages/profile/contractss_history";


function GalleryView({items}: any) {
    const {profile, friends, contracts} = useSelector((state: any) => state.filesReducer);

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px'}}>
            {items.map((item) => (
                <BasicCard>
                    <ContractItem id={item.id} {...contracts[item.id]}/>
                </BasicCard>
            ))}
        </Box>
    );
}

export default GalleryView;
