import { BoardState, lightSquareIds, SquareId } from "@/models/BoardState"
import { Box } from "@mui/material"
import { useDrop } from "react-dnd"
import BoardPieceEl from "./BoardPieceEl"

type BoardSquareElProps = {
    squareId: SquareId,
    boardState: BoardState,
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId) => void
}


const BoardSquareEl: React.FC<BoardSquareElProps> = ({
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
            accept: "piece",
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
    }

    return (
        <Box
            key={squareId}
            className={classNames.join(' ')}
            ref={drop}
            sx={{
                aspectRatio: '1 / 1',
                width: 'var(--square-size)',
                height: 'var(--square-size)',
                backgroundColor: isLightSquare ? 'var(--board-brown-light)' : 'var(--board-brown-dark)',
            }}
        >
            {piece && <BoardPieceEl squareId={squareId} pieceInfo={piece.pieceInfo} canDrag={canDrag} />}
        </Box>
    );
}


export default BoardSquareEl;