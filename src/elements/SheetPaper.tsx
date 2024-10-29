import { Box, Paper } from "@mui/material";
import { ChessNavigator } from "./ChessNavigator";
import { SheetHeaderContainer } from "./SheetHeaderContainer";
import { MovesPanelHeader } from "./MovesPanelHeader";
import { MovesPanel } from "./MovesPanel";
import { CommentsPanel } from "./CommentsPanel";

interface SheetPaperProps {
    chessBoardKey: string
    chessBoardKeys: string[]
    onSelectChessBoardKey: (key: string) => void
}

export const SheetPaper: React.FC<SheetPaperProps> = ({
    chessBoardKey,
    chessBoardKeys,
    onSelectChessBoardKey,
}) => {

    const handleOnSelectChessBoardKey = (key: string) => {
        console.log('onSelectChessBoardKey', key);
        onSelectChessBoardKey(key);
    };
    return (
        <Paper className="sheet-paper">
            <Box className="sheet-container">
                {/* this can differ depending on page */}
                <SheetHeaderContainer chessBoardKey={chessBoardKey} title='Analysis' action={{ label: 'Reset', onClick: () => { console.log('clear') } }} />

                <Box className="sheet-moves-panel-container" sx={{
                    flexGrow: 1,
                    height: '100%',
                    width: '100%',
                    minHeight: 0, // Add this
                    display: 'flex', // Add this
                    flexDirection: 'column', // Add this
                    overflow: 'hidden' // Add this
                }}>
                    <MovesPanelHeader
                        chessBoardKey={chessBoardKey}
                        chessBoardKeys={chessBoardKeys}
                        chessBoardIndex={chessBoardKeys.indexOf(chessBoardKey)}
                        onSelectChessBoardKey={handleOnSelectChessBoardKey}
                    />
                    {chessBoardKeys.map((key) => (
                        <MovesPanel
                            sx={{
                                maxHeight: '100%',
                                overflow: 'auto',
                                flex: 1, // Add this
                            }}
                            key={key}
                            chessBoardKey={key}
                            isHidden={key !== chessBoardKey}
                        />
                    ))}
                </Box>
                <CommentsPanel chessBoardKey={chessBoardKey} />

                <ChessNavigator chessBoardKey={chessBoardKey} />
            </Box>
        </Paper>
    );
}
