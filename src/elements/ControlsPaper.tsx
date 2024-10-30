import { Box, IconButton, Paper, Tooltip, useMediaQuery } from "@mui/material";
import { yellow, red, green, blue, orange } from "@mui/material/colors";

import FlipIcon from '@mui/icons-material/Flip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { useChessBoard } from "@/contexts/ChessBoardContext";
import { PieceInfo, pieceValues } from "@/types/chess";
import { useMemo } from "react";
import { GridColorName, gridColorNames } from "@/dnd/DnDTypes";

const colorNames: Record<GridColorName, string> = {
    yellow: yellow[500],
    orange: orange[500],
    red: red[500],
    blue: blue[500],
    green: green[500],
};

interface ControlsPaperProps {
    chessBoardKey: string
    asWhite: boolean,
    setAsWhite: (asWhite: boolean) => void,
    arrowColorName: GridColorName,
    setArrowColorName: (arrowColorName: GridColorName) => void,
    markColorName: GridColorName,
    setMarkColorName: (markColorName: GridColorName) => void,
}

export const ControlsPaper: React.FC<ControlsPaperProps> = ({
    chessBoardKey,
    asWhite,
    setAsWhite,
    arrowColorName,
    setArrowColorName,
    markColorName,
    setMarkColorName,
}) => {
    const isLandscape = useMediaQuery('(orientation: landscape)');
    
    const { getController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey), [getController, chessBoardKey]);

    let playerPiecesValue = 38; // default values for setup position
    let opponentPiecesValue = 38; // default values for setup position

    let scorePercentage = .5
    if (controller) {
        const state = controller.currentState();

        const playerIsWhite = true;
    
        const playerColorName = playerIsWhite ? 'w' : 'b';
        playerPiecesValue = Object.values(state.pieces)
            .filter((pieceInfo: PieceInfo) => pieceInfo.colorName === playerColorName)
            .map((pieceInfo) => pieceInfo.promotionPieceName ? pieceValues[pieceInfo.promotionPieceName] : pieceValues[pieceInfo.pieceName])
            .reduce((acc, pieceValue) => acc + pieceValue, 0);
    
        const opponentColorName = playerIsWhite ? 'b' : 'w';
        opponentPiecesValue = Object.values(state.pieces)
            .filter((pieceInfo: PieceInfo) => pieceInfo.colorName === opponentColorName)
            .map((pieceInfo) => pieceInfo.promotionPieceName ? pieceValues[pieceInfo.promotionPieceName] : pieceValues[pieceInfo.pieceName])
            .reduce((acc, pieceValue) => acc + pieceValue, 0);
        const totalPiecesValue = playerPiecesValue + opponentPiecesValue;
        const whiteScore = playerPiecesValue - opponentPiecesValue;
        if (totalPiecesValue > 0) {
            scorePercentage = (0.5 + (whiteScore / (2 * totalPiecesValue)))*100;
            scorePercentage = scorePercentage > 50 ? Math.ceil(scorePercentage) : Math.floor(scorePercentage);
        } else {
            scorePercentage = 50;
        }
    }

    const arrowColor = colorNames[arrowColorName];
    const markColor = colorNames[markColorName];

    const nextArrowColorName = gridColorNames[(gridColorNames.indexOf(arrowColorName) + 1) % gridColorNames.length];
    const nextMarkColorName = gridColorNames[(gridColorNames.indexOf(markColorName) + 1) % gridColorNames.length];

    return (
        <Paper className="controls-paper">
            <Box className="controls-container">
                    <Tooltip title="Flip the board">
                        <IconButton size="small" onClick={() => { setAsWhite(!asWhite); }}>
                            <FlipIcon sx={{ transform: asWhite ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
                        </IconButton>
                    </Tooltip>
                    {/* <Divider className="controls-divider" flexItem /> */}
                    <Tooltip title="Hide evaluation">
                        <IconButton size="small">
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`Eval based on piece values. ${playerPiecesValue} vs ${opponentPiecesValue}. score: ${scorePercentage}%`}>
                    <Box className="controls-evalbar-box">
                        <Box className="controls-evalbar" sx={{
                            height: isLandscape ? `${scorePercentage}%` : '100%',
                            width: isLandscape ? '100%' : `${scorePercentage}%`,
                        }} >
                            &nbsp;
                        </Box>
                    </Box>
                    </Tooltip>
                    {/* <Divider className="controls-divider" flexItem /> */}
                    <Tooltip title={`Toggle arrow color (${arrowColorName})`}>
                        <IconButton size="small" onClick={() => { setArrowColorName(nextArrowColorName); }}>
                            <CallMissedIcon sx={{ color: arrowColor }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`Toggle square color (${markColorName})`}>
                        <IconButton size="small" onClick={() => { setMarkColorName(nextMarkColorName); }}>
                            <CropSquareIcon sx={{ color: markColor }} />
                        </IconButton>
                    </Tooltip>
                </Box>
        </Paper>
    );
}
