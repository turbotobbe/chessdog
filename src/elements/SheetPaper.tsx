import { Box, Paper, SxProps } from "@mui/material";
import { ChessNavigator } from "./ChessNavigator";
import { MovesPanelHeader } from "./MovesPanelHeader";
import { MovesPanel } from "./MovesPanel";

interface SheetPaperProps {
    chessBoardKey: string
    chessBoardKeys: string[]
    onSelectChessBoardKey: (key: string) => void
    sx?: SxProps
}

export const SheetPaper: React.FC<SheetPaperProps> = ({
    chessBoardKey,
    chessBoardKeys,
    onSelectChessBoardKey,
    sx
}) => {

    const handleOnSelectChessBoardKey = (key: string) => {
        console.log('onSelectChessBoardKey', key);
        onSelectChessBoardKey(key);
    };
    return (
        <Paper sx={{ ...sx }}>
            <Box sx={{
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}>
                <MovesPanelHeader
                    chessBoardKey={chessBoardKey}
                    chessBoardKeys={chessBoardKeys}
                    chessBoardIndex={chessBoardKeys.indexOf(chessBoardKey)}
                    onSelectChessBoardKey={handleOnSelectChessBoardKey}
                />
                {chessBoardKeys.map((key) => (
                    <MovesPanel
                        key={key}
                        chessBoardKey={key}
                        isHidden={key !== chessBoardKey}
                    />
                ))}
                
                <ChessNavigator
                    chessBoardKey={chessBoardKey}
                    sx={{
                        marginTop: 1,
                    }} />
            </Box>
        </Paper>
    );
}
