import { ChessBoardController } from "@/contexts/ChessBoardController";
import { ChessBoardState, defaultChessBoardState, ChessBoardTree, ChessBoardItem } from "@/contexts/ChessBoardState";
import { GridColorName } from "@/dnd/DnDTypes";
import { asPieceInfo } from "@/models/chess";
import { SquareId } from "@/types/chess";

export const historyChessBoardController = (initialState?: ChessBoardState) => {
    return new HistoryChessBoardController(initialState ?? defaultChessBoardState());
};

export class HistoryChessBoardController implements ChessBoardController {

    protected initialState: ChessBoardState;
    protected gameTree: ChessBoardTree;

    constructor(initialState: ChessBoardState, gameTree?: ChessBoardTree) {
        this.initialState = initialState.clone();
        this.gameTree = gameTree ? gameTree.clone() : new ChessBoardTree(initialState);
    }

    clone(): ChessBoardController {
        return new HistoryChessBoardController(this.initialState, this.gameTree);
    }

    // methods from ChessBoardTreeType
    addChild(state: ChessBoardState): void {
        console.warn("use onMove instead");
        this.gameTree.addChild(state);
    }
    removeChild(key: string): void {
        this.gameTree.removeChild(key);
    }
    selectByKey(key: string): void {
        this.gameTree.selectByKey(key);
    }
    selectNextSibling(): void {
        this.gameTree.selectNextSibling();
    }
    selectFirst(): void {
        this.gameTree.selectFirst();
    }
    selectLast(): void {
        this.gameTree.selectLast();
    }
    selectPrevious(): void {
        this.gameTree.selectPrevious();
    }
    selectNext(): void {
        this.gameTree.selectNext();
    }
    selectPreviousBranch(): void {
        this.gameTree.selectPreviousBranch();
    }
    selectNextBranch(): void {
        this.gameTree.selectNextBranch();
    }
    currentIndex(): number {
        return this.gameTree.currentIndex();
    }
    currentState(): ChessBoardState {
        return this.gameTree.currentState();
    }
    currentLine(): ChessBoardItem[] {
        return this.gameTree.currentLine();
    }
    currentChildren(): ChessBoardState[] {
        return this.gameTree.currentChildren();
    }
    reset(): void {
        this.gameTree.reset();
    }
    isEmpty(): boolean {
        return this.gameTree.isEmpty();
    }
    isCurrentNodeRoot(): boolean {
        return this.gameTree.isCurrentNodeRoot();
    }
    isCurrentNodeLeaf(): boolean {
        return this.gameTree.isCurrentNodeLeaf();
    }
    isCurrentNodeSibling(): boolean {
        return this.gameTree.isCurrentNodeSibling();
    }
    isGameOver(): boolean {
        return this.gameTree.isGameOver();
    }

    // methods from ChessBoardController

    canDrag(_sourceId: SquareId): boolean {
        return true;
    }

    canMove(_sourceId: SquareId, _targetId: SquareId): boolean {
        return true;
    }

    canMark(_squareId: SquareId): boolean {
        return true;
    }

    canArrow(_sourceId: SquareId, _targetId: SquareId): boolean {
        return true;
    }

    onMove(sourceId: SquareId, targetId: SquareId, state?: ChessBoardState): void {
        const clonedState = state ?? this.currentState().clone();

        // capture any piece at the target square
        this.captureAtSquare(clonedState, targetId);

        // move piece from source to target
        this.moveBetweenSquares(clonedState, sourceId, targetId);

        // add to moves
        clonedState.moves.push([sourceId, targetId]);

        // Switch turn
        clonedState.whitesTurn = !clonedState.whitesTurn;

        // replace in game tree (same key)
        clonedState.key = [sourceId, targetId].join('');
        this.gameTree.addChild(clonedState);
    }

    onMark(squareId: SquareId, color: GridColorName): void {
        const state = this.currentState();

        let markRemoved = false;

        // Remove existing mark on the square if found in any color
        for (const colorKey in state.marks) {
            const colorMarks = state.marks[colorKey as GridColorName];
            const index = colorMarks.findIndex((s) => s === squareId);
            if (index !== -1) {
                console.log(`Removing mark from ${squareId} in color ${colorKey}`);
                const newColorMarks = colorMarks.filter(mark => mark !== squareId);
                state.marks[colorKey as GridColorName] = newColorMarks;
                markRemoved = true;
            }
        }

        // Add the new mark if it was not removed
        if (!markRemoved && state.marks[color].indexOf(squareId as SquareId) === -1) {
            state.marks[color].push(squareId as SquareId);
        }
    }

    onArrow(sourceId: SquareId, targetId: SquareId, color: GridColorName): void {
        const state = this.currentState();

        let arrowRemoved = false;

        // Remove existing arrow on the square if found in any color
        for (const colorKey in state.arrows) {
            const colorArrows = state.arrows[colorKey as GridColorName];
            const index = colorArrows.findIndex(([s, t]) => s === sourceId && t === targetId);
            if (index !== -1) {
                console.log(`Removing arrow from ${sourceId} to ${targetId} in color ${colorKey}`);
                const newColorArrows = colorArrows.filter(arrow => arrow[0] !== sourceId || arrow[1] !== targetId);
                state.arrows[colorKey as GridColorName] = newColorArrows;
                arrowRemoved = true;
            }
        }

        // Add the new arrow if it was not removed
        if (!arrowRemoved && state.arrows[color].indexOf([sourceId as SquareId, targetId as SquareId]) === -1) {
            state.arrows[color].push([sourceId as SquareId, targetId as SquareId]);
        }
    }

    captureAtSquare(state: ChessBoardState, squareId: SquareId): boolean {
        const targetPieceId = state.squares[squareId];
        // Capture target piece if it exists
        if (targetPieceId) {
            const targetPieceInfo = asPieceInfo(targetPieceId);
            if (targetPieceInfo.colorName === 'w') {
                state.capturedWhitePieces.push(targetPieceId);
                // remove valid moves for captured piece
                delete state.validWhiteMoves[targetPieceId];
            } else {
                state.capturedBlackPieces.push(targetPieceId);
                // remove valid moves for captured piece
                delete state.validBlackMoves[targetPieceId];
            }
            // remove piece from board
            delete state.pieces[targetPieceId];
            // remove from squares
            delete state.squares[squareId];
            return true;
        }
        return false;
    }

    moveBetweenSquares(state: ChessBoardState, sourceId: SquareId, targetId: SquareId): boolean {
        const sourcePieceId = state.squares[sourceId];
        if (sourcePieceId) {
            // Move piece to target square
            state.squares[targetId] = sourcePieceId;

            // Remove piece from source square
            delete state.squares[sourceId];

            // Add moved piece to movedPieces
            state.movedPieces.push(sourcePieceId);

            // update king square id
            const sourcePieceInfo = asPieceInfo(sourcePieceId);
            if (sourcePieceInfo.pieceName === 'k') {
                if (sourcePieceInfo.colorName === 'w') {
                    state.whiteKingStatus.squareId = targetId;
                } else {
                    state.blackKingStatus.squareId = targetId;
                }
            }
            return true;
        }
        return false;
    }

};
