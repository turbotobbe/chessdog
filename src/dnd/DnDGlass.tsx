import React, { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { calculateCellId, DnDCellId, gridZIndexes, isEqual } from './DnDTypes';
import { useDnDGridContext } from './DnDContext';

export type DnDGlassProps = {
    sx?: React.CSSProperties,
}

const DnDGlass: React.FC<DnDGlassProps> = ({
    sx,
}) => {
    const {
        rows,
        cols,
        gridSize,
        markColorName,
        arrowColorName,
        fromCellId,
        canMark,
        canArrow,
        onMark,
        onArrow,
    } = useDnDGridContext();

    // const [isDragging, setIsDragging] = useState(false);
    const [sourceCellId, setSourceCellId] = useState<DnDCellId | null>(null);

    const handleOnMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const rect = (event.target as HTMLDivElement).getBoundingClientRect();
        const cellId = calculateCellId(gridSize, rows, cols, {
            top: event.clientY - rect.top,
            left: event.clientX - rect.left
        });
        setSourceCellId(cellId);
    }, []);

    const handleOnMouseUp = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const rect = (event.target as HTMLDivElement).getBoundingClientRect();
        const targetCellId = calculateCellId(gridSize, rows, cols, {
            top: event.clientY - rect.top,
            left: event.clientX - rect.left
        });
        if (sourceCellId && targetCellId) {
            if (isEqual(sourceCellId, targetCellId)) {
                const sourceCellKey = fromCellId(sourceCellId);
                markColorName && canMark(sourceCellKey) && onMark(sourceCellKey, markColorName);
            } else {
                const sourceCellKey = fromCellId(sourceCellId);
                const targetCellKey = fromCellId(targetCellId);
                arrowColorName && canArrow(sourceCellKey, targetCellKey) && onArrow(sourceCellKey, targetCellKey, arrowColorName);
            }
        }
        setSourceCellId(null);
    }, [sourceCellId, markColorName, arrowColorName, canMark, canArrow, onMark, onArrow]);

    return (
        <Box
            className="dnd-glass"
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: gridZIndexes.glass,
                // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                ...sx,
            }}
            onMouseDown={handleOnMouseDown}
            // onMouseMove={handleOnMouseMove}
            onMouseUp={handleOnMouseUp}
        />
    )
};

export default DnDGlass;
