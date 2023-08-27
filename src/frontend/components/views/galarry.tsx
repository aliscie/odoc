import * as React from 'react';
import Box from '@mui/material/Box';
import {useSelector} from "react-redux";
import BasicCard from "../genral/card";
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
