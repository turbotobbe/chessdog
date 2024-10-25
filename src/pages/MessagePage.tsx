import React from 'react';
import { Box, Typography } from '@mui/material';

type MessagePageProps = {
    title: string;
    message: string;
}
const MessagePage: React.FC<MessagePageProps> = ({
    title,
    message
}) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            textAlign: 'center',
            p: 2
        }}>
            <Typography variant="h4">{title}</Typography>
            <Typography variant="body1">{message}</Typography>
        </Box>
    );
};

export default MessagePage;
