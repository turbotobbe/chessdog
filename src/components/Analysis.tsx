import React, { useEffect, useRef, useState } from 'react';
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

const Analysis: React.FC = () => {
    const [boardStates, setBoardStates] = useState<BoardState[]>([]);
    const [currentBoardStateIndex, setCurrentBoardStateIndex] = useState<number>(-1);
    const [asWhite, setAsWhite] = useState<boolean>(true);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!initializedRef.current) {
            // Generate the random board only once when the component mounts
            // const initialState = getRandomBoard(['wr1']);
            const initialState = getDefaultBoard();

            setBoardStates([initialState]);
            setCurrentBoardStateIndex(0);
            console.log(initialState); // Log only when the board is initially created
            initializedRef.current = true;
        }
    }, []);

    if (currentBoardStateIndex<0) {
        return <div>Loading...</div>; // Or some other loading indicator
    }

    function handleResetBoard(): void {
        const initialState = getDefaultBoard();
        setBoardStates([initialState]);
        setCurrentBoardStateIndex(0);
    }

    function handleFirstPage(): void {
        setCurrentBoardStateIndex(0);
    }

    function handlePreviousPage(): void {
        if (currentBoardStateIndex > 0) {
            setCurrentBoardStateIndex(currentBoardStateIndex - 1);
        }
    }

    function handleNextPage(): void {
        if (currentBoardStateIndex < boardStates.length - 1) {
            setCurrentBoardStateIndex(currentBoardStateIndex + 1);
        }
    }

    function handleLastPage(): void {
        setCurrentBoardStateIndex(boardStates.length - 1);
    }

    function movePiece(sourceSquareId: SquareId, targetSquareId: SquareId): void {
        const currentBoardState = boardStates[currentBoardStateIndex];
        const clonedBoardState = currentBoardState.clone();
        clonedBoardState.movePiece(sourceSquareId, targetSquareId);

        setBoardStates([...boardStates, clonedBoardState]);
        setCurrentBoardStateIndex(currentBoardStateIndex + 1);
    }

    return (
        <Box
            className='analysis'
            sx={{ display: 'grid', 
                gridTemplateRows: 'auto 1fr auto',
                gridTemplateColumns: '1fr 2fr',
                height: '100vh',
                gap: 2,
                p: 2
            }}>

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

                <Chessboard3 boardState={boardStates[currentBoardStateIndex]} asWhite={asWhite} movePiece={movePiece}/>

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

            {/* left column footer */  }
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
                    <Button variant="contained" color="primary"  onClick={() => handleResetBoard()}>
                        <RestartAltIcon />
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleFirstPage()}
                        disabled={currentBoardStateIndex <=0}
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
    );
};

export default Analysis;