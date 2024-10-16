import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import {  DnDBadgeName, gridZIndexes } from './DnDTypes';
import { useDnDGridContext } from './DnDContext';
import DnDBadge from './DnDBadge';


export type DnDItemProps = {
    cellKey: string,
    itemKey: string,
    canDrag: boolean,
    badgeName?: DnDBadgeName,
    sx?: React.CSSProperties,
}

const DnDItem: React.FC<DnDItemProps> = ({
    cellKey,
    itemKey,
    canDrag,
    badgeName,
    sx,
}) => {
    const {
        cellSize,
        draggedItemKey,
        mouseOffset,
        toCellId,
        handleOnDragStart,
    } = useDnDGridContext();

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setIsDragging(draggedItemKey === itemKey);
    }, [draggedItemKey, itemKey]);

    const style = useMemo(() => {
        if (isDragging) {
            return {
                top: mouseOffset.top - cellSize.height / 2,
                left: mouseOffset.left - cellSize.width / 2,
                cursor: 'grabbing',
                zIndex: gridZIndexes.drag,
            }
        } else {
            const cellId = toCellId(cellKey);
            return {
                top: cellId.row * cellSize.height,
                left: cellId.col * cellSize.width,
                cursor: canDrag ? 'grab' : 'default',
                zIndex: gridZIndexes.item,
            }
        }
    }, [isDragging, mouseOffset, cellSize]);

    const handleDragStart = (target: HTMLElement) => {
        target.classList.add('grabbing');
        const cellId = toCellId(cellKey);
        handleOnDragStart(cellId, itemKey);
    }

    return (
        <Box
            className={`dnd-item ${itemKey}`}
            component="div"
            sx={{
                width: `${cellSize.width}px`,
                height: `${cellSize.height}px`,
                ...sx,
                ...style
            }}
            onMouseDown={canDrag ? (event) => {
                event.preventDefault();
                handleDragStart(event.target as HTMLElement);
            } : undefined}

            onTouchStart={canDrag ? (event) => {
                event.preventDefault();
                handleDragStart(event.target as HTMLElement);
            } : undefined}

            onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                // prevent native drag and drop
                e.preventDefault();
                return false;
            }}
        >
            {badgeName && <DnDBadge badgeName={badgeName} />}
        </Box>
    )
};

export default DnDItem;
