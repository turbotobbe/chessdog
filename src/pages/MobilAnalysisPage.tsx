import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

import wp from '../assets/wp.png';

const MobilAnalysisPage: React.FC = () => {
    return (
        <Box>

            {/* board and sidepanel container */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                // minHeight: '100vh',
                boxSizing: 'border-box',
                // padding: 2,

            }}>
                {/* chess board container */}
                <Paper elevation={1} sx={{
                    display: 'flex',

                }}>

                    {/* chess board */}
                    <Box className="chessboard" sx={{
                        width: '100%',
                        height: '100%',
                        aspectRatio: '1 / 1'
                    }}>
                        {/* chess board grid */}
                        <Box className="grid" sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(8, 1fr)',
                            gridTemplateRows: 'repeat(8, 1fr)',
                            height: '100%',
                            width: '100%',
                        }}>
                            {Array.from({ length: 8 }, (_, row) =>
                                Array.from({ length: 8 }, (_, col) => (
                                    <Box key={`${row}-${col}`} sx={{
                                        border: '1px solid #ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {row}-{col}
                                        {/* <img src={wp} alt="wp" style={{ width: '100%', height: '100%' }} /> */}
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* more stuff Here */}
            <Box>
                {Array.from({ length: 8 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => (
                        <Typography p={2} key={`${row}-${col}`} variant="body1">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam dolorum quibusdam, quisquam nisi eaque sequi deleniti aperiam consectetur soluta, saepe dignissimos mollitia? Neque accusamus rerum, consequuntur perspiciatis sint similique quisquam.</Typography>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default MobilAnalysisPage;
