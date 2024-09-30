import { Box } from "@mui/material"
import { useDrop } from "react-dnd"
import BoardPieceEl from "./BoardPieceEl"
import { SquareId, lightSquareIds } from "@/types/chess"
import { ChessGameState } from "@/models/chess"

type BoardSquareElProps = {
    squareId: SquareId,
    chessGameState: ChessGameState,
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId) => void
}


const BoardSquareEl: React.FC<BoardSquareElProps> = ({
    squareId,
    chessGameState,
    movePiece,
}) => {

    // mark square
    const isLightSquare = lightSquareIds.includes(squareId);
    const classNames = ['square', squareId, isLightSquare ? 'white' : 'black'];

    // mark last move square
    if (chessGameState.lastMove) {
        if (chessGameState.lastMove.toSquareId === squareId) {
            classNames.push('moved-to');
        }
        if (chessGameState.lastMove.fromSquareId === squareId) {
            classNames.push('moved-from');
        }
    }

    function handleCanDrop(squareId: SquareId, draggedSquareId: SquareId, chessGameState: ChessGameState): boolean {
        const draggedPiece = chessGameState.getPieceAt(draggedSquareId);
        if (!draggedPiece) {
            return false;
        }
        if (draggedPiece.colorName !== 'w' && chessGameState.whitesTurn) {
            return false;
        }
            if (draggedPiece.colorName !== 'b' && !chessGameState.whitesTurn) {
            return false;
        }
        if (draggedPiece.validMoveSquareIds.includes(squareId)) {
            return true;
        }
        return false;
    }

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: "piece",
            canDrop: (item: { squareId: SquareId }) => handleCanDrop(squareId, item.squareId, chessGameState),
            drop: (item: { squareId: SquareId }) => movePiece(item.squareId, squareId),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        }),
        [squareId, chessGameState]
    )

    if (isOver) {
        classNames.push('hover');
    }
    if (canDrop) {
        classNames.push('valid-move');
    }

    const pieceState = chessGameState.getPieceAt(squareId);
    let canDrag = false;
    if (pieceState) {
        canDrag = (pieceState.colorName === 'w' && chessGameState.whitesTurn) ||
            (pieceState.colorName === 'b' && !chessGameState.whitesTurn);
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
            {pieceState && <BoardPieceEl squareId={squareId} pieceState={pieceState} canDrag={canDrag} />}
        </Box>
    );
}


export default BoardSquareEl;