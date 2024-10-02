import React from 'react';
import { Box, SxProps } from '@mui/material';

import './BoardEl.css';
// import './Chessboard3.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { useIsTouchDevice } from '@/contexts/IsTouchDevice';
import BoardSquareEl from './BoardSquareEl';
import { SquareId } from '@/types/chess';
import { ChessGameState, asSquareId } from '@/models/chess';

type BoardElProps = {
    sx?: SxProps,
    chessGameState: ChessGameState,
    asWhite: boolean,
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId) => void
}


const BoardEl: React.FC<BoardElProps> = ({
    sx,
    chessGameState,
    asWhite,
    movePiece
}) => {

    const { isTouchDevice } = useIsTouchDevice();
    return (
        <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
            <Box className="chessboard"
                sx={{
                    display: 'grid',
                    width: 'fit-content',
                    height: 'fit-content',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gridTemplateRows: 'repeat(8, 1fr)',
                    aspectRatio: '1 / 1',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative',
                    ...sx
                }}
            >
                {Array.from({ length: 8 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => {
                        const fileIndex = asWhite ? col : 7 - col;
                        const rankIndex = asWhite ? 7 - row : row;
                        const squareId: SquareId = asSquareId(fileIndex, rankIndex);
                        return <BoardSquareEl
                            key={squareId}
                            squareId={squareId}
                            chessGameState={chessGameState}
                            movePiece={movePiece}
                        />
                    })
                )}
            </Box>
        </DndProvider>
    );
};

export default BoardEl;
