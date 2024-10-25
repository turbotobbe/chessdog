import { useChessBoard } from "@/contexts/ChessBoardContext";
import { pieceValues } from "@/types/chess";
import { Box, SxProps } from "@mui/material";
import { useMemo } from "react";

type EvalBarProps = {
    chessBoardKey: string;
    score: number // -10 .. 10
    sx?: SxProps
}

export const EvalBar: React.FC<EvalBarProps> = ({
    chessBoardKey,
    // score,
    sx
}) => {
    const { getController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey),
        [getController, chessBoardKey]);

    let normalizedScore = .5;
    if (controller) {
        const pieces = Object.values(controller.currentState().pieces);
        const whitePieces = pieces.filter(piece => piece.colorName === 'w');
        const blackPieces = pieces.filter(piece => piece.colorName === 'b');
        const whitePiecesValue = whitePieces.reduce((acc, piece) => acc + pieceValues[piece.pieceName], 0);
        const blackPiecesValue = blackPieces.reduce((acc, piece) => acc + pieceValues[piece.pieceName], 0);
        normalizedScore = whitePiecesValue / (whitePiecesValue + blackPiecesValue);
    }
    // const normalizedScore = Math.max(-10, Math.min(10, score));
    // const scorePercentage = (normalizedScore + 10) / .2;
    return (
        <Box
            className='eval-bar-container'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                ...sx
            }}>
            <Box
                className='eval-bar'
                sx={{
                    borderRadius: '2px',
                    backgroundColor: '#E0E0E0',
                    height: `${normalizedScore * 100}%`,
                    width: '8px',
                }} />
        </Box>
    )
}
