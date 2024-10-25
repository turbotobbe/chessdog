import React from 'react';
import { Box } from '@mui/material';
import { DnDCellId, GridColorName, gridColors, gridZIndexes } from './DnDTypes';

export type DnDCellProps = {
    cellId: DnDCellId,
    cellKey: string,
    isOver: boolean,
    colorName?: GridColorName,
    isValid: boolean,
    isTarget: boolean,
    sx?: React.CSSProperties,
}

const DnDCell: React.FC<DnDCellProps> = ({
    cellId,
    cellKey,
    isOver,
    colorName,
    isValid,
    isTarget,
    sx,
}) => {
    const isEven = (cellId.row + cellId.col) % 2 === 0;
    const classNames = [
        'dnd-cell',
        cellKey,
        isEven ? 'dnd-cell-even' : 'dnd-cell-odd',
    ];
    if (colorName) {
        classNames.push(colorName);
    }
    if (isOver) {
        classNames.push('dnd-cell-over');
    }
    if (isValid) {
        classNames.push('dnd-cell-valid');
    }
    if (isTarget) {
        classNames.push('dnd-cell-target');
    }

    return (
        <Box
            className={classNames.join(' ')}
            sx={{
                backgroundColor: colorName ? gridColors[colorName] : 'transparent',
                zIndex: gridZIndexes.cell,
                ...sx
            }}
        >
        </Box>
    )
};

export default DnDCell;
