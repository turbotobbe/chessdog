import { useChessBoard } from "@/contexts/ChessBoardContext";
import { asPieceInfo } from "@/models/chess";
import { ColorName, fullColorNames, PieceInfo, PieceName, pieceValues } from "@/types/chess";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { PlayerType, playerTypeNames, RandomPlayer } from "./RandomPlayer";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import FaceIcon from '@mui/icons-material/Face';
import { asImageSrc, asImageAlt } from "@/utils/images";

type CapturedPiecesProps = {
    colorName: ColorName,
    pieceName: PieceName,
    count: number
}
const CapturedPieces: React.FC<CapturedPiecesProps> = ({
    colorName,
    pieceName,
    count
}) => {
    return (
        <Box className="captured-pieces-box">
            <Box className="captured-pieces-icons">
                {Array.from({ length: count }).map((_, i) => (
                    <img
                        className="captured-pieces-icon"
                        key={i}
                        src={asImageSrc(colorName, pieceName)}
                        alt={asImageAlt(colorName, pieceName)}
                    />
                ))}
            </Box>
        </Box>);
};

type PlayerContainerProps = {
    chessBoardKey: string
    colorName: ColorName
    playerType: PlayerType
}

export const PlayerContainer: React.FC<PlayerContainerProps> = ({
    chessBoardKey,
    colorName,
    playerType,
}) => {
    const { getController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey), [getController, chessBoardKey]);
    const name = `${playerTypeNames[playerType]} (${fullColorNames[colorName]})`;
    if (!controller) {
        return (<Box>
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
        <Box
            className={`player-container ${colorName}`}
        >
            {playerType === 'random' ? <RandomPlayer chessBoardKey={chessBoardKey} colorName={colorName} /> : null}
            {playerType === 'human' ? <FaceIcon /> : <PrecisionManufacturingIcon />}
            <Box className="player-name-box">
                <Typography
                    className="player-name"
                    variant="body1"
                >{playerType === 'human' ? 'You' : 'Robot'} ({fullColorNames[colorName]})</Typography>
            </Box>
            <Box className="captured-pieces-boxes">
                {capturedPieceGroups.map((group, index) => (
                    <CapturedPieces
                        key={index}
                        colorName={group[0].colorName}
                        pieceName={group[0].pieceName}
                        count={group.length}
                    />
                ))}
            </Box>
            <Box className="player-score">
                <Typography variant="body1">{score <= 0 ? '' : `+${score}`}</Typography>
            </Box>

            {/* <Box className="player-time" sx={{ marginLeft: 1, backgroundColor: 'grey' }}>
                <Typography variant="body1" sx={{ padding: .5, paddingLeft: 1, paddingRight: 1 }}>9:23</Typography>
            </Box> */}
        </Box>
    )
}