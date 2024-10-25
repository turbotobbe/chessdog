import { Box, Button, SxProps } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { useChessBoard } from "@/contexts/ChessBoardContext";
import { useCallback, useMemo } from "react";

type ChessNavigatorProps = {
    chessBoardKey: string;
    sx?: SxProps
}

export const ChessNavigator: React.FC<ChessNavigatorProps> = ({
    chessBoardKey,
    sx
}) => {
    const { getController, setController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey), [getController, setController, chessBoardKey]);

    const handleOnPrevious = useCallback(() => {
        if (controller) {
            controller.selectPrevious();
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    const handleOnNext = useCallback(() => {
        if (controller) {
            controller.selectNext();
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    const handleOnFirst = useCallback(() => {
        if (controller) {
            controller.selectPreviousBranch();
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    const handleOnLast = useCallback(() => {
        if (controller) {
            controller.selectNextBranch();
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    const handleOnRotate = useCallback(() => {
        if (controller) {
            controller.selectNextSibling();
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    return (
        <Box
            className='analysis-buttons'
            sx={{
                gap: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx
            }}>
            <Button variant='contained' onClick={handleOnFirst} disabled={!controller || controller?.isCurrentNodeRoot()}>
                <FirstPageIcon />
            </Button>
            <Button variant='contained' onClick={handleOnPrevious} disabled={!controller || controller?.isCurrentNodeRoot()}>
                <ChevronLeftIcon />
            </Button>
            <Button variant='contained' onClick={handleOnRotate} disabled={!controller || !controller?.isCurrentNodeSibling()}>
                <ImportExportIcon />
            </Button>
            <Button variant='contained' onClick={handleOnNext} disabled={!controller || controller?.isCurrentNodeLeaf()}>
                <ChevronRightIcon />
            </Button>
            <Button variant='contained' onClick={handleOnLast} disabled={!controller || controller?.isCurrentNodeLeaf()}>
                <LastPageIcon />
            </Button>
        </Box>
    )
}
