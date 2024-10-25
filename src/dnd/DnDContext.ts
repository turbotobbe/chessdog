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

    toItemColor: (itemKey: string) => string;
    toItemFace: (itemKey: string) => string;

    canMark: (sourceCellKey: string) => boolean;
    canArrow: (sourceCellKey: string, targetCellKey: string) => boolean;

    onDragStart: (cellId: DnDCellId, itemKey: string, offset: { top: number, left: number }) => void;
    onMark: (sourceCellKey: string, colorName: GridColorName) => void;
    onArrow: (sourceCellKey: string, targetCellKey: string, colorName: GridColorName) => void;
}

// Create the context with a default value
export const DnDContext = createContext<DnDContextType | undefined>(undefined);

// Custom hook to access the context in any child component
export const useDnDGridContext = (): DnDContextType => {
    const context = useContext(DnDContext);
    if (!context) {
        throw new Error('useDnDGridContext must be used within a GridProvider');
    }
    return context;
};
