import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { DnDBadgeName, gridZIndexes } from './DnDTypes';
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
        toItemColor,
        toItemFace,
        onDragStart,
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

    const handleDragStart = (target: HTMLElement, offset: { top: number, left: number }) => {
        
        target.classList.add('grabbing');
        const cellId = toCellId(cellKey);
        onDragStart(cellId, itemKey, offset);
    }

    return (
        <Box
            className={`dnd-item ${toItemColor(itemKey)} ${toItemFace(itemKey)}`}
            component="div"
            sx={{
                width: `var(--cell-size)`,
                height: `var(--cell-size)`,
                ...sx,
                ...style
            }}
            onMouseDown={canDrag ? (event) => {
                event.preventDefault();
                const offset = {
                    top: event.clientY,
                    left: event.clientX,
                }
                handleDragStart(event.target as HTMLElement, offset);
            } : undefined}

            onTouchStart={canDrag ? (event) => {
                // event.preventDefault(); // prevent touch scrolling on drag start
                const offset = {
                    top: event.touches[0].clientY,  
                    left: event.touches[0].clientX,
                }
                handleDragStart(event.target as HTMLElement, offset);
            } : undefined}
        >
            {badgeName && <DnDBadge badgeName={badgeName} />}
        </Box>
    )
};

export default DnDItem;
