import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { getDefaultBoard } from '../utils/boardUtil';
import { BoardState, SquareId } from '@/models/BoardState';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FlipIcon from '@mui/icons-material/Flip';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Chessboard3 from './Chessboard3';
import { HotKeys } from 'react-hotkeys';

const Analysis: React.FC = () => {
    const [boardStates, setBoardStates] = useState<BoardState[]>([]);
    const [currentBoardStateIndex, setCurrentBoardStateIndex] = useState<number>(-1);
    const [asWhite, setAsWhite] = useState<boolean>(true);
    const initializedRef = useRef(false);

    const keyMap = {
        PREVIOUS: 'ArrowLeft',
        NEXT: 'ArrowRight',
        FIRST: 'ArrowUp',
        LAST: 'ArrowDown',
    };

    const handlers = {
        PREVIOUS: () => {
            console.log('previous');
            handlePreviousPage();
        },
        NEXT: () => {
            console.log('next');
            handleNextPage();
        },
        FIRST: () => {
            console.log('first');
            handleFirstPage();
        },
        LAST: () => {
            console.log('last');
            handleLastPage();
        },
    };

    const handleResetBoard = useCallback(() => {
        const initialState = getDefaultBoard();
        setBoardStates([initialState]);
        setCurrentBoardStateIndex(0);
    }, [])

    const handleFirstPage = useCallback(() => {
        setCurrentBoardStateIndex(prevIndex => {
            console.log(`first ${prevIndex}`);
            if (boardStates.length > 0 && prevIndex !== 0) {
                return 0;
            }
            return prevIndex;
        })
    }, [boardStates.length])

    const handlePreviousPage = useCallback(() => {
        setCurrentBoardStateIndex(prevIndex => {
            console.log(`previous ${prevIndex}`);
            if (prevIndex > 0) {
                return prevIndex - 1;
            }
            return prevIndex;
        })
    }, [])

    const handleNextPage = useCallback(() => {
        setCurrentBoardStateIndex(prevIndex => {
            console.log(`next ${prevIndex}`);
            if (prevIndex < boardStates.length - 1) {
                return prevIndex + 1;
            }
            return prevIndex;
        });
    }, [boardStates.length]);

    const handleLastPage = useCallback(() => {
        setCurrentBoardStateIndex(prevIndex => {
            console.log(`last ${prevIndex}`);
            if (prevIndex !== boardStates.length - 1 && boardStates.length > 0) {
                return boardStates.length - 1;
            }
            return prevIndex;
        })
    }, [boardStates.length])

    const movePiece = useCallback((sourceSquareId: SquareId, targetSquareId: SquareId) => {
        setBoardStates(prevBoardStates => {
            console.log('movePiece', sourceSquareId, targetSquareId, prevBoardStates.length, currentBoardStateIndex);

            // check if there are at least one state in the array
            if (prevBoardStates.length === 0) {
                console.warn('no board states available to move pieces.');
                return prevBoardStates;
            }

            // Clone the current board state
            const currentBoardState = prevBoardStates[currentBoardStateIndex];
            const clonedBoardState = currentBoardState.clone();
            try {   
                clonedBoardState.movePiece(sourceSquareId, targetSquareId);
            } catch (error) {
                console.error('error moving piece', error);
                return prevBoardStates;
            }

            // Create a new array without mutating the previous state
            const newBoardStates = prevBoardStates.slice(0, currentBoardStateIndex + 1);
            newBoardStates.push(clonedBoardState);

            // Update both state variables together
            setCurrentBoardStateIndex(newBoardStates.length - 1); // Set to the last index after adding the new state

            return newBoardStates;
        })
    }, [currentBoardStateIndex])

    useEffect(() => {
        if (!initializedRef.current) {
            const initialState = getDefaultBoard();
            setBoardStates([initialState]);
            setCurrentBoardStateIndex(0);
            // console.log(initialState);
            initializedRef.current = true;
        }
        console.log('move', boardStates.length, currentBoardStateIndex);
    }, []);

    useEffect(() => {
        console.log(`index: ${currentBoardStateIndex}, length: ${boardStates.length}`);
    }, [currentBoardStateIndex, boardStates.length]);

    if (currentBoardStateIndex < 0) {
        return <div>Loading...</div>;
    }

    return (
        <HotKeys keyMap={keyMap} handlers={handlers}>
            <Box
                className='analysis'
                sx={{
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr auto',
                    gridTemplateColumns: '1fr 2fr',
                    height: '100vh',
                    gap: 2,
                    p: 2
                }}
                tabIndex={0}
            >

                {/* header section */}
                <Box
                    className='header'
                    sx={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2
                    }}>
                    <Typography variant="h6">Analysis</Typography>
                </Box>

                {/* chessboard section */}
                <Paper
                    elevation={1}
                    sx={{
                        gridRow: "2 / 3",
                        gridColumn: '1 / 2',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2
                    }}>

                    <Chessboard3 boardState={boardStates[currentBoardStateIndex]} asWhite={asWhite} movePiece={movePiece} />

                </Paper>

                {/* analysis results section */}
                <Paper
                    elevation={1}
                    sx={{
                        gridRow: "2/3",
                        gridColumn: '2 / 3',
                        flexGrow: 1,
                        flexDirection: 'column',
                        p: 2
                    }}>
                    <Typography variant="h6" sx={{ p: 2 }}>
                        Analysis Results
                    </Typography>
                    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                        <Typography>
                            Here you can display analysis results, move suggestions, etc.
                        </Typography>
                    </Box>
                </Paper>

                {/* left column footer */}
                <Paper
                    elevation={1}
                    className='left-controls'
                    sx={{
                        gridRow: "3 / 4",
                        gridColumn: '1 / 2',
                        p: 2
                    }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" onClick={() => setAsWhite(!asWhite)}>
                            <FlipIcon />
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => handleResetBoard()}>
                            <RestartAltIcon />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFirstPage()}
                            disabled={currentBoardStateIndex <= 0}
                        >
                            <FirstPageIcon />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handlePreviousPage()}
                            disabled={currentBoardStateIndex <= 0}
                        >
                            <NavigateBeforeIcon />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleNextPage()}
                            disabled={currentBoardStateIndex >= boardStates.length - 1}
                        >
                            <NavigateNextIcon />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleLastPage()}
                            disabled={currentBoardStateIndex >= boardStates.length - 1}
                        >
                            <LastPageIcon />
                        </Button>
                    </Box>
                </Paper>

                {/* right column footer */}
                <Paper
                    className='right-controls'
                    sx={{
                        gridRow: "3 / 4",
                        gridColumn: '2 / 3',
                        p: 2
                    }}>
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} Chess Dog. All rights reserved.
                    </Typography>
                </Paper>
            </Box>
        </HotKeys>
    );
};

export default Analysis;