
export type GridColorName = "red" | "blue" | "yellow" | "green" | "orange";

export type DnDBadgeName =
    'alternative' |
    'best' |
    'blunder' |
    'book' |
    'brilliant' |
    'checkmate_black' |
    'checkmate_white' |
    'correct' |
    'critical' |
    'draw_black' |
    'draw_white' |
    'excellent' |
    'fast_win' |
    'forced' |
    'free_piece' |
    'good' |
    'great_find' |
    'inaccuracy' |
    'incorrect' |
    'mate' |
    'missed_win' |
    'mistake' |
    'resign_black' |
    'resign_white' |
    'sharp' |
    'take_back' |
    'threat' |
    'unnamed_clock_black' |
    'unnamed_clock_white' |
    'unnamed_redo' |
    'unnamed_updown_arrow' |
    'winner';
export const gridBadgeNames: DnDBadgeName[] = [
    'alternative',
    'best',
    'blunder',
    'book',
    'brilliant',
    'checkmate_black',
    'checkmate_white',
    'correct',
    'critical',
    'draw_black',
    'draw_white',
    'excellent',
    'fast_win',
    'forced',
    'free_piece',
    'good',
    'great_find',
    'inaccuracy',
    'incorrect',
    'mate',
    'missed_win',
    'mistake',
    'resign_black',
    'resign_white',
    'sharp',
    'take_back',
    'threat',
    'unnamed_clock_black',
    'unnamed_clock_white',
    'unnamed_redo',
    'unnamed_updown_arrow',
    'winner',
];

export const gridColorNames: GridColorName[] = ["blue", "green", "yellow", "orange", "red"];

export const gridColors: Record<GridColorName, string> = {
    red: "var(--chess-highlight-red)",
    blue: "var(--chess-highlight-blue)",
    yellow: "var(--chess-highlight-yellow)",
    green: "var(--chess-highlight-green)",
    orange: "var(--chess-highlight-orange)",
}

export interface GridGadge {
    name: string;
    token: string;
    description: string;
    color: string;
    score: number;
}

export interface DnDSize {
    width: number;
    height: number;
}

export interface DnDCellId {
    row: number;
    col: number;
}

export interface DnDOffset {
    top: number;
    left: number;
}

export const gridZIndexes: Record<string, number> = {
    grid: 1,
    cell: 2,
    item: 3,
    arrow: 4,
    drag: 5,
    glass: 6,
}

export const isEqual = (a: DnDCellId, b: DnDCellId): boolean => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.row === b.row && a.col === b.col;
}

export const asDnDCellIdString = (cellId: DnDCellId): string => {
    return `cell-${cellId.row}-${cellId.col}`;
}

export const calculateCellId = (gridSize: DnDSize, rows: number, cols: number, offset: DnDOffset): DnDCellId => {
    if (gridSize.width <= 0 || gridSize.height <= 0 || rows <= 0 || cols <= 0) {
        return { row: -1, col: -1 };
    }
    const cellSize: DnDSize = {
        width: gridSize.width / cols,
        height: gridSize.height / rows,
    };
    const row = Math.floor(offset.top / cellSize.height);
    const col = Math.floor(offset.left / cellSize.width);
    return { row, col };
}
