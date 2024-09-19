import React from 'react';
import { Box } from '@mui/material';
import { BoardState, lightSquareIds, pieceFullNames, PieceInfo, SquareId } from '@/models/BoardState';

import './Chessboard3.css';
import wk from '../assets/wk.png';
import wq from '../assets/wq.png';
import wr from '../assets/wr.png';
import wb from '../assets/wb.png';
import wn from '../assets/wn.png';
import wp from '../assets/wp.png';
import bk from '../assets/bk.png';
import bq from '../assets/bq.png';
import br from '../assets/br.png';
import bb from '../assets/bb.png';
import bn from '../assets/bn.png';
import bp from '../assets/bp.png';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { toSquareId } from '@/utils/boardUtil';
import { useIsTouchDevice } from '@/contexts/IsTouchDevice';

const ItemTypes = {
    PIECE: 'piece'
}
const pieceImages = {
    'p': { 'w': wp, 'b': bp },
    'n': { 'w': wn, 'b': bn },
    'b': { 'w': wb, 'b': bb },
    'r': { 'w': wr, 'b': br },
    'q': { 'w': wq, 'b': bq },
    'k': { 'w': wk, 'b': bk }
};

const BoardPiece: React.FC<{ squareId: SquareId, pieceInfo: PieceInfo, canDrag: boolean }> = ({ squareId, pieceInfo, canDrag }) => {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.PIECE,
        item: { squareId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }), [squareId])


    const pieceImage = pieceImages[pieceInfo.pieceName]?.[pieceInfo.colorName];
    if (!pieceImage) return null;

    const altText = `${pieceInfo.colorName === 'w' ? 'white' : 'black'} ${pieceFullNames[pieceInfo.pieceName]}`;

    return (
        <>
            <img
                ref={canDrag ? drag : null}
                className={`piece ${isDragging ? 'dragging' : ''}`}
                src={pieceImage}
                alt={altText}
            />
        </>
    );
}


const BoardSquare: React.FC<{
    squareId: SquareId,
    boardState: BoardState,
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId) => void
}> = ({
    squareId,
    boardState,
    movePiece,
}) => {

        // mark square
        const isLightSquare = lightSquareIds.includes(squareId);
        const classNames = ['square', squareId, isLightSquare ? 'white' : 'black'];

        // mark last move square
        const lastMove = boardState.getLastMove();
        if (lastMove) {
            if (lastMove.targetSquareId === squareId) {
                classNames.push('moved-to');
            }
            if (lastMove.sourceSquareId === squareId) {
                classNames.push('moved-from');
            }
        }

        function handleCanDrop(squareId: SquareId, draggedSquareId: SquareId, boardState: BoardState): boolean {
            const draggedPiece = boardState.getPiece(draggedSquareId);
            if (!draggedPiece) {
                return false;
            }
            if (draggedPiece.pieceInfo.colorName !== 'w' && boardState.isWhitesTurn()) {
                return false;
            }
            if (draggedPiece.pieceInfo.colorName !== 'b' && !boardState.isWhitesTurn()) {
                return false;
            }
            if (draggedPiece.validMoveSquareIds.includes(squareId)) {
                return true;
            }
            if (draggedPiece.captureMoveSquareIds.includes(squareId)) {
                return true;
            }
            return false;
        }

        const [{ isOver, canDrop }, drop] = useDrop(
            () => ({
                accept: ItemTypes.PIECE,
                canDrop: (item: { squareId: SquareId }) => handleCanDrop(squareId, item.squareId, boardState),
                drop: (item: { squareId: SquareId }) => movePiece(item.squareId, squareId),
                collect: (monitor) => ({
                    isOver: !!monitor.isOver(),
                    canDrop: !!monitor.canDrop()
                })
            }),
            [squareId, boardState]
        )

        if (isOver) {
            classNames.push('hover');
        }
        if (canDrop) {
            classNames.push('valid-move');
        }

        const piece = boardState.getPiece(squareId);
        let canDrag = false;
        if (piece) {
            canDrag = (piece.pieceInfo.colorName === 'w' && boardState.isWhitesTurn()) ||
                (piece.pieceInfo.colorName === 'b' && !boardState.isWhitesTurn());
            console.log(`canDrag: ${piece.pieceInfo.id} ${canDrag}`);
        }

        return (
            <Box key={squareId} className={classNames.join(' ')} ref={drop} >
                {piece && <BoardPiece squareId={squareId} pieceInfo={piece.pieceInfo} canDrag={canDrag} />}
            </Box>
        );
    }

const Chessboard3: React.FC<{
    boardState: BoardState,
    asWhite: boolean,
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId) => void
}> = ({
    boardState,
    asWhite,
    movePiece
}) => {

        const { isTouchDevice } = useIsTouchDevice();
        console.log(`isTouchDevice: ${isTouchDevice}`);
        return (
            <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
                <Box className="chessboard">
                    <Box className="grid" >
                        {Array.from({ length: 8 }, (_, row) =>
                            Array.from({ length: 8 }, (_, col) => {
                                const fileIndex = asWhite ? col : 7 - col;
                                const rankIndex = asWhite ? 7 - row : row;
                                const squareId: SquareId = toSquareId(fileIndex, rankIndex);
                                console.log(`squareId: ${squareId}, asWhite: ${asWhite}`);
                                return <BoardSquare
                                    key={squareId}
                                    squareId={squareId}
                                    boardState={boardState}
                                    movePiece={movePiece}
                                />
                            })
                        )}
                    </Box>
                </Box>
            </DndProvider>
        );
    };

export default Chessboard3;
