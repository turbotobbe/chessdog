import { createContext, useContext } from 'react';
import { DnDCellId, DnDOffset, DnDSize, GridColorName } from './DnDTypes';

// Define the context type
interface DnDContextType {
    rows: number;
    cols: number;
    gridSize: DnDSize;
    cellSize: DnDSize;
    mouseOffset: DnDOffset;
    draggedItemKey: string | null;
    markColorName: GridColorName | null;
    arrowColorName: GridColorName | null;
    toCellId: (cellKey: string) => DnDCellId;
    fromCellId: (cellId: DnDCellId) => string;
    handleOnDragStart: (cellId: DnDCellId, itemKey: string) => void;
    handleOnMark: (colorName: GridColorName, sourceCellKey: string) => void;
    handleOnArrow: (colorName: GridColorName, sourceCellKey: string, targetCellKey: string) => void;
}

// Create the context with a default value
export const DnDContext = createContext<DnDContextType | undefined>({
    rows: -1,
    cols: -1,
    gridSize: { width: -1, height: -1 },
    cellSize: { width: -1, height: -1 },
    mouseOffset: { top: -Infinity, left: -Infinity },
    draggedItemKey: null,
    markColorName: null,
    arrowColorName: null,
    toCellId: () => ({ row: -1, col: -1 }),
    fromCellId: () => '???',
    handleOnDragStart: () => {},
    handleOnMark: () => {},
    handleOnArrow: () => {},
});

// Custom hook to access the context in any child component
export const useDnDGridContext = (): DnDContextType => {
    const context = useContext(DnDContext);
    if (!context) {
        throw new Error('useDnDGridContext must be used within a GridProvider');
    }
    return context;
};
