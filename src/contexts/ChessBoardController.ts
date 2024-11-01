import { GridColorName } from "@/dnd/DnDTypes";
import { SquareId } from "@/types/chess";
import { ChessBoardTreeType } from "./ChessBoardState";

export type ChessBoardKind = 'Explore' | 'Play';

export interface ChessBoardController extends ChessBoardTreeType {

    kind: ChessBoardKind;

    canDrag(sourceId: SquareId): boolean;
    canMove(sourceId: SquareId, targetId: SquareId): boolean;
    canMark(squareId: SquareId): boolean;
    canArrow(sourceId: SquareId, targetId: SquareId): boolean;

    onMove(sourceId: SquareId, targetId: SquareId): void;
    onMark(squareId: SquareId, color: GridColorName): void;
    onArrow(sourceId: SquareId, targetId: SquareId, color: GridColorName): void;
    onComment(comment: string): void;
    
    clone(): ChessBoardController;
}

export interface ControllerHandler {
    restart?: () => void
    reload?: () => void
}
