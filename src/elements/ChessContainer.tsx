import { Box, SxProps } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BoardPaper } from "./BoardPaper";
import { SheetPaper } from "./SheetPaper";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const BOARD_HEADER_HEIGHT = 32;
const BOARD_FOOTER_HEIGHT = 32;

const SHEET_FOOTER_HEIGHT = 36;
const TABS_HEADER_HEIGHT = 48;

type ChessContainerProps = {
    chessBoardKeys: string[],
    sx?: SxProps
}

export const ChessContainer: React.FC<ChessContainerProps> = ({
    chessBoardKeys,
    sx,
}) => {
    const [chessBoardKey, setChessBoardKey] = useState(chessBoardKeys[0]);

    const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [cssSizes, setCssSizes] = useState<{
        paperHeight: number,
        boardHeight: number,
        cellSize: number,
        tableHeight: number,
    } | null>(null);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    useEffect(() => {
        const handleResize = () => {
            setViewportSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const headerHeight = 64; // Assuming this is the height of your app's header
        const padding = 16; // Total vertical padding (8px top + 8px bottom)
        const evalbar = 8;

        const paperHeight = isXs ? viewportSize.width : viewportSize.height - headerHeight - padding;
        const boardHeight = isXs ? viewportSize.width - padding - padding - evalbar : paperHeight - padding - padding - BOARD_HEADER_HEIGHT - BOARD_FOOTER_HEIGHT;
        const tableHeight = isXs ? viewportSize.width : paperHeight - padding - padding - SHEET_FOOTER_HEIGHT - TABS_HEADER_HEIGHT;
        const cellSize = boardHeight / 8;

        setCssSizes({
            paperHeight: paperHeight,
            boardHeight: boardHeight,
            cellSize: cellSize,
            tableHeight: tableHeight,
        });
    }, [viewportSize]);

    useEffect(() => {
        if (cssSizes) {
            document.documentElement.style.setProperty('--paper-height', `${cssSizes.paperHeight}px`);
            document.documentElement.style.setProperty('--board-height', `${cssSizes.boardHeight}px`);
            document.documentElement.style.setProperty('--cell-size', `${cssSizes.cellSize}px`);
            document.documentElement.style.setProperty('--table-height', `${cssSizes.tableHeight}px`);
        }
    }, [cssSizes]);

    if (!cssSizes) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'stretch',
                p: { xs: 0, sm: 1 },
                gap: 1,
                ...sx,
                // '--paper-height': { xs: 'calc(100vw)', sm: 'calc((100vh - 64px - 16px))' },
            }}
        >
            <BoardPaper
                cellSize={cssSizes.cellSize}
                boardSize={cssSizes.boardHeight}
                chessBoardKey={chessBoardKey}
            />
            <SheetPaper
                chessBoardKey={chessBoardKey}
                chessBoardKeys={chessBoardKeys}
                onSelectChessBoardKey={setChessBoardKey}
            />
        </Box>
    );
};
