import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Divider, Typography, Box } from '@mui/material';
import Deposit from './actions/Deposit';
import Withdraw from './actions/Withdraw';

interface WalletSectionProps {
    wallet: any;
}

const WalletSection: React.FC<WalletSectionProps> = () => {

    const { wallet } = useSelector((state: any) => state.filesState)

    const balance = wallet?.balance?.balance;
    return (
        <Card style={{ borderRadius: 8, boxShadow: '0 0 3px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Wallet
                </Typography>
                <Divider style={{ margin: '16px 0' }} />
                <Typography variant="h6" align="center">
                    {balance} ckUSDC
                </Typography>
                <Divider style={{ margin: '16px 0' }} />
                <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Deposit />
                    <Withdraw />
                </Box>
            </CardContent>
    </Card>
    );
}
    
   

export default WalletSection;
