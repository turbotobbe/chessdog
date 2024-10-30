import { getCandidateMoves } from "@/controllers/CandidateMoves";
import { defaultChessBoardController } from "@/controllers/DefaultChessBoardController";
import { DnDBadgeName, GridColorName } from "@/dnd/DnDTypes";
import { asPieceInfo } from "@/models/chess";
import { SquareId, PieceId, PieceInfo, PieceName, whitePieceIds, blackPieceIds } from "@/types/chess";

export const defaultSquares: Partial<Record<SquareId, PieceId>> = {
    "a1": "wr1",
    "b1": "wn1",
    "c1": "wb1",
    "d1": "wq1",
    "e1": "wk1",
    "f1": "wb2",
    "g1": "wn2",
    "h1": "wr2",
    "a2": "wp1",
    "b2": "wp2",
    "c2": "wp3",
    "d2": "wp4",
    "e2": "wp5",
    "f2": "wp6",
    "g2": "wp7",
    "h2": "wp8",
    "a7": "bp1",
    "b7": "bp2",
    "c7": "bp3",
    "d7": "bp4",
    "e7": "bp5",
    "f7": "bp6",
    "g7": "bp7",
    "h7": "bp8",
    "a8": "br1",
    "b8": "bn1",
    "c8": "bb1",
    "d8": "bq1",
    "e8": "bk1",
    "f8": "bb2",
    "g8": "bn2",
    "h8": "br2"
};
export const defaultPieces: Partial<Record<PieceId, PieceInfo>> = {
    "wp1": asPieceInfo("wp1"),
    "wp2": asPieceInfo("wp2"),
    "wp3": asPieceInfo("wp3"),
    "wp4": asPieceInfo("wp4"),
    "wp5": asPieceInfo("wp5"),
    "wp6": asPieceInfo("wp6"),
    "wp7": asPieceInfo("wp7"),
    "wp8": asPieceInfo("wp8"),
    "wr1": asPieceInfo("wr1"),
    "wr2": asPieceInfo("wr2"),
    "wn1": asPieceInfo("wn1"),
    "wn2": asPieceInfo("wn2"),
    "wb1": asPieceInfo("wb1"),
    "wb2": asPieceInfo("wb2"),
    "wq1": asPieceInfo("wq1"),
    "wk1": asPieceInfo("wk1"),
    "bp1": asPieceInfo("bp1"),
    "bp2": asPieceInfo("bp2"),
    "bp3": asPieceInfo("bp3"),
    "bp4": asPieceInfo("bp4"),
    "bp5": asPieceInfo("bp5"),
    "bp6": asPieceInfo("bp6"),
    "bp7": asPieceInfo("bp7"),
    "bp8": asPieceInfo("bp8"),
    "br1": asPieceInfo("br1"),
    "br2": asPieceInfo("br2"),
    "bn1": asPieceInfo("bn1"),
    "bn2": asPieceInfo("bn2"),
    "bb1": asPieceInfo("bb1"),
    "bb2": asPieceInfo("bb2"),
    "bq1": asPieceInfo("bq1"),
    "bk1": asPieceInfo("bk1"),
};

export const defaultValidWhiteMoves: Partial<Record<PieceId, SquareId[]>> = {
    "wp1": ["a3", "a4"],
    "wp2": ["b3", "b4"],
    "wp3": ["c3", "c4"],
    "wp4": ["d3", "d4"],
    "wp5": ["e3", "e4"],
    "wp6": ["f3", "f4"],
    "wp7": ["g3", "g4"],
    "wp8": ["h3", "h4"],
    "wn1": ["a3", "c3"],
    "wn2": ["f3", "h3"],
};

export const defaultValidBlackMoves: Partial<Record<PieceId, SquareId[]>> = {
    "bp1": ["a6", "a5"],
    "bp2": ["b6", "b5"],
    "bp3": ["c6", "c5"],
    "bp4": ["d6", "d5"],
    "bp5": ["e6", "e5"],
    "bp6": ["f6", "f5"],
    "bp7": ["g6", "g5"],
    "bp8": ["h6", "h5"],
    "bn1": ["a6", "c6"],
    "bn2": ["f6", "h6"]
};

export const noBadges: Partial<Record<PieceId, DnDBadgeName>> = {};
export const noMarks: Record<GridColorName, SquareId[]> = {
    red: [],
    blue: [],
    yellow: [],
    green: [],
    orange: []
};
export const noArrows: Record<GridColorName, [SquareId, SquareId][]> = {
    red: [],
    blue: [],
    yellow: [],
    green: [],
    orange: []
};

export type KingStatus = {
    squareId: SquareId;
    isInCheck: boolean;
    isInCheckMate: boolean;
};

export type LastMove = {
    isKingsideCastling: boolean;
    isQueensideCastling: boolean;
    isCapture: boolean;
    isEnPassant: boolean;
    promotionPieceName?: PieceName;
};

export interface ChessBoardState {
    key: string;
    pgn: string;
    whitesTurn: boolean;
    squares: Partial<Record<SquareId, PieceId>>;
    pieces: Partial<Record<PieceId, PieceInfo>>;
    badges: Partial<Record<PieceId, DnDBadgeName>>;
    marks: Record<GridColorName, SquareId[]>;
    arrows: Record<GridColorName, [SquareId, SquareId][]>;
    comments: string[];
    capturedWhitePieces: PieceId[];
    capturedBlackPieces: PieceId[];
    movedPieces: PieceId[];
    validWhiteMoves: Partial<Record<PieceId, SquareId[]>>;
    validBlackMoves: Partial<Record<PieceId, SquareId[]>>;
    blackTargetSquareIds: SquareId[];
    whiteTargetSquareIds: SquareId[];
    moves: [SquareId, SquareId][];
    whiteKingStatus: KingStatus;
    blackKingStatus: KingStatus;
    isInStalemate: boolean;
    lastMove: LastMove;
    clone(): ChessBoardState;
}

export class DefaultChessBoardState implements ChessBoardState {

    key: string;
    pgn: string;
    whitesTurn: boolean = true;

    squares: Partial<Record<SquareId, PieceId>>;
    pieces: Partial<Record<PieceId, PieceInfo>>;

    badges: Partial<Record<PieceId, DnDBadgeName>>;
    marks: Record<GridColorName, SquareId[]>;
    arrows: Record<GridColorName, [SquareId, SquareId][]>;

    comments: string[];

    capturedWhitePieces: PieceId[];
    capturedBlackPieces: PieceId[];

    movedPieces: PieceId[];
    moves: [SquareId, SquareId][];

    whiteKingStatus: KingStatus;
    blackKingStatus: KingStatus;
    isInStalemate: boolean;

    lastMove: LastMove;

    validWhiteMoves: Partial<Record<PieceId, SquareId[]>>;
    validBlackMoves: Partial<Record<PieceId, SquareId[]>>;

    blackTargetSquareIds: SquareId[];
    whiteTargetSquareIds: SquareId[];

    constructor(
        key: string,
        pgn: string,
        isWhite: boolean,
        squares: Partial<Record<SquareId, PieceId>>,
        pieces: Partial<Record<PieceId, PieceInfo>>,
        badges: Partial<Record<PieceId, DnDBadgeName>>,
        marks: Record<GridColorName, SquareId[]>,
        arrows: Record<GridColorName, [SquareId, SquareId][]>,
        comments: string[],
        capturedWhitePieces: PieceId[],
        capturedBlackPieces: PieceId[],
        movedPieces: PieceId[],
        validWhiteMoves: Partial<Record<PieceId, SquareId[]>>,
        validBlackMoves: Partial<Record<PieceId, SquareId[]>>,
        blackTargetSquareIds: SquareId[],
        whiteTargetSquareIds: SquareId[],
        moves: [SquareId, SquareId][],
        whiteKingStatus: KingStatus,
        blackKingStatus: KingStatus,
        isInStalemate: boolean,
        lastMove: LastMove
    ) {
        this.key = key;
        this.pgn = pgn;
        this.whitesTurn = isWhite;
        this.squares = { ...squares };
        this.pieces = JSON.parse(JSON.stringify(pieces));
        this.badges = JSON.parse(JSON.stringify(badges));
        this.marks = {
            red: [...marks.red],
            blue: [...marks.blue],
            yellow: [...marks.yellow],
            green: [...marks.green],
            orange: [...marks.orange]
        };
        this.arrows = {
            red: [...arrows.red],
            blue: [...arrows.blue],
            yellow: [...arrows.yellow],
            green: [...arrows.green],
            orange: [...arrows.orange]
        };
        this.comments = [...comments];
        this.capturedWhitePieces = [...capturedWhitePieces];
        this.capturedBlackPieces = [...capturedBlackPieces];
        this.movedPieces = [...movedPieces];
        this.validWhiteMoves = JSON.parse(JSON.stringify(validWhiteMoves));
        this.validBlackMoves = JSON.parse(JSON.stringify(validBlackMoves));
        this.moves = moves.map(move => [...move]);
        this.blackTargetSquareIds = [...blackTargetSquareIds];
        this.whiteTargetSquareIds = [...whiteTargetSquareIds];
        this.whiteKingStatus = JSON.parse(JSON.stringify(whiteKingStatus));
        this.blackKingStatus = JSON.parse(JSON.stringify(blackKingStatus));
        this.isInStalemate = isInStalemate;
        this.lastMove = JSON.parse(JSON.stringify(lastMove));
    }

    clone(): ChessBoardState {
        return new DefaultChessBoardState(
            this.key,
            this.pgn,
            this.whitesTurn,
            this.squares,
            this.pieces,
            this.badges,
            this.marks,
            this.arrows,
            this.comments,
            this.capturedWhitePieces,
            this.capturedBlackPieces,
            this.movedPieces,
            this.validWhiteMoves,
            this.validBlackMoves,
            this.blackTargetSquareIds,
            this.whiteTargetSquareIds,
            this.moves,
            this.whiteKingStatus,
            this.blackKingStatus,
            this.isInStalemate,
            this.lastMove
        );
    }
};

export const setupChessBoardState = (squares: Partial<Record<SquareId, PieceId>>, sourceSquareId: SquareId, targetSquareId: SquareId) => {

    const pieces: Partial<Record<PieceId, PieceInfo>> = {};
    let whiteKingSquareId: SquareId | null = null;
    let blackKingSquareId: SquareId | null = null;
    for (const squareId in squares) {
        const pieceId = squares[squareId as SquareId];
        if (pieceId) {
            pieces[pieceId] = asPieceInfo(pieceId);
        }
        if (pieceId === 'wk1') {
            whiteKingSquareId = squareId as SquareId;
        }
        if (pieceId === 'bk1') {
            blackKingSquareId = squareId as SquareId;
        }
    }

    if (!whiteKingSquareId || !blackKingSquareId) {
        throw new Error('King not found');
    }

    // capture any pieces not in the setup
    const capturedWhitePieces: PieceId[] = whitePieceIds.filter(pieceId => !pieces[pieceId]);
    const capturedBlackPieces: PieceId[] = blackPieceIds.filter(pieceId => !pieces[pieceId]);

    // if piece not on home square, it has moved
    const movedPieces: PieceId[] = [];
    for (const squareId in defaultSquares) {
        const originalPieceId = defaultSquares[squareId as SquareId];
        const currentPieceId = squares[squareId as SquareId];
        
        // If current piece is different from original piece at this square
        if (currentPieceId !== originalPieceId && originalPieceId) {
            movedPieces.push(originalPieceId);
        }
    }

    const validWhiteMoves: Partial<Record<PieceId, SquareId[]>> = {};
    const validBlackMoves: Partial<Record<PieceId, SquareId[]>> = {};
    for (const squareId in squares) {
        const pieceId = squares[squareId as SquareId];
        if (pieceId) {
            const validMoves = getCandidateMoves(squareId as SquareId, asPieceInfo(pieceId), squares, movedPieces);
            if (asPieceInfo(pieceId).colorName === 'w') {
                validWhiteMoves[pieceId] = validMoves;
            } else {
                validBlackMoves[pieceId] = validMoves;
            }
        }
    }

    // check if move is valid
    const pieceToMoveId = squares[sourceSquareId];
    if (!pieceToMoveId) {
        throw new Error('Piece not found');
    }
    const pieceToMove = asPieceInfo(pieceToMoveId);
    if (pieceToMove.colorName === 'w') {
        if (!validWhiteMoves[pieceToMoveId]) {
            throw new Error('Candidate moves not found');
        }
        validWhiteMoves[pieceToMoveId].push(targetSquareId);
    } else {
        if (!validBlackMoves[pieceToMoveId]) {
            throw new Error('Candidate moves not found');
        }
        validBlackMoves[pieceToMoveId].push(targetSquareId);
    }

    const asWhite = pieceToMove.colorName === 'w';
    // const squares = defaultSquares;
    // const pieces = defaultPieces;
    const badges = noBadges;
    const marks = noMarks;
    const arrows = noArrows;
    const comments: string[] = [];
    // const capturedWhitePieces: PieceId[] = [];
    // const capturedBlackPieces: PieceId[] = [];
    // const movedPieces: PieceId[] = [];
    // const validWhiteMoves = defaultValidWhiteMoves;
    // const validBlackMoves = defaultValidBlackMoves;
    const blackTargetSquareIds = Object.entries(validBlackMoves)
        .filter(([pieceId]) => asPieceInfo(pieceId as PieceId).colorName === 'b')
        .flatMap(([, moves]) => moves);
    const whiteTargetSquareIDs = Object.entries(validWhiteMoves)
        .filter(([pieceId]) => asPieceInfo(pieceId as PieceId).colorName === 'w')
        .flatMap(([, moves]) => moves);
    const moves: [SquareId, SquareId][] = [];
    const whiteKingStatus: KingStatus = {
        squareId: whiteKingSquareId,
        isInCheck: false,
        isInCheckMate: false,
    };
    const blackKingStatus: KingStatus = {
        squareId: blackKingSquareId,
        isInCheck: false,
        isInCheckMate: false,
    };
    const isInStalemate = false;
    const lastMove = {
        isKingsideCastling: false,
        isQueensideCastling: false,
        isCapture: false,
        isEnPassant: false,
        promotionPieceName: undefined,
    };

    const state =new DefaultChessBoardState(
        'root',
        'root',
        asWhite,
        squares,
        pieces,
        badges,
        marks,
        arrows,
        comments,
        capturedWhitePieces,
        capturedBlackPieces,
        movedPieces,
        validWhiteMoves,
        validBlackMoves,
        blackTargetSquareIds,
        whiteTargetSquareIDs,
        moves,
        whiteKingStatus,
        blackKingStatus,
        isInStalemate,
        lastMove
    );

    // create controller and move the piece
    const controller = defaultChessBoardController(asWhite, true, state);
    controller.updateGameState(state, [sourceSquareId, targetSquareId], true);
    // console.log(controller.currentState());
    controller.onMove(sourceSquareId, targetSquareId);

    // return the new state
    return controller.currentState();
}

export const defaultChessBoardState = () => {
    const asWhite = true;
    const squares = defaultSquares;
    const pieces = defaultPieces;
    const badges = noBadges;
    const marks = noMarks;
    const arrows = noArrows;
    const comments: string[] = [];
    const capturedWhitePieces: PieceId[] = [];
    const capturedBlackPieces: PieceId[] = [];
    const movedPieces: PieceId[] = [];
    const validWhiteMoves = defaultValidWhiteMoves;
    const validBlackMoves = defaultValidBlackMoves;
    const blackTargetSquareIds = Object.entries(defaultValidBlackMoves)
        .filter(([pieceId]) => asPieceInfo(pieceId as PieceId).colorName === 'b')
        .flatMap(([, moves]) => moves);
    const whiteTargetSquareIDs = Object.entries(defaultValidWhiteMoves)
        .filter(([pieceId]) => asPieceInfo(pieceId as PieceId).colorName === 'w')
        .flatMap(([, moves]) => moves);
    const moves: [SquareId, SquareId][] = [];
    const whiteKingStatus: KingStatus = {
        squareId: 'e1',
        isInCheck: false,
        isInCheckMate: false,
    };
    const blackKingStatus: KingStatus = {
        squareId: 'e8',
        isInCheck: false,
        isInCheckMate: false,
    };
    const isInStalemate = false;
    const lastMove = {
        isKingsideCastling: false,
        isQueensideCastling: false,
        isCapture: false,
        isEnPassant: false,
        promotionPieceName: undefined,
    };
    return new DefaultChessBoardState(
        'root',
        'root',
        asWhite,
        squares,
        pieces,
        badges,
        marks,
        arrows,
        comments,
        capturedWhitePieces,
        capturedBlackPieces,
        movedPieces,
        validWhiteMoves,
        validBlackMoves,
        blackTargetSquareIds,
        whiteTargetSquareIDs,
        moves,
        whiteKingStatus,
        blackKingStatus,
        isInStalemate,
        lastMove
    );
};

export type ChessBoardItem = {
    state: ChessBoardState,
    lineIndex: number,
    lineCount: number
};

function asHash(parentId: number, childId: string): number {
    const PRIME = 31;
    const MAX_INT = 2147483647; // 2^31 - 1, a large prime number

    let hash = 17; // Start with a prime number
    for (let i = 0; i < childId.length; i++) {
        hash = (hash * PRIME + childId.charCodeAt(i)) % MAX_INT;
    }

    return (parentId * PRIME + hash) % MAX_INT;
}

export class ChessBoardNode {
    id: number;
    state: ChessBoardState;
    parentId: number;
    childIds: number[];
    childIdx: number;

    constructor(
        id: number,
        state: ChessBoardState,
        parentId: number,
        childIds: number[],
        childIdx: number
    ) {
        this.id = id;
        this.state = state.clone();
        this.parentId = parentId;
        this.childIds = childIds;
        this.childIdx = childIdx;
    }

    addChild(childState: ChessBoardState): { parent: ChessBoardNode, child: ChessBoardNode } {
        const id = asHash(this.id, childState.key);
        const child = new ChessBoardNode(id, childState, this.id, [], -1);
        this.childIds.push(id);
        this.childIdx = this.childIds.length - 1;
        return { parent: this, child };
    }

    clone(): ChessBoardNode {
        const cloneNode = new ChessBoardNode(
            this.id,
            this.state.clone(),
            this.parentId,
            [...this.childIds],
            this.childIdx
        );
        return cloneNode;
    }
}

export interface ChessBoardTreeType {
    clone(): ChessBoardTreeType;
    reset(): void;
    addChild(state: ChessBoardState): void;
    removeChild(key: string): void;
    selectByKey(key: string): void;
    selectNextSibling(): void;
    selectFirst(): void;
    selectLast(): void;
    selectPrevious(): void;
    selectNext(): void;
    selectPreviousBranch(): void;
    selectNextBranch(): void;
    currentIndex(): number;
    currentState(): ChessBoardState;
    currentLine(): ChessBoardItem[];
    currentChildren(): ChessBoardState[];
    isEmpty(): boolean;
    isInitialState(): boolean;
    isCurrentNodeRoot(): boolean;
    isCurrentNodeLeaf(): boolean;
    isCurrentNodeSibling(): boolean;
    isGameOver(): boolean;
}

export class ChessBoardTree implements ChessBoardTreeType {
    initialState: ChessBoardState;
    rootId: number;
    currentNodeId: number;
    nodes: Record<number, ChessBoardNode> = {};

    constructor(
        initialState: ChessBoardState,
        prev?: {
            rootId: number,
            currentNodeId: number,
            nodes: Record<number, ChessBoardNode>
        }
    ) {
        this.initialState = initialState.clone();
        this.rootId = prev ? prev.rootId : asHash(0, initialState.key);
        this.currentNodeId = prev ? prev.currentNodeId : this.rootId;
        this.nodes = prev ? prev.nodes : { [this.rootId]: new ChessBoardNode(this.rootId, initialState, 0, [], 0) };
        // console.log(`created tree... ${prev ? 'with previous' : 'with new'}`);
    }

    clone(): ChessBoardTree {
        // clone all nodes
        const clonedNodes = Object.fromEntries(
            Object.entries(this.nodes).map(([key, node]) => [key, node.clone()])
        );
        const clonedTree = new ChessBoardTree(this.initialState, {
            rootId: this.rootId,
            currentNodeId: this.currentNodeId,
            nodes: clonedNodes
        });
        return clonedTree;
    }

    reset(): void {
        const rootId = this.rootId;
        const rootNode = new ChessBoardNode(this.rootId, this.initialState, 0, [], 0);
        this.currentNodeId = rootId;
        this.nodes = { [rootId]: rootNode };
    }

    // Play game, new states will be added to the current node or replace existing ones
    addChild(state: ChessBoardState): void {
        const currentNode = this.nodes[this.currentNodeId];
        // console.log(`Adding child to tree. Current node key: ${currentNode.state.key}, Children: ${currentNode.childIds.length}`);

        const childNodeId = asHash(currentNode.id, state.key);
        const existingChildIndex = currentNode.childIds.findIndex(childId => childId === childNodeId);

        if (existingChildIndex === -1) {

            // add new child
            const { parent, child } = currentNode.addChild(state.clone());

            // update nodes
            this.nodes[childNodeId] = child;
            this.nodes[parent.id] = parent;
            // console.log(`added new child ${childNodeId} ${state.key} to parent ${currentNode.id} ${currentNode.state.key}`);
        } else {

            // update state
            this.nodes[childNodeId].state = state.clone();
            this.nodes[this.currentNodeId].childIdx = existingChildIndex;
            // console.log(`updated existing child ${childNodeId} ${state.key} in parent ${currentNode.id} ${currentNode.state.key}`);
        }
        // set new current node
        this.currentNodeId = childNodeId;
    }

    // Remove the current node
    removeChild(key: string): void {
        const currentNode = this.nodes[this.currentNodeId];
        const childNodeId = asHash(currentNode.id, key);
        const index = currentNode.childIds.findIndex(child => child === childNodeId);
        if (index !== -1) {
            currentNode.childIds.splice(index, 1);
            console.log(`removed child ${childNodeId} ${key} from parent ${currentNode.id} ${currentNode.state.key}`);
        } else {
            console.error(`Inconsistency found in tree structure during removeChild: State with key ${key} not found`);
        }
    }

    // Select a sibling by key
    selectByKey(key: string): void {
        let currentNodeId = this.rootId;
        while (currentNodeId) {
            const currentNode = this.nodes[currentNodeId];
            if (currentNode.state.key === key) {
                this.currentNodeId = currentNodeId;
                // console.log(`selected child ${currentNodeId} ${key}`);
                return;
            }
            currentNodeId = currentNode.childIds[currentNode.childIdx];
        }
    }

    // Select next sibling, or first if no more siblings
    selectNextSibling(): void {
        const currentNode = this.nodes[this.currentNodeId];
        const parentNode = this.nodes[currentNode.parentId];
        const siblingIds = parentNode.childIds;
        const currentSiblingIdx = parentNode.childIdx;
        const nextSiblingIdx = (currentSiblingIdx + 1) % siblingIds.length;
        parentNode.childIdx = nextSiblingIdx;
        this.currentNodeId = siblingIds[nextSiblingIdx];
        // console.log(`selected next sibling ${this.currentNodeId} ${siblingIds[nextSiblingIdx]}`);
    }

    // goto first or last
    selectFirst(): void {
        this.currentNodeId = this.rootId;
        // console.log(`selected first ${this.currentNodeId}`);
    }

    // goto end of line
    selectLast(): void {
        let currentNode = this.nodes[this.currentNodeId];
        while (currentNode.childIds.length > 0) {
            this.currentNodeId = currentNode.childIds[currentNode.childIdx];
            currentNode = this.nodes[this.currentNodeId];
        }
        // console.log(`selected last ${this.currentNodeId}`);
    }

    // goto previous
    selectPrevious(): void {
        const currentNode = this.nodes[this.currentNodeId];
        const rootNode = this.nodes[this.rootId];
        if (currentNode.parentId === rootNode.parentId) {
            return;
        }
        this.currentNodeId = currentNode.parentId;
        // console.log(`selected previous ${this.currentNodeId}`);
    }

    // goto next
    selectNext(): void {
        const currentNode = this.nodes[this.currentNodeId];
        if (currentNode.childIds.length > 0) {
            this.currentNodeId = currentNode.childIds[currentNode.childIdx];
        }
        // console.log(`selected next ${this.currentNodeId}`);
    }

    // goto previous node with several children (+1)
    selectPreviousBranch(): void {
        let currentNode = this.nodes[this.currentNodeId];
        let parentNode = this.nodes[currentNode.parentId];
        let skip = false;
        while (parentNode) {
            if (parentNode.id === this.rootId) {
                // stop at root
                this.currentNodeId = this.rootId;
                return;
            }
            if (parentNode.childIds.length > 1) {
                if (!skip) {
                    skip = true;
                } else {
                    // we found it
                    this.currentNodeId = parentNode.id;
                    // select the selected sibling
                    this.currentNodeId = parentNode.childIds[parentNode.childIdx];
                    return;
                }
            }
            parentNode = this.nodes[parentNode.parentId];
            skip = true;
        }
        // console.log(`selected previous branch ${this.currentNodeId}`);
    }

    // goto next node with several siblings
    selectNextBranch(): void {
        let currentNode = this.nodes[this.currentNodeId];
        let childNodeId = currentNode.childIds[currentNode.childIdx];
        while (childNodeId) {
            const childNode = this.nodes[childNodeId];
            if (childNode.childIds.length === 0) {
                // stop at end of line
                this.currentNodeId = childNodeId;
                return;
            }
            if (childNode.childIds.length > 1) {
                // we found it
                this.currentNodeId = childNodeId;
                // select the selected sibling
                this.currentNodeId = childNode.childIds[childNode.childIdx]
                return;
            }
            childNodeId = childNode.childIds[childNode.childIdx];
        }
        // console.log(`selected next branch ${this.currentNodeId}`);
    }

    // Get the depth of the current node
    currentIndex(): number {
        return -999;
    }

    currentState(): ChessBoardState {
        const currentNode = this.nodes[this.currentNodeId];
        return currentNode.state;
    }

    // Display all moves in the current line
    currentLine(): ChessBoardItem[] {
        let nodeId: number | null = this.rootId;
        const states: ChessBoardItem[] = [];
        let parentLineIndex = -1;
        let parentLineCount = -1;
        while (nodeId) {
            const node: ChessBoardNode = this.nodes[nodeId];
            if (nodeId !== this.rootId) {
                states.push({
                    state: node.state,
                    lineIndex: parentLineIndex,
                    lineCount: parentLineCount
                });
            }
            parentLineIndex = node.childIdx;
            parentLineCount = node.childIds.length;
            nodeId = node.childIds[node.childIdx] || null;
        }
        return states;
    }

    currentChildren(): ChessBoardState[] {
        const currentNode = this.nodes[this.currentNodeId];
        const children = currentNode.childIds.map(childId => this.nodes[childId].state);
        return children;
    }
    rootKey(): string {
        return this.nodes[this.rootId].state.key;
    }

    isEmpty(): boolean {
        return Object.keys(this.nodes).length === 1;
    }

    isInitialState(): boolean {
        if (!this.isEmpty()) {
            return false;
        }
        const currentState = this.currentState();
        return JSON.stringify(currentState) === JSON.stringify(this.initialState);
    }

    isCurrentNodeRoot(): boolean {
        return this.currentNodeId === this.rootId;
    }

    isCurrentNodeLeaf(): boolean {
        return this.nodes[this.currentNodeId].childIds.length === 0;
    }

    isCurrentNodeSibling(): boolean {
        const currentNode = this.nodes[this.currentNodeId];
        if (currentNode.id !== this.rootId) {
            const parentNode = this.nodes[currentNode.parentId];
            return parentNode.childIds.length > 1;
        }
        return false;
    }

    isGameOver(): boolean {
        const state = this.currentState();
        return state.whiteKingStatus.isInCheckMate || state.blackKingStatus.isInCheckMate || state.isInStalemate;
    }
}
