import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, SxProps } from '@mui/material';
import { DnDContext } from './DnDContext';
import './DnDGrid.css';
import DnDGlass from './DnDGlass';
import { GridColorName, DnDSize, gridColorNames, DnDCellId, DnDOffset, gridZIndexes, asDnDCellIdString, isEqual, DnDBadgeName } from './DnDTypes';
import DnDArrow from './DnDArrow';
import DnDCell from './DnDCell';
import DnDItem from './DnDItem';

type DndGridProps = {
    rows: number,
    cols: number,
    items: Record<string, string>,
    marks: Record<GridColorName, string[]>,
    arrows: Record<GridColorName, [string, string][]>,
    badges: Record<string, DnDBadgeName>,
    targets: Record<string, string[]>,
    markColorName: GridColorName | null,
    arrowColorName: GridColorName | null,
    toCellId: (cellKey: string) => DnDCellId,
    fromCellId: (cellId: DnDCellId) => string,

    toItemColor: (itemKey: string) => string,
    toItemFace: (itemKey: string) => string,

    canDrag: (cellKey: string) => boolean,
    canMove: (sourceCellKey: string, targetCellKey: string) => boolean,
    canMark: (sourceCellKey: string) => boolean,
    canArrow: (sourceCellKey: string, targetCellKey: string) => boolean,

    onMove: (sourceCellKey: string, targetCellKey: string) => void,
    onMark: (sourceCellKey: string, colorName: GridColorName) => void,
    onArrow: (sourceCellKey: string, targetCellKey: string, colorName: GridColorName) => void,

    // children: React.ReactNode,
    sx?: SxProps,
}

const DnDGrid: React.FC<DndGridProps> = ({
    rows,
    cols,
    items,
    marks,
    arrows,
    badges,
    targets,
    markColorName,
    arrowColorName,
    toCellId,
    fromCellId,
    toItemColor,
    toItemFace,
    canDrag,
    canMove,
    canMark,
    canArrow,
    onMove,
    onMark,
    onArrow,
    sx,
}) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [mouseOffset, setMouseOffset] = useState<DnDOffset>({ top: -Infinity, left: -Infinity });

    const [sourceCellId, setSourceCellId] = useState<DnDCellId | null>(null);
    const [targetCellId, setTargetCellId] = useState<DnDCellId | null>(null);
    const [draggedItemKey, setDraggedItemKey] = useState<string | null>(null);
    const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        // Calculate the targetCellId based on the current mouse position
        if (mouseOffset && gridRef.current) {
            const gridRect = gridRef.current.getBoundingClientRect();
            const cellSize: DnDSize = {
                width: gridRect.width / cols,
                height: gridRect.height / rows,
            }

            const col = Math.floor(mouseOffset.left / cellSize.width);
            const row = Math.floor(mouseOffset.top / cellSize.height);

            // Ensure the calculated row and column are within the grid bounds
            if (row >= 0 && row < rows && col >= 0 && col < cols) {
                const newTargetCellId: DnDCellId = { row, col };
                if (!targetCellId || !isEqual(targetCellId, newTargetCellId)) {
                    setTargetCellId(newTargetCellId);
                }
            } else {
                setTargetCellId(null);
            }
        }
    }, [mouseOffset, rows, cols, targetCellId]);

    const isMouseOver = useCallback((row: number, col: number) => {
        // const mouseOffset = mouseOffsetRef.current; // Use ref here
        if (mouseOffset && gridRef.current) {
            const gridRect = gridRef.current.getBoundingClientRect();
            const cellSize: DnDSize = {
                width: gridRect.width / cols,
                height: gridRect.height / rows,
            }

            const cellLeft = col * cellSize.width;
            const cellTop = row * cellSize.height;
            const cellRight = cellLeft + cellSize.width;
            const cellBottom = cellTop + cellSize.height;

            return (
                mouseOffset.left >= cellLeft &&
                mouseOffset.left < cellRight &&
                mouseOffset.top >= cellTop &&
                mouseOffset.top < cellBottom
            );
        }

        return false;
    }, [mouseOffset]);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        const gridRect = gridRef.current?.getBoundingClientRect();
        if (gridRect) {
            const newOffset = {
                top: event.clientY - gridRect.top,
                left: event.clientX - gridRect.left,
            };
            if (newOffset.left === mouseOffset.left && newOffset.top === mouseOffset.top) {
                return;
            }
            setMouseOffset(newOffset);
        }
    }, [gridRef]);

    const handleTouchMove = useCallback((event: TouchEvent) => {
        const gridRect = gridRef.current?.getBoundingClientRect();
        if (gridRect) {
            const newOffset = {
                top: event.touches[0].clientY - gridRect.top,
                left: event.touches[0].clientX - gridRect.left,
            };
            if (newOffset.left === mouseOffset.left && newOffset.top === mouseOffset.top) {
                return;
            }
            setMouseOffset(newOffset);
        }
    }, [gridRef]);


    const handleOnDragStart = useCallback((cellId: DnDCellId, itemKey: string, offset: { top: number, left: number }) => {
        // console.log('handleOnDragStart', cellId, itemKey);
        setDraggedItemKey(itemKey);
        setSourceCellId(cellId);
        setTargetCellId(cellId);
        setIsDragging(true);
        const gridRect = gridRef.current?.getBoundingClientRect();
        if (gridRect) {
            const newOffset = {
                top: offset.top - gridRect.top,
                left: offset.left - gridRect.left,
            };
            setMouseOffset(newOffset);
        }
    }, []);

    const handleOnDrop = useCallback(() => {
        if (sourceCellId && targetCellId) {
            // console.log('handleOnDrop', sourceCellId, targetCellId);
            const sourceCellKey = fromCellId(sourceCellId);
            const targetCellKey = fromCellId(targetCellId);
            // console.log('handleOnDrop', sourceCellKey, targetCellKey);
            if (canMove(sourceCellKey, targetCellKey)) {
                onMove(sourceCellKey, targetCellKey);
            }
        }
        setDraggedItemKey(null);
        setSourceCellId(null);
        setTargetCellId(null);
        setIsDragging(false);
    }, [sourceCellId, targetCellId, fromCellId, canMove, onMove]);

    useEffect(() => {
        // console.log('setting up shift key listeners');
        const handleKeyDown = (event: KeyboardEvent) => {
            // console.log('handleKeyDown', event.key);
            if (event.key === 'Shift') {
                setIsShiftKeyPressed(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            // console.log('handleKeyUp', event.key);
            if (event.key === 'Shift') {
                setIsShiftKeyPressed(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (isDragging) {
            // console.log('setting up event listeners');
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleOnDrop);
            window.addEventListener('touchend', handleOnDrop);
            return () => {
                // console.log('removing event listeners');
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('mouseup', handleOnDrop);
                window.removeEventListener('touchend', handleOnDrop);
            };
        }
    }, [isDragging, handleOnDrop]);

    return (
        <DnDContext.Provider value={{
            rows,
            cols,
            gridRef,
            mouseOffset,
            draggedItemKey,
            markColorName,
            arrowColorName,
            toCellId,
            toItemColor: toItemColor,
            toItemFace: toItemFace,
            fromCellId,
            canMark,
            canArrow,
            onDragStart: handleOnDragStart,
            onMark,
            onArrow
        }}>
            <Box
                ref={gridRef}
                className="dnd-grid"
                sx={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    zIndex: gridZIndexes.grid,
                    width: `var(--grid-size-width)`,
                    height: `var(--grid-size-height)`,
                    ...sx
                }}
            >
                <>
                    {Array.from({ length: rows }, (_, row) =>
                        Array.from({ length: cols }, (_, col) => {
                            const cellId: DnDCellId = { row, col };
                            const cellKey = fromCellId(cellId);
                            let colorName: GridColorName | undefined;

                            for (const gridColorName of gridColorNames) {
                                if (marks[gridColorName].indexOf(cellKey) !== -1) {
                                    colorName = gridColorName;
                                    break;
                                }
                            }
                            let isValid = false;
                            let isTarget = false;
                            if (draggedItemKey) {
                                const itemTargets = targets[draggedItemKey] || [];
                                if (Object.keys(items).indexOf(cellKey) === -1) {
                                    isValid = itemTargets.includes(cellKey);
                                } else {
                                    isTarget = itemTargets.includes(cellKey);
                                }
                            }
                            return (
                                <DnDCell
                                    key={asDnDCellIdString(cellId)}
                                    cellId={cellId}
                                    cellKey={cellKey}
                                    colorName={colorName}
                                    isOver={draggedItemKey ? isMouseOver(row, col) : false}
                                    isValid={isValid}
                                    isTarget={isTarget}
                                />
                            )
                        })
                    )}
                    <svg
                        viewBox={`0 0 ${cols*100} ${rows*100}`}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: gridZIndexes.arrow,
                            // ...sx,
                        }}
                    >
                        {Object.entries(arrows).map(([color, squareKeyPairs]) => (
                            squareKeyPairs.map((squareKeyPair) => (
                                <DnDArrow
                                    key={`${color}-${squareKeyPair[0]}-${squareKeyPair[1]}`}
                                    colorName={color as GridColorName}
                                    sourceKey={squareKeyPair[0]}
                                    targetKey={squareKeyPair[1]}
                                />
                            ))
                        ))}
                    </svg>

                    {Object.entries(items).map(([cellKey, itemKey]) => {
                        if (!itemKey) {
                            return null;
                        }
                        const badgeName = badges[itemKey];
                        return (
                            <DnDItem
                                key={cellKey}
                                cellKey={cellKey}
                                itemKey={itemKey}
                                canDrag={canDrag(cellKey)}
                                badgeName={badgeName}
                            />
                        )
                    })}

                    {isShiftKeyPressed && <DnDGlass />}
                </>
            </Box>
        </DnDContext.Provider>
    )
};

export default DnDGrid;
