import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
// import Chessboard from './Chessboard';
import { getDefaultBoard } from '../utils/boardUtil';
import { BoardState } from '@/models/BoardState';
import Chessboard3 from './Chessboard3';

const Analysis: React.FC = () => {
    const [boardState, setBoardState] = useState<BoardState | null>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!initializedRef.current) {
            // Generate the random board only once when the component mounts
            // const initialState = getRandomBoard(['wr1']);
            const initialState = getDefaultBoard();
            
            setBoardState(initialState);
            console.log(initialState); // Log only when the board is initially created
            initializedRef.current = true;
        }
    }, []);

    if (!boardState) {
        return <div>Loading...</div>; // Or some other loading indicator
    }
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 2, height: '100%' }}>
            <Paper elevation={1} sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Chessboard3 boardState={boardState}/>
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