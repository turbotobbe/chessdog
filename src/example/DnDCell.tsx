import React from 'react';
import { Box } from '@mui/material';
import { DnDCellId, GridColorName, gridColors, gridZIndexes } from './DnDTypes';

export type DnDCellProps = {
    cellId: DnDCellId,
    cellKey: string,
    isOver: boolean,
    colorName?: GridColorName,
    sx?: React.CSSProperties,
}

const DnDCell: React.FC<DnDCellProps> = ({
    cellId,
    cellKey,
    isOver,
    colorName,
    sx,
}) => {
    const isEven = (cellId.row + cellId.col) % 2 === 0;
    return (
        <Box
            className={`dnd-cell ${cellKey} ${isEven ? 'dnd-cell-even' : 'dnd-cell-odd'} ${colorName ? colorName : ''} ${isOver ? 'dnd-cell-over' : ''}`}
            sx={{
                border: isOver ? '2px solid var(--chess-hover)' : 'none',
                backgroundColor: colorName ? gridColors[colorName] : 'transparent',
                zIndex: gridZIndexes.cell,
                ...sx
            }}
        >
        </Box>
    )
};

export default DnDCell;
