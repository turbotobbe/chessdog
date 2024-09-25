import React from 'react';
import { Box, SxProps } from '@mui/material';
import { BoardState, SquareId } from '@/models/BoardState';
import './BoardEl.css';
// import './Chessboard3.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { toSquareId } from '@/utils/board';
import { useIsTouchDevice } from '@/contexts/IsTouchDevice';
import BoardSquareEl from './BoardSquareEl';

type BoardElProps = {
    sx?: SxProps,
    boardState: BoardState,
    asWhite: boolean,
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId) => void
}


const BoardEl: React.FC<BoardElProps> = ({
    sx,
    boardState,
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
                        const squareId: SquareId = toSquareId(fileIndex, rankIndex);
                        return <BoardSquareEl
                            key={squareId}
                            squareId={squareId}
                            boardState={boardState}
                            movePiece={movePiece}
                        />
                    })
                )}
            </Box>
        </DndProvider>
    );
};

export default BoardEl;
