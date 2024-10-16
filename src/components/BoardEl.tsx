import React, { useEffect, useRef, useState } from 'react';
import { Box, SxProps } from '@mui/material';

import './BoardEl.css';
// import './Chessboard3.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { useIsTouchDevice } from '@/contexts/IsTouchDevice';
import { PieceName, SquareId } from '@/types/chess';
import { ChessGameState, asSquareId, asSquareInfo } from '@/models/chess';
import CommentsEl from './CommentsEl';

import ChessboardImage from '@/assets/chessboard.png';
import BoardPieceEl from './BoardPieceEl';
import SquareEl from './SquareEl';

// Add this function inside the BoardEl component or in a separate utility file
const calculateArrowPoints = (from: SquareId, to: SquareId, boardSize: number, asWhite: boolean): string => {
    console.log('Calculating arrow points for board size:', from, to, boardSize);
    const squareSize = boardSize / 8;
    const arrowWidth = squareSize * 0.2;
    const arrowHeadSize = squareSize * 0.4;

    const getSquareCenter = (square: SquareId): [number, number] => {
        const squareInfo = asSquareInfo(square);
        return [
            (squareInfo.fileIndex + 0.5) * squareSize,
            (squareInfo.rankIndex + 0.5) * squareSize
        ];
    };

    const [x1, y1] = getSquareCenter(from);
    const [x2, y2] = getSquareCenter(to);
    console.log('Square centers:', x1, y1, x2, y2);

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    console.log('angle length:', angle, length);

    const baseOffset = squareSize * 0.35; // 80% of half a square

    // orginal arrow points, the base of the arrow is at 0,0 and the tip is at length,0
    let points: [number, number][] = [
        [baseOffset, 0],
        [baseOffset, 0 - (arrowWidth / 2)],
        [length - arrowHeadSize, 0 - (arrowWidth / 2)],
        [length - arrowHeadSize, 0 - (arrowHeadSize / 2)],
        [length, 0],
        [length - arrowHeadSize, 0 + (arrowHeadSize / 2)],
        [length - arrowHeadSize, 0 + (arrowWidth / 2)],
        [baseOffset, 0 + (arrowWidth / 2)],
        [baseOffset, 0]
    ];

    // rotate the arrow points
    points = points.map(([x, y]) => {
        const rotatedX = x * Math.cos(angle) - y * Math.sin(angle) + x1;
        const rotatedY = x * Math.sin(angle) + y * Math.cos(angle) + y1;
        return [rotatedX, asWhite ? boardSize - rotatedY : rotatedY];
    });

    return points.map(([x, y]) => [x, y].join(',')).join(' ');
};

type BoardElProps = {
    sx?: SxProps,
    chessGameState: ChessGameState,
    asWhite: boolean,
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId, promotionPieceName?: PieceName) => void
}


const BoardEl: React.FC<BoardElProps> = ({
    sx,
    chessGameState,
    asWhite,
    movePiece
}) => {

    const boardRef = useRef<HTMLDivElement>(null);
    const [boardSize, setBoardSize] = useState(0);

    const { isTouchDevice } = useIsTouchDevice();

    // console.log('comments, arrows, marks', chessGameState.comments, chessGameState.arrows, chessGameState.marks)
    useEffect(() => {
        const updateBoardSize = () => {
            if (boardRef.current) {
                const rect = boardRef.current.getBoundingClientRect();
                const boardSize = Math.min(rect.width, rect.height);
                if (boardSize > 0) {
                    setBoardSize(boardSize);
                }
            }
        }
        updateBoardSize();
        window.addEventListener('resize', updateBoardSize);
        return () => window.removeEventListener('resize', updateBoardSize);
    }, []);

    return (
        <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
            <Box className={`chessboard ${asWhite ? 'as-white' : 'as-black'}`}
                ref={boardRef}

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
                    background: `url(${ChessboardImage})`,
                    backgroundSize: 'cover',
                    ...sx
                }}
            >
                {/* base grid */}
                {Array.from({ length: 8 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => (<SquareEl key={`${row}-${col}`}
                        asWhite={asWhite}
                        col={col}
                        row={row}
                        chessGameState={chessGameState}
                        movePiece={movePiece}
                    ></SquareEl>)
                    ))}

                <CommentsEl chessGameState={chessGameState} asWhite={asWhite} />
                {/* pieces */}

                {Array.from({ length: 8 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => {
                        const fileIndex = asWhite ? col : 7 - col;
                        const rankIndex = asWhite ? 7 - row : row;
                        const squareId: SquareId = asSquareId(fileIndex, rankIndex);
                        const piece = chessGameState.getPieceAt(squareId);

                        if (piece) {
                            let endOfGame = '';
                            if (piece.pieceName === 'k') {
                                if (chessGameState.isStalemate) {
                                    endOfGame = 'draw';
                                } else if (chessGameState.blackKingInCheckMate) {
                                    endOfGame = piece.colorName === 'b' ? 'lose' : 'win';
                                } else if (chessGameState.whiteKingInCheckMate) {
                                    endOfGame = piece.colorName === 'w' ? 'lose' : 'win';
                                }
                            }
                            return <BoardPieceEl
                                overlay={endOfGame}
                                key={squareId}
                                squareId={squareId}
                                colorName={piece.colorName}
                                pieceName={piece.pieceName}
                                canDrag={true}
                            />
                        }
                        return null;
                    })
                )}
                {/* arrows */}
                {boardSize > 0 && (
                    <svg
                        viewBox={`0 0 ${boardSize} ${boardSize}`}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 1000
                        }}
                    >
                        {chessGameState.arrows && chessGameState.arrows.map(({ fromSquareId, toSquareId }) => (
                            <polygon key={`${fromSquareId}-${toSquareId}`}
                                points={calculateArrowPoints(fromSquareId, toSquareId, boardSize, asWhite)}
                                fill="rgba(255, 170, 0, 0.8)"
                                opacity={0.8}
                            />
                        ))}
                    </svg>
                )
                }
            </Box>
        </DndProvider>
    );
};

export default BoardEl;
