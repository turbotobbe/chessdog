import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useChessBoard } from "@/contexts/ChessBoardContext";
import { useMemo } from "react";
import { ControllerHandler } from "@/contexts/ChessBoardController";

type SheetHeaderContainerProps = {
    chessBoardKey: string
    title: 'Analysis' | 'Basics' | 'Openings' | 'Endgames' | 'Tactics' | 'Puzzle' | 'Prep' | 'Studio'
    handler: ControllerHandler
}

export const SheetHeaderContainer: React.FC<SheetHeaderContainerProps> = ({
    chessBoardKey,
    title,
    handler,
}) => {
    const { getController, setController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey), [getController, setController, chessBoardKey]);

    let headerIcon: React.ReactNode;
    switch (title) {
        case 'Analysis': headerIcon = <ImageSearchIcon />; break;
        case 'Basics': headerIcon = <PlayArrowIcon />; break;
    }

    return (
        <Box className="sheet-header-container">
            {headerIcon}
            <Box className="sheet-header-name-box">
                <Typography className="sheet-header-name-text" variant="body1">{title}</Typography>
            </Box>
            <Box className="sheet-header-time">
                {handler.reload &&
                    <Tooltip title="Reload">
                        <IconButton size="small" onClick={handler.reload}>
                            <RestartAltIcon />
                        </IconButton>
                    </Tooltip>
                }
                {handler.restart && <Tooltip title="Restart">
                    <span>
                        <IconButton size="small" onClick={handler.restart} disabled={!controller || controller?.isInitialState()}>
                            <PlaylistRemoveIcon />
                        </IconButton>
                    </span>
                </Tooltip>}
            </Box>
        </Box>
    )
}