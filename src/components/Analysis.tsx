import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { getDefaultBoard, movePiece } from '../utils/boardUtil';
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
            handlePreviousPage();
        },
        NEXT: () => {
            handleNextPage();
        },
        FIRST: () => {
            handleFirstPage();
        },
        LAST: () => {
            handleLastPage();
        },
    };

    const handleResetBoard = () => {
        setCurrentBoardStateIndex(_ => {
            setBoardStates(_ => {
                const initialState = getDefaultBoard();
                const newBoardStates = [initialState];
                return newBoardStates;
            })
            return 0;
        })
    }

    const handleFirstPage = () => {
        setBoardStates(currentBoardStates => {
            setCurrentBoardStateIndex(currentIndex => {
                console.log(`handleFirstPage ${currentIndex} ${currentBoardStates.length}`);
                if (currentBoardStates.length > 0 && currentIndex !== 0) {
                    return 0;
                }
                return currentIndex;
            })
            return currentBoardStates;
        });
    }

    const handlePreviousPage = () => {
        setBoardStates(currentBoardStates => {
            setCurrentBoardStateIndex(currentIndex => {
                console.log(`handlePreviousPage ${currentIndex} ${currentBoardStates.length}`);
                if (currentIndex > 0) {
                    return currentIndex - 1;
                }
                return currentIndex;
            })
            return currentBoardStates;
        });
    }

    const handleNextPage = () => {
        setBoardStates(currentBoardStates => {
            setCurrentBoardStateIndex(currentIndex => {
                console.log(`handleNextPage ${currentIndex} ${currentBoardStates.length}`);
                if (currentIndex < currentBoardStates.length - 1) {
                    return currentIndex + 1;
                }
                return currentIndex;
            });
            return currentBoardStates;
        });
    }

    const handleLastPage = () => {
        setBoardStates(currentBoardStates => {
            setCurrentBoardStateIndex(currentIndex => {
                console.log(`handleLastPage ${currentIndex} ${currentBoardStates.length}`);
                if (currentIndex !== currentBoardStates.length - 1 && currentBoardStates.length > 0) {
                    return currentBoardStates.length - 1;
                }
                return currentIndex;
            })
            return currentBoardStates;
        });
    }

    const handleMovePiece = (sourceSquareId: SquareId, targetSquareId: SquareId) => {
        setBoardStates(currentBoardStates => {
            let newBoardStates = currentBoardStates;

            setCurrentBoardStateIndex(currentIndex => {
                console.log(`handleMovePiece ${currentIndex} ${currentBoardStates.length} ${sourceSquareId} ${targetSquareId}`);

                if (currentBoardStates.length === 0) {
                    console.warn('No board states available to move pieces.');
                    return currentIndex;
                }

                const currentBoardState = currentBoardStates[currentIndex];

                try {
                    const newBoardState = movePiece(currentBoardState, sourceSquareId, targetSquareId);

                    // Create a new array with states up to the current index, plus the new state
                    newBoardStates = [
                        ...currentBoardStates.slice(0, currentIndex + 1),
                        newBoardState
                    ];

                    return newBoardStates.length - 1; // New index
                } catch (error) {
                    console.error('Error moving piece:', error);
                    return currentIndex;
                }
            });

            return newBoardStates; // Return the new board states
        });
    }

    useEffect(() => {
        if (!initializedRef.current) {
            handleResetBoard()
            initializedRef.current = true;
        }
    }, []);

    // useEffect(() => {
    //     console.log(`update index: ${currentBoardStateIndex}, length: ${boardStates.length}`);
    // }, [currentBoardStateIndex, boardStates]);

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

                    <Chessboard3 boardState={boardStates[currentBoardStateIndex]} asWhite={asWhite} movePiece={handleMovePiece} />

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
                    {/* <Typography variant="body2">
                        &copy; {new Date().getFullYear()} Chess Dog. All rights reserved.
                    </Typography> */}
                </Paper>
            </Box>
        </HotKeys>
    );
};

export default Analysis;