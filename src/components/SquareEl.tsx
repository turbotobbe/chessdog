import { Box } from "@mui/material"
import { PieceName, SquareId } from "@/types/chess"
import { asSquareId, ChessGameState } from "@/models/chess"
import { useDrop } from "react-dnd"

type SquareElProps = {
    asWhite: boolean,
    col: number,
    row: number,
    chessGameState: ChessGameState,
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId, promotionPieceName?: PieceName) => void
}


const SquareEl: React.FC<SquareElProps> = ({
    asWhite,
    col,
    row,
    chessGameState,
    movePiece
}) => {

    const fileIndex = asWhite ? col : 7 - col;
    const rankIndex = asWhite ? 7 - row : row;
    const squareId: SquareId = asSquareId(fileIndex, rankIndex);
    const isLightSquare = (fileIndex + rankIndex) % 2 !== 0;
    const movedFrom = chessGameState.lastMove?.fromSquareId === squareId;
    const movedTo = chessGameState.lastMove?.toSquareId === squareId;
    const isMarked = chessGameState.marks.includes(squareId);

    const [{isOver, canDrop}, drop] = useDrop(
        () => ({
            accept: "piece",
            drop: (item: { squareId: SquareId }) => {
                console.log('Dropped piece:', item);
                movePiece(item.squareId, squareId);
            },
            canDrop: (item: { squareId: SquareId }) => {
                const piece = chessGameState.getPieceAt(item.squareId);
                return piece ? piece.validMoveSquareIds.includes(squareId) : false;
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        }),
        [squareId, movePiece, chessGameState]
    )

    const className = [
        "square",
        squareId,
        isLightSquare ? 'white' : 'black',
        movedFrom ? 'moved-from' : '',
        movedTo ? 'moved-to' : '',
        isMarked ? 'marked' : '',
        isOver && canDrop ? 'over' : ''
    ]
    
    return (
        <Box
            ref={drop}
            id={squareId}
            className={className.join(' ')}
            sx={{
                aspectRatio: '1 / 1',
                width: 'var(--square-size)',
                height: 'var(--square-size)',
            }}
        />
    );
}


export default SquareEl;