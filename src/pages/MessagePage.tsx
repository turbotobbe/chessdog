import React from 'react';
import { Box, Typography } from '@mui/material';

const AnalysisPage: React.FC<{ title: string; message: string }> = ({
    title,
    message
}) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            boxSizing: 'border-box'
        }}>
            <Typography variant="h4">{title}</Typography>
            <Typography variant="body1">{message}</Typography>
        </Box>
    );
};

export default AnalysisPage;
