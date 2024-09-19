import React from 'react';
import { Box, Typography } from '@mui/material';

const AnalysisPage: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h4">Analysis</Typography>
            <Typography variant="body1">This is the analysis page.</Typography>
          </Box>
    );
};

export default AnalysisPage;
