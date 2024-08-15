import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';

interface Props {
    children: React.ReactNode;
    title: string;
    actions?: React.ReactNode;
}

const BasicCard: React.FC<Props> = ({ children, title, actions }) => {
    return (
        <Card sx={{ minWidth: 275, borderRadius: '12px', boxShadow: 2 }}>
            <CardContent>
                {title && (
                    <Typography variant="h5" component="div" textAlign="left">
                        {title}
                    </Typography>
                )}
                <Typography variant="body2" textAlign="left">
                    {children}
                </Typography>
            </CardContent>
            {actions && <CardActions>{actions}</CardActions>}
        </Card>
    );
};

export default BasicCard;
