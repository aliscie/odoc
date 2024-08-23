import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderTop: '1px solid #e0e0e0',
            }}
        >
            <TextField
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                multiline
                rowsMax={5}
                sx={{
                    flexGrow: 1,
                    marginRight: 1,
                    '& .MuiOutlinedInput-root': {
                        paddingRight: '40px',
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={handleSend} edge="end">
                            <SendIcon />
                        </IconButton>
                    ),
                }}
            />
        </Box>
    );
};

export default MessageInput;
