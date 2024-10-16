import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
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
    markColorName: GridColorName | null,
    arrowColorName: GridColorName | null,
    toCellId: (cellKey: string) => DnDCellId,
    fromCellId: (cellId: DnDCellId) => string,
    canDrag: (cellKey: string) => boolean,
    canDrop: (sourceCellKey: string, targetCellKey: string) => boolean,
    onDrop: (sourceCellKey: string, targetCellKey: string) => void,
    onMark: (colorName: GridColorName, sourceCellKey: string) => void,
    onArrow: (colorName: GridColorName, sourceCellKey: string, targetCellKey: string) => void,
    // children: React.ReactNode,
    sx?: React.CSSProperties,
}

const DnDGrid: React.FC<DndGridProps> = ({
    rows,
    cols,
    items,
    marks,
    arrows,
    badges,
    markColorName,
    arrowColorName,
    toCellId,
    fromCellId,
    canDrag,
    canDrop,
    onDrop,
    onMark,
    onArrow,
    sx = {},
}) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [gridSize, setGridSize] = useState<DnDSize>({ width: -1, height: -1 });
    const [cellSize, setCellSize] = useState<DnDSize>({ width: -1, height: -1 });
    const [mouseOffset, setMouseOffset] = useState<DnDOffset>({ top: -Infinity, left: -Infinity });

    const [sourceCellId, setSourceCellId] = useState<DnDCellId | null>(null);
    const [targetCellId, setTargetCellId] = useState<DnDCellId | null>(null);
    const [draggedItemKey, setDraggedItemKey] = useState<string | null>(null);
    const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false);

    // Function to update grid and cell sizes
    const updateGridSize = useCallback(() => {
        const gridElement = gridRef.current;
        if (gridElement) {
            const { offsetWidth, offsetHeight } = gridElement;

            setGridSize({
                width: offsetWidth,
                height: offsetHeight,
            });
            setCellSize({
                width: offsetWidth / cols,
                height: offsetHeight / rows,
            });
        }
    }, [cols, rows]);

    // Use useLayoutEffect to ensure the DOM is fully rendered before measuring
    useLayoutEffect(() => {
        updateGridSize();
    }, [updateGridSize]);

    // Setup ResizeObserver to handle grid resizing
    useEffect(() => {
        const gridElement = gridRef.current;
        if (!gridElement) return;

        const resizeObserver = new ResizeObserver(() => {
            updateGridSize();
        });

        resizeObserver.observe(gridElement);

        return () => {
            resizeObserver.disconnect();
        };
    }, [updateGridSize]);

    // Handle global resize events
    const handleGlobalResize = useCallback(() => {
        updateGridSize();
    }, [updateGridSize]);

    useEffect(() => {
        window.addEventListener('resize', handleGlobalResize);
        return () => {
            window.removeEventListener('resize', handleGlobalResize);
        };
    }, [handleGlobalResize]);

    useEffect(() => {
        // Calculate the targetCellId based on the current mouse position
        if (gridRef.current && cellSize.width > 0 && cellSize.height > 0) {
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
    }, [mouseOffset, cellSize, rows, cols, targetCellId]);

    const isMouseOver = useCallback((row: number, col: number) => {
        if (!gridRef.current || !mouseOffset || !cellSize) return false;

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
    }, [mouseOffset, cellSize]);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        const gridRect = gridRef.current?.getBoundingClientRect();
        if (gridRect) {
            setMouseOffset({
                top: event.clientY - gridRect.top,
                left: event.clientX - gridRect.left,
            });
        }
    }, []);

    const handleTouchMove = useCallback((event: TouchEvent) => {
        const gridRect = gridRef.current?.getBoundingClientRect();
        if (gridRect) {
            setMouseOffset({
                top: event.touches[0].clientY - gridRect.top,
                left: event.touches[0].clientX - gridRect.left,
            });
        }
    }, []);

    const handleOnDragStart = useCallback((cellId: DnDCellId, itemKey: string) => {
        setDraggedItemKey(itemKey);
        setSourceCellId(cellId);
        setTargetCellId(cellId);
    }, []);

    const handleOnDrop = useCallback(() => {
        if (sourceCellId && targetCellId) {
            const sourceCellKey = fromCellId(sourceCellId);
            const targetCellKey = fromCellId(targetCellId);
            if (canDrop(sourceCellKey, targetCellKey)) {
                onDrop(sourceCellKey, targetCellKey);
            }
        }
        setDraggedItemKey(null);
        setSourceCellId(null);
        setTargetCellId(null);
    }, [draggedItemKey, sourceCellId, targetCellId, canDrop, onDrop]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Shift') {
            setIsShiftKeyPressed(true);
        }
    }, []);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Shift') {
            setIsShiftKeyPressed(false);
        }
    }, []);

    const handleOnMark = useCallback((colorName: GridColorName, sourceCellId: string) => {
        onMark(colorName, sourceCellId);
    }, [onMark]);

    const handleOnArrow = useCallback((colorName: GridColorName, sourceCellId: string, targetCellId: string) => {
        onArrow(colorName, sourceCellId, targetCellId);
    }, [onArrow]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('mouseup', handleOnDrop);
        window.addEventListener('touchend', handleOnDrop);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleOnDrop);
            window.removeEventListener('touchend', handleOnDrop);
        };
    }, [handleMouseMove, handleTouchMove, handleOnDrop, handleKeyDown, handleKeyUp]);

    return (
        <DnDContext.Provider value={{
            rows,
            cols,
            gridSize,
            cellSize,
            mouseOffset,
            draggedItemKey,
            markColorName,
            arrowColorName,
            toCellId,
            fromCellId,
            handleOnDragStart,
            handleOnMark,
            handleOnArrow
        }}>
            <Box
                ref={gridRef}
                className="dnd-grid"
                sx={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    zIndex: gridZIndexes.grid,
                    ...sx
                }}
            >
                {cellSize.width > 0 && cellSize.height > 0 && (
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
                                return (
                                    <DnDCell
                                        key={asDnDCellIdString(cellId)}
                                        cellId={cellId}
                                        cellKey={cellKey}
                                        colorName={colorName}
                                        isOver={draggedItemKey ? isMouseOver(row, col) : false}
                                    />
                                )
                            })
                        )}
                        <svg
                            viewBox={`0 0 ${gridSize.width} ${gridSize.height}`}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                zIndex: gridZIndexes.arrow,
                                ...sx,
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

                        {/* items */}
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

                        {/* glass */}
                        {isShiftKeyPressed && <DnDGlass />}
                    </>
                )}
            </Box>
        </DnDContext.Provider>
    )
};

export default DnDGrid;
