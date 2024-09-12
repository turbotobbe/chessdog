import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Chessboard from './Chessboard';
import { getRandomBoard } from '../utils/boardUtil';

const Analysis: React.FC = () => {

    // const initialState = getDefaultBoard();
    const initialState = getRandomBoard(['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp']);
    console.log(initialState);
    // initialState.setBoard(getDefaultBoard());
    // initialState.setBoard(getRandomBoard(['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp']));

    // const [state, setState] = useState(initialState);
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 2, height: '100%' }}>
            <Paper elevation={1} sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Chessboard state={initialState} />
            </Paper>
            <Paper elevation={1} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography variant="h6" sx={{ p: 2 }}>
                    Analysis Results
                </Typography>
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    <Typography>
                        Here you can display analysis results, move suggestions, etc.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Analysis;