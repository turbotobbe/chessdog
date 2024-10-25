import { useChessBoard } from "@/contexts/ChessBoardContext";
import { ColorName, SquareId } from "@/types/chess";
import { useEffect, useMemo } from "react";


export type PlayerType = 'random' | 'human';
export const playerTypeNames: Record<PlayerType, string> = {
    random: 'Random',
    human: 'You'
};

type RandomPlayerProps = {
    chessBoardKey: string,
    colorName: ColorName
}

export const RandomPlayer: React.FC<RandomPlayerProps> = ({
    chessBoardKey,
    colorName,
}) => {
    const { getController, setController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey), [getController, chessBoardKey]);

    useEffect(() => {
        if (!controller) {
            return;
        }
        if (controller.isGameOver()) {
            return;
        }
        if (!controller.isCurrentNodeLeaf()) {
            return;
        }
        const playAsWhite = controller.currentState().whitesTurn && colorName === 'w'
        const playAsBlack = !controller.currentState().whitesTurn && colorName === 'b'
        if (!playAsWhite && !playAsBlack) {
            return;
        }
        const validMoves = playAsWhite ? controller.currentState().validWhiteMoves : controller.currentState().validBlackMoves;
        const validActiveMoves = Object.entries(validMoves).filter(([_, targetSquareIds]) => targetSquareIds && targetSquareIds.length > 0);
        if (validActiveMoves.length === 0) {
            return;
        }
        const makeRandomMove = () => {
            const validPiecesCount = validActiveMoves.length;
            const randomPieceIndex = Math.floor(Math.random() * validPiecesCount);
            const randomPieceId = validActiveMoves[randomPieceIndex][0];
            const randomPieceMoves = validActiveMoves[randomPieceIndex][1];

            const randomMoveIndex = Math.floor(Math.random() * randomPieceMoves.length);
            const randomMoveSquareId = randomPieceMoves[randomMoveIndex];

            const randomPieceHomeSquare = Object.entries(controller.currentState().squares)
                .find(([_squareId, pieceId]) => pieceId === randomPieceId)
            if (!randomPieceHomeSquare) {
                return;
            }
            const randomPieceHomeSquareId = randomPieceHomeSquare[0] as SquareId;
            controller.onMove(randomPieceHomeSquareId, randomMoveSquareId);
            setController(chessBoardKey, controller);
            console.log(`Made random ${colorName} move: ${randomPieceId}. from ${randomPieceHomeSquareId} to ${randomMoveSquareId}`);
        };
        const timerId = setTimeout(makeRandomMove, 200);
        return () => clearTimeout(timerId);
    }, [controller, setController, chessBoardKey]);

    return (
        <></>
    )
}
