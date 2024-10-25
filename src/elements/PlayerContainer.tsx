import { useChessBoard } from "@/contexts/ChessBoardContext";
import { asPieceInfo } from "@/models/chess";
import { ColorName, fullColorNames, fullPieceNames, PieceInfo, pieceValues } from "@/types/chess";
import { Box, Typography, SxProps } from "@mui/material";
import { useMemo } from "react";
import { PlayerType, playerTypeNames, RandomPlayer } from "./RandomPlayer";

type PlayerContainerProps = {
    chessBoardKey: string
    colorName: ColorName
    playerType: PlayerType
    sx?: SxProps
}

export const CapturedPieceGroup: React.FC<{ pieces: PieceInfo[] }> = ({ pieces }) => {

    return (<Box
        className={`piece-collection`}
        sx={{
            display: 'flex',
            height: '100%',
            position: 'relative',
            width: `${15 + (pieces.length * 8)}px`, // Adjust width based on number of pieces
        }}>

        {pieces.map((pieceInfo, index) => (
            <Box key={index}
                className={`dnd-item ${fullColorNames[pieceInfo.colorName]} ${fullPieceNames[pieceInfo.pieceName]}`}
                component="div"
                sx={{
                    display: 'inline-block',
                    position: 'absolute',
                    top: 0,
                    left: `${index * .5}rem`,
                    backgroundColor: 'transparent',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    aspectRatio: '1 / 1',
                    width: '1.8rem',
                    height: '1.8rem',
                }}
            >&nbsp;</Box>
        ))}
    </Box>)
}

export const PlayerContainer: React.FC<PlayerContainerProps> = ({
    chessBoardKey,
    colorName,
    playerType,
    sx
}) => {
    const { getController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey), [getController, chessBoardKey]);
    const name = `${playerTypeNames[playerType]} (${fullColorNames[colorName]})`;
    if (!controller) {
        return (<Box sx={{
            ...sx
        }}>
            <Typography variant="h6">{name}</Typography>
        </Box>);
    }
    const state = controller.currentState();

    const playerIsWhite = colorName === 'w';

    const playerColorName = playerIsWhite ? 'w' : 'b';
    const playerPiecesValue = Object.values(state.pieces)
        .filter((pieceInfo: PieceInfo) => pieceInfo.colorName === playerColorName)
        .map((pieceInfo) => pieceInfo.promotionPieceName ? pieceValues[pieceInfo.promotionPieceName] : pieceValues[pieceInfo.pieceName])
        .reduce((acc, pieceValue) => acc + pieceValue, 0);

    const opponentColorName = playerIsWhite ? 'b' : 'w';
    const opponentPiecesValue = Object.values(state.pieces)
        .filter((pieceInfo: PieceInfo) => pieceInfo.colorName === opponentColorName)
        .map((pieceInfo) => pieceInfo.promotionPieceName ? pieceValues[pieceInfo.promotionPieceName] : pieceValues[pieceInfo.pieceName])
        .reduce((acc, pieceValue) => acc + pieceValue, 0);
    const score = playerPiecesValue - opponentPiecesValue;

    const capturedPieces = playerIsWhite ? state.capturedBlackPieces : state.capturedWhitePieces;

    const capturedPieceInfos = capturedPieces
        .map((pieceId) => asPieceInfo(pieceId));

    const capturedPieceGroups = ['p', 'b', 'n', 'r', 'q'].map((pieceName) => (
        capturedPieceInfos
            .filter((pieceInfo) => pieceInfo.pieceName === pieceName && !pieceInfo.promotionPieceName)
    )).filter((group) => group.length > 0);
    // console.log('capturedPieceGroups', capturedPieceGroups);
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            ...sx
        }}>
            {playerType === 'random' && <RandomPlayer chessBoardKey={chessBoardKey} colorName={colorName} />}
            <Typography variant="h6">{name}</Typography>
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                }}
            >
                {capturedPieceGroups.map((group, index) => (
                    <CapturedPieceGroup key={index} pieces={group} />
                ))}
            </Box>
            <Typography variant="h6" sx={{ marginLeft: 'auto' }}>{score <= 0 ? '' : `+${score}`}</Typography>
        </Box>
    )
}