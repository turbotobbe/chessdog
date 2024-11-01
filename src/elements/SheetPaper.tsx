import { Box, Paper } from "@mui/material";
import { ChessNavigator } from "./ChessNavigator";
import { SheetHeaderContainer } from "./SheetHeaderContainer";
import { MovesPanelHeader } from "./MovesPanelHeader";
import { MovesPanel } from "./MovesPanel";
import { ControllerHandler } from "@/contexts/ChessBoardController";

interface SheetPaperProps {
    chessBoardKey: string
    chessBoardKeys: string[]
    onSelectChessBoardKey: (key: string) => void
    handler: ControllerHandler
}

export const SheetPaper: React.FC<SheetPaperProps> = ({
    chessBoardKey,
    chessBoardKeys,
    onSelectChessBoardKey,
    handler,
}) => {

    const handleOnSelectChessBoardKey = (key: string) => {
        console.log('onSelectChessBoardKey', key);
        onSelectChessBoardKey(key);
    };

    // const isPortrait = useMediaQuery('(orientation: portrait)');
    return (
        <Paper className="sheet-paper">
            <Box className="sheet-container">
                {/* this can differ depending on page */}
                <SheetHeaderContainer
                    chessBoardKey={chessBoardKey}
                    title='Analysis'
                    handler={handler}
                />

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
                {/* <CommentsPanel chessBoardKey={chessBoardKey} /> */}

                <ChessNavigator chessBoardKey={chessBoardKey} />
            </Box>
        </Paper>
    );
}
