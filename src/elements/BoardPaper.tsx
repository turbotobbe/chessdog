import { Box, Paper, SxProps } from "@mui/material";
import { ChessBoard } from "./ChessBoard";
import { EvalBar } from "./EvalBar";
import { PlayerContainer } from "./PlayerContainer";
import { BoardActions } from "./BoardActions";
import { useState } from "react";
import { GridColorName } from "@/dnd/DnDTypes";
import { PlayerType } from "./RandomPlayer";

interface BoardPaperProps {
    chessBoardKey: string;
    cellSize: number
    boardSize: number
    sx?: SxProps
}

export const BoardPaper: React.FC<BoardPaperProps> = ({
    chessBoardKey,
    cellSize,
    boardSize,
    sx
}) => {
    const [asWhite, setAsWhite] = useState(true);
    const [markColorName, setMarkColorName] = useState<GridColorName>("red");
    const [arrowColorName, setArrowColorName] = useState<GridColorName>("orange");

    let whitePlayerType : PlayerType = 'human';
    let blackPlayerType : PlayerType = 'human';
    if (chessBoardKey === 'Play') {
        whitePlayerType = 'human';
        blackPlayerType = 'random';
    }
        return (
            <Paper>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gridTemplateRows: 'auto 1fr auto',
                gridTemplateAreas: `
                "nw north ne"
                "east center west"
                "sw south se"
            `,
                width: '100%',
                height: '100%',
                gap: 1,
                p: 1,
                ...sx
            }}>
                <PlayerContainer
                    chessBoardKey={chessBoardKey}
                    colorName={asWhite ? 'b' : 'w'}
                    playerType={asWhite ? blackPlayerType : whitePlayerType}
                    sx={{ gridArea: 'north' }}
                />
                <PlayerContainer
                    chessBoardKey={chessBoardKey}
                    colorName={asWhite ? 'w' : 'b'}
                    playerType={asWhite ? whitePlayerType : blackPlayerType}
                    sx={{ gridArea: 'south' }}
                />
                <EvalBar
                    chessBoardKey={chessBoardKey}
                    sx={{ gridArea: 'east' }}
                    score={0} />
                <BoardActions
                    asWhite={asWhite}
                    markColorName={markColorName}
                    arrowColorName={arrowColorName}
                    onToggleAsWhite={setAsWhite}
                    onMarkColorChange={setMarkColorName}
                    onArrowColorChange={setArrowColorName}  
                    sx={{ gridArea: 'west' }} />
                <ChessBoard
                    chessBoardKey={chessBoardKey}
                    cellSize={cellSize}
                    boardSize={boardSize}
                    asWhite={asWhite}
                    markColorName={markColorName}
                    arrowColorName={arrowColorName}
                    sx={{
                        gridArea: 'center',
                        height: { xs: 'auto', sm: `var(--board-height)` },
                }} />
            </Box>
        </Paper>
    );
}
