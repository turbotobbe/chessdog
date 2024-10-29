import { Box, Button, Typography } from "@mui/material";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ClearIcon from '@mui/icons-material/Clear';
import { useChessBoard } from "@/contexts/ChessBoardContext";
import { useCallback, useMemo } from "react";

type SheetHeaderContainerProps = {
    chessBoardKey: string
    title: 'Analysis' | 'Basics' | 'Openings' | 'Endgames' | 'Tactics' | 'Puzzle' | 'Prep' | 'Studio'
    action?: {
        label: 'Reset' | 'New'
        onClick: () => void
    }
}

export const SheetHeaderContainer: React.FC<SheetHeaderContainerProps> = ({
    chessBoardKey,
    title,
    action,
}) => {
    const { getController, setController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey), [getController, setController, chessBoardKey]);

    let headerIcon: React.ReactNode;
    switch (title) {
        case 'Analysis': headerIcon = <ImageSearchIcon />; break;
        case 'Basics': headerIcon = <PlayArrowIcon />; break;
    }

    let actionIcon: React.ReactNode;
    if (action) {
        switch (action.label) {
            case 'Reset': actionIcon = <ClearIcon />; break;
            case 'New': actionIcon = <PlayArrowIcon />; break;
        }
    }

    const handleOnActionClick = useCallback(() => {
        if (controller) {
            controller.reset();
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    return (
        <Box className="sheet-header-container">
            {headerIcon}
            <Box className="sheet-header-name-box">
                <Typography className="sheet-header-name-text" variant="body1">{title}</Typography>
            </Box>
            {action &&
                <Box className="sheet-header-time">
                    <Button size="small" variant="contained" endIcon={actionIcon} onClick={handleOnActionClick} disabled={!controller || controller?.isInitialState()}>
                        {action.label}
                    </Button>
                </Box>
            }
        </Box>
    )
}