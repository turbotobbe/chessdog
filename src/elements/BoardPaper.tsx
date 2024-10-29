import { Box, Paper } from "@mui/material";
import { ChessBoard } from "./ChessBoard";
import { PlayerContainer } from "./PlayerContainer2";
import { GridColorName } from "@/dnd/DnDTypes";
import { PlayerType } from "./RandomPlayer";

interface BoardPaperProps {
    chessBoardKey: string;
    asWhite: boolean;
    arrowColorName: GridColorName;
    markColorName: GridColorName;
}

export const BoardPaper: React.FC<BoardPaperProps> = ({
    chessBoardKey,
    asWhite,
    arrowColorName,
    markColorName,
}) => {

    let whitePlayerType: PlayerType = 'human';
    let blackPlayerType: PlayerType = 'human';
    if (chessBoardKey === 'Play') {
        whitePlayerType = 'human';
        blackPlayerType = 'random';
    }
    return (
        <Paper className="board-paper">
            <Box className="board-container">
                <PlayerContainer
                    chessBoardKey={chessBoardKey}
                    colorName={asWhite ? 'b' : 'w'}
                    playerType={asWhite ? blackPlayerType : whitePlayerType}
                />
                <ChessBoard
                    chessBoardKey={chessBoardKey}
                    asWhite={asWhite}
                    markColorName={markColorName}
                    arrowColorName={arrowColorName}
                />
                <PlayerContainer
                    chessBoardKey={chessBoardKey}
                    colorName={asWhite ? 'w' : 'b'}
                    playerType={asWhite ? whitePlayerType : blackPlayerType}
                />
            </Box>
        </Paper>
    );
}
