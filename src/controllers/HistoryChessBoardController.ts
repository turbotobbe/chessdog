import { ChessBoardController, ChessBoardKind } from "@/contexts/ChessBoardController";
import { ChessBoardState, defaultChessBoardState, ChessBoardTree, ChessBoardItem } from "@/contexts/ChessBoardState";
import { GridColorName } from "@/dnd/DnDTypes";
import { asPieceInfo, asSquareId, asSquareInfo } from "@/models/chess";
import { PieceId, PieceInfo, SquareId } from "@/types/chess";

export const historyChessBoardController = (kind: ChessBoardKind, initialState?: ChessBoardState) => {
    return new HistoryChessBoardController(kind, initialState ?? defaultChessBoardState());
};

export class HistoryChessBoardController implements ChessBoardController {

    kind: ChessBoardKind;
    protected initialState: ChessBoardState;
    protected gameTree: ChessBoardTree;

    constructor(kind: ChessBoardKind, initialState: ChessBoardState, gameTree?: ChessBoardTree) {
        this.kind = kind;
        this.initialState = initialState.clone();
        this.gameTree = gameTree ? gameTree.clone() : new ChessBoardTree(initialState);
    }

    clone(): ChessBoardController {
        return new HistoryChessBoardController(this.kind, this.initialState, this.gameTree);
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
    isInitialState(): boolean {
        return this.gameTree.isInitialState();
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

        const pieceId = clonedState.squares[sourceId];
        if (!pieceId) {
            throw new Error(`Piece not found at ${sourceId}`);
        }

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
                // console.log(`Removing mark from ${squareId} in color ${colorKey}`);
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
                // console.log(`Removing arrow from ${sourceId} to ${targetId} in color ${colorKey}`);
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

    onComment(comment: string): void {
        const state = this.currentState();
        state.comments.push(comment);
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

            state.lastMove.isCapture = true;
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
            if (state.movedPieces.indexOf(sourcePieceId) === -1) {
                state.movedPieces.push(sourcePieceId);
            }

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

    updatePgn(state: ChessBoardState, prevState: ChessBoardState, sourceId: SquareId, targetId: SquareId, pieceInfo: PieceInfo): void {

        const sourceSquareInfo = asSquareInfo(sourceId);
        const targetSquareInfo = asSquareInfo(targetId);

        let pgn = "";
        if (state.lastMove.isKingsideCastling) {
            pgn = "O-O";
        }
        else if (state.lastMove.isQueensideCastling) {
            pgn = "O-O-O";
        } else {

            const specifiedSource = getDisambiguation(prevState, sourceId, targetId, pieceInfo);
            if (state.lastMove.promotionPieceName) {
                if (state.lastMove.isCapture) {
                    pgn += sourceSquareInfo.fileName;
                }
            } else if (specifiedSource.length > 0) {
                pgn += specifiedSource;
            } else if (pieceInfo.pieceName !== 'p') {
                pgn += pieceInfo.pieceName.toUpperCase();
            } else if (state.lastMove.isCapture || state.lastMove.isEnPassant) {
                pgn += sourceSquareInfo.fileName;
            }

            // source destination

            if (state.lastMove.isCapture || state.lastMove.isEnPassant) {
                pgn += "x";
            }

            // Bxd3
            pgn += targetSquareInfo.id;

            // if (state.lastMove.isEnPassant) {
            //     pgn += " e.p.";
            // }
        }

        if (state.lastMove.promotionPieceName) {
            // d8=Q
            pgn += "=" + state.lastMove.promotionPieceName.toUpperCase();
        }

        if (state.whitesTurn) {
            if (state.whiteKingStatus.isInCheckMate) {
                pgn += "#";
            } else if (state.whiteKingStatus.isInCheck) {
                pgn += "+";
            }
        } else {
            if (state.blackKingStatus.isInCheckMate) {
                pgn += "#";
            } else if (state.blackKingStatus.isInCheck) {
                pgn += "+";
            }
        }

        state.pgn = pgn;

        if (this.kind === 'Play') {
            // add comment
            const comments: string[] = [];
            const name = state.whitesTurn ? 'Black' : 'White';
            let line = `${pgn}.`;

            if (state.lastMove.isKingsideCastling) {
                line += ` ${name} castled kingside`;
            }
            else if (state.lastMove.isQueensideCastling) {
                line += ` ${name} castled queenside`;
            } else {
                line += ` ${name} moved from ${sourceId} to ${targetId}`;
            }

            if (state.lastMove.isCapture) {
                line += ` and captured a piece at ${targetId}.`;
            }
            else if (state.lastMove.isEnPassant) {
                const targetInfo = asSquareInfo(targetId);
                const captureSquareId = asSquareId(targetInfo.fileIndex, targetInfo.rankIndex - (state.whitesTurn ? -1 : 1));
                line += ` and en passant captured a pawn at ${captureSquareId}.`;
            } else {
                line += '.';
            }
            comments.push(line);
            if (state.lastMove.promotionPieceName) {
                comments.push(`${name} promoted to ${state.lastMove.promotionPieceName.toUpperCase()}.`);
            }
            if (state.blackKingStatus.isInCheckMate) {
                comments.push(`The black king at ${state.blackKingStatus.squareId} is checkmated.`);
            } else if (state.blackKingStatus.isInCheck) {
                comments.push(`The black king at ${state.blackKingStatus.squareId} is in check.`);
            }

            if (state.whiteKingStatus.isInCheckMate) {
                comments.push(`The white king at ${state.whiteKingStatus.squareId} is checkmated.`);
            } else if (state.whiteKingStatus.isInCheck) {
                comments.push(`The white king at ${state.whiteKingStatus.squareId} is in check.`);
            }
            if (state.isInStalemate) {
                comments.push(`This is a stalemate.`);
            }

            state.comments = [comments.join(' ')];
        }

        state.marks.yellow.push(sourceId);
        state.marks.yellow.push(targetId);
    };

};

const getDisambiguation = (prevState: ChessBoardState, sourceId: SquareId, targetId: SquareId, pieceInfo: PieceInfo): string => {

    // get all pieces (of the same colar and type) that can move to the target square
    const validMoves = pieceInfo.colorName === 'w' ? prevState.validWhiteMoves : prevState.validBlackMoves;
    const candidatePieceInfos = Object.entries(validMoves)
        .filter(([_pieceId, targetSquareIds]) => targetSquareIds.includes(targetId))
        .map(([pieceId]) => asPieceInfo(pieceId as PieceId))
        .filter(candidatePieceInfo => candidatePieceInfo.pieceName === pieceInfo.pieceName);

    if (candidatePieceInfos.length < 2) {
        return "";
    }

    // Get the squares of candidate pieces
    const sourceSquareInfos = Object.entries(prevState.squares)
        .filter(([_squareId, pieceId]) =>
            candidatePieceInfos.some(candidatePieceInfo => candidatePieceInfo.id === pieceId)
        )
        .map(([squareId]) => asSquareInfo(squareId as SquareId));


    const sourceSquareInfo = asSquareInfo(sourceId);
    let fileDisambiguation = "";
    let rankDisambiguation = "";

    // Check if file disambiguation is sufficient
    if (sourceSquareInfos.filter(squareInfo => squareInfo.fileName === sourceSquareInfo.fileName).length === 1) {
        fileDisambiguation = sourceSquareInfo.fileName;
    } else {
        // If file is not enough, use rank
        rankDisambiguation = sourceSquareInfo.rankName;
        // If rank is also not enough, use both file and rank
        if (sourceSquareInfos.filter(squareInfo => squareInfo.rankName === sourceSquareInfo.rankName).length > 1) {
            fileDisambiguation = sourceSquareInfo.fileName;
        }
    }

    return fileDisambiguation + rankDisambiguation;
};
