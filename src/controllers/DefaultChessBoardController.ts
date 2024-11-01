import { ChessBoardController } from "@/contexts/ChessBoardController";
import { ChessBoardState, ChessBoardTree, defaultChessBoardState } from "@/contexts/ChessBoardState";
import { PieceId, PieceInfo, SquareId } from "@/types/chess";
import { asPieceInfo, asSquareInfo } from "@/models/chess";
import { getCandidateMoves } from "./CandidateMoves";
import { HistoryChessBoardController } from "./HistoryChessBoardController";
import { ChessBoardKind } from "@/contexts/ChessBoardController";

export const defaultChessBoardController = (kind: ChessBoardKind, canWhiteBeChecked: boolean = true, canBlackBeChecked: boolean = true, initialState?: ChessBoardState) => {
    return new DefaultChessBoardController(kind, canWhiteBeChecked, canBlackBeChecked, initialState ?? defaultChessBoardState());
};

export class DefaultChessBoardController extends HistoryChessBoardController {

    private enableWhite: boolean;
    private enableBlack: boolean;

    constructor(
        kind: 'Explore' | 'Play',
        enableWhite: boolean,
        enableBlack: boolean,
        initialState: ChessBoardState,
        gameTree?: ChessBoardTree
    ) {
        super(kind, initialState, gameTree);
        this.enableWhite = enableWhite;
        this.enableBlack = enableBlack;
    }

    canDrag(sourceId: SquareId): boolean {
        return this.canDragOrMove(sourceId);
    }

    canMove(sourceId: SquareId, targetId: SquareId): boolean {


        if (!this.canDragOrMove(sourceId)) {
            return false;
        }

        // check if piece has valid moves
        const pieceId = this.currentState().squares[sourceId];
        if (pieceId) {
            const pieceInfo = asPieceInfo(pieceId);
            const validMoves = pieceInfo.colorName === 'w' ? this.currentState().validWhiteMoves[pieceId] : this.currentState().validBlackMoves[pieceId];
            if (!validMoves) {
                return false;
            }

            // check if target is valid move
            return validMoves.includes(targetId);
        }
        return false
    }

    canDragOrMove(sourceId: SquareId): boolean {

        // can't drag empty square
        const pieceId = this.currentState().squares[sourceId];
        if (!pieceId) {
            return false;
        }

        // check if white can drag
        const isWhiteTurn = this.currentState().whitesTurn;

        if (isWhiteTurn && !this.enableWhite) {
            return false;
        }
        if (!isWhiteTurn && !this.enableBlack) {
            return false;
        }

        const pieceInfo: PieceInfo = asPieceInfo(pieceId);
        const isWhitePiece = pieceInfo.colorName === 'w';

        if (isWhitePiece && !this.enableWhite) {
            return false;
        }
        if (!isWhitePiece && !this.enableBlack) {
            return false;
        }

        // can only drag if own piece and turn is correct
        const isOwnPiece = isWhiteTurn ? pieceInfo.colorName === 'w' : pieceInfo.colorName === 'b';
        if (!isOwnPiece) {
            return false;
        }

        // game over. nobody moves!
        if (this.currentState().whiteKingStatus.isInCheckMate || this.currentState().blackKingStatus.isInCheckMate) {
            return false;
        }
        if (this.currentState().isInStalemate) {
            return false;
        }
        return true;
    }

    onMove(sourceId: SquareId, targetId: SquareId): void {
        this.onSimulateOrActualMove(sourceId, targetId, true);
    }

    onSimulateMove(sourceId: SquareId, targetId: SquareId): void {
        this.onSimulateOrActualMove(sourceId, targetId, false);
    }

    onSimulateOrActualMove(sourceId: SquareId, targetId: SquareId, actualMove: boolean): void {
        const state = this.currentState().clone();

        // reset all arrows, badges, comments, and marks
        state.arrows = {
            red: [],
            blue: [],
            yellow: [],
            green: [],
            orange: []
        }
        state.marks = {
            red: [],
            blue: [],
            yellow: [],
            green: [],
            orange: []
        }
        state.badges = {}
        state.comments = []

        // sanity check
        const sourcePieceId = state.squares[sourceId];
        if (!sourcePieceId) {
            console.warn(`${actualMove ? '(actual)' : '(simulation)'} sourcePieceId not found for ${sourceId}`);
            return;
        }

        const sourcePieceInfo = state.pieces[sourcePieceId];
        if (!sourcePieceInfo) {
            console.warn(`${actualMove ? '(actual)' : '(simulation)'} pieceInfo not found for ${sourcePieceId}`);
            return;
        }

        // check if piece is correct color
        const isWhitePiece = sourcePieceInfo.colorName === 'w';
        if (isWhitePiece && !state.whitesTurn) {
            return;
        }
        if (!isWhitePiece && state.whitesTurn) {
            return;
        }

        // get the last move before we move our piece
        const currentMove: [SquareId, SquareId] = [sourceId, targetId];

        state.lastMove = {
            isKingsideCastling: false,
            isQueensideCastling: false,
            isCapture: false,
            isEnPassant: false,
            promotionPieceName: undefined,
        };
        if (this.handlePromotion(state, sourceId, targetId, sourcePieceInfo)) {
            // console.log(`${actualMove ? '(actual)' : '(simulation)'} handled promotion`, sourcePieceId, sourcePieceInfo);
        } else if (this.handleEnPassant(state, sourceId, targetId, sourcePieceInfo)) {
            // console.log(`${actualMove ? '(actual)' : '(simulation)'} handled en passant`, sourcePieceId, sourcePieceInfo);
        } else if (this.handleCastling(state, sourceId, targetId, sourcePieceInfo)) {
            // console.log(`${actualMove ? '(actual)' : '(simulation)'} handled castling`, sourcePieceId, sourcePieceInfo);
        }

        const currentState = this.currentState().clone();

        // do the move ...
        super.onMove(sourceId, targetId, state);

        // update game state (this is a new state!)
        this.updateGameState(this.currentState(), actualMove, currentMove);
        this.updatePgn(this.currentState(), currentState, sourceId, targetId, sourcePieceInfo);

        // if (actualMove) {
        //     console.log(this.gameTree);
        //     console.log(this.currentState().movedPieces);
        // }
    }

    handlePromotion(state: ChessBoardState, _sourceSquareId: SquareId, targetSquareId: SquareId, pieceInfo: PieceInfo): boolean {

        const isWhite = pieceInfo.colorName === 'w';

        // must be a pawn
        if (pieceInfo.pieceName !== 'p') {
            return false;
        }

        // must be on first or last rank
        const targetSquareInfo = asSquareInfo(targetSquareId);
        const isWhitePromotion = isWhite && targetSquareInfo.rankName === '8';
        const isBlackPromotion = !isWhite && targetSquareInfo.rankName === '1';

        if (isWhitePromotion || isBlackPromotion) {
            // set promotion piece name
            pieceInfo.promotionPieceName = 'q';
            // update piece info
            state.pieces[pieceInfo.id] = pieceInfo;

            state.lastMove.promotionPieceName = 'q';
            return true;
        }
        return false;
    };

    handleEnPassant(state: ChessBoardState, sourceSquareId: SquareId, targetSquareId: SquareId, pieceInfo: PieceInfo): boolean {

        const isWhite = pieceInfo.colorName === 'w';

        // must be a pawn
        if (pieceInfo.pieceName !== 'p') {
            return false;
        }

        // check last move
        const lastMove = state.moves[state.moves.length - 1];
        if (!lastMove) {
            return false;
        }

        // sanity last move check
        const [lastMoveSourceId, lastMoveTargetId] = lastMove;
        const lastMoveSourceSquareInfo = asSquareInfo(lastMoveSourceId);
        const lastMoveTargetSquareInfo = asSquareInfo(lastMoveTargetId);
        const lastMovePieceId = state.squares[lastMoveTargetId];
        if (!lastMovePieceId) {
            return false;
        }
        const lastMovePieceInfo = state.pieces[lastMovePieceId];
        if (!lastMovePieceInfo) {
            return false;
        }

        // last move must be a pawn
        if (lastMovePieceInfo.pieceName !== 'p') {
            return false;
        }
        // last move must be 2 squares forward
        if (Math.abs(lastMoveSourceSquareInfo.rankIndex - lastMoveTargetSquareInfo.rankIndex) !== 2) {
            return false;
        }

        // last move must be opposite color
        if (lastMovePieceInfo.colorName === pieceInfo.colorName) {
            return false;
        }

        // last move rank checks
        if (lastMoveSourceSquareInfo.rankName !== (isWhite ? '7' : '2')) { // isWhite i out color
            return false;
        }
        if (lastMoveTargetSquareInfo.rankName !== (isWhite ? '5' : '4')) { // isWhite i out color
            return false;
        }

        const sourceSquareInfo = asSquareInfo(sourceSquareId);
        const targetSquareInfo = asSquareInfo(targetSquareId);

        // must be diagonal move
        if (sourceSquareInfo.fileName === targetSquareInfo.fileName) {
            return false;
        }
        // source must be on the same rank as the last move ended
        if (sourceSquareInfo.rankName !== lastMoveTargetSquareInfo.rankName) {
            return false;
        }
        // target must be on the same file as the last move ended
        if (targetSquareInfo.fileName !== lastMoveTargetSquareInfo.fileName) {
            return false;
        }

        // en passant
        this.captureAtSquare(state, lastMoveTargetId);

        state.lastMove.isCapture = false; // en passant is its own capture
        state.lastMove.isEnPassant = true;
        return true;
    };

    handleCastling(state: ChessBoardState, sourceSquareId: SquareId, targetSquareId: SquareId, pieceInfo: PieceInfo): boolean {

        const isWhite = pieceInfo.colorName === 'w';

        // must be a king
        if (pieceInfo.pieceName !== 'k') {
            return false;
        }

        // must be a two square move
        const sourceSquareInfo = asSquareInfo(sourceSquareId);
        const targetSquareInfo = asSquareInfo(targetSquareId);
        if (Math.abs(sourceSquareInfo.fileIndex - targetSquareInfo.fileIndex) !== 2) {
            return false;
        }

        const castleQueenSide = targetSquareId === (isWhite ? 'c1' : 'c8');
        const castleKingSide = targetSquareId === (isWhite ? 'g1' : 'g8');

        // trust we only added this move if it is allowed!!!

        let rookSourceSquareId: SquareId;
        let rookTargetSquareId: SquareId;
        if (isWhite) {
            rookSourceSquareId = castleQueenSide ? 'a1' : 'h1';
            rookTargetSquareId = castleQueenSide ? 'd1' : 'f1';
        } else {
            rookSourceSquareId = castleQueenSide ? 'a8' : 'h8';
            rookTargetSquareId = castleQueenSide ? 'd8' : 'f8';
        }

        // all ok, lets castle
        this.moveBetweenSquares(state, rookSourceSquareId, rookTargetSquareId);

        state.lastMove.isKingsideCastling = castleKingSide;
        state.lastMove.isQueensideCastling = castleQueenSide;
        return true;
    };

    clone(): ChessBoardController {
        const newController = new DefaultChessBoardController(
            this.kind,
            this.enableWhite,
            this.enableBlack,
            this.initialState,
            this.gameTree.clone()
        );
        return newController;
    }

    updateGameState(state: ChessBoardState, actualMove: boolean, currentMove?: [SquareId, SquareId]): void {

        // reset all valid moves and targets
        state.validWhiteMoves = {};
        state.validBlackMoves = {};
        state.blackTargetSquareIds = [];
        state.whiteTargetSquareIds = [];

        const blackTargetSquareIds: SquareId[] = [];
        const whiteTargetSquareIds: SquareId[] = [];

        // get candidate moves
        for (const [squareId, pieceId] of Object.entries(state.squares)) {
            const pieceInfo = state.pieces[pieceId];
            if (!pieceInfo) {
                console.warn(`pieceInfo not found for ${pieceId}`);
                continue;
            }
            const candidateMoves = getCandidateMoves(squareId as SquareId, pieceInfo, state.squares, state.movedPieces, currentMove);
            if (candidateMoves.length > 0) {
                if (pieceInfo.colorName === 'w') {
                    state.validWhiteMoves[pieceId] = candidateMoves;
                    whiteTargetSquareIds.push(...candidateMoves);
                } else {
                    state.validBlackMoves[pieceId] = candidateMoves;
                    blackTargetSquareIds.push(...candidateMoves);
                }
            }
        }
        const uniqueBlackTargetSquareIds = new Set(blackTargetSquareIds);
        const uniqueWhiteTargetSquareIds = new Set(whiteTargetSquareIds);
        state.blackTargetSquareIds = [...uniqueBlackTargetSquareIds];
        state.whiteTargetSquareIds = [...uniqueWhiteTargetSquareIds];

        // check if castling squares are in check
        this.removeCastlingMovesNotValid(state);

        // update check (not checkmate or stalemate, they are reset to false)
        this.updateChecks(state);

        if (!actualMove) {
            return;
        }

        const filteredValidWhiteMoves = this.updateValidMoves(state, state.validWhiteMoves);
        const filteredValidBlackMoves = this.updateValidMoves(state, state.validBlackMoves);
        state.validWhiteMoves = filteredValidWhiteMoves;
        state.validBlackMoves = filteredValidBlackMoves;
        const hasWhiteValidMoves = Object.keys(filteredValidWhiteMoves).length > 0;
        const hasBlackValidMoves = Object.keys(filteredValidBlackMoves).length > 0;

        // Check for stalemate and checkmate only for the current player
        const isWhiteTurn = state.whitesTurn;
        if (isWhiteTurn) {
            if (!hasWhiteValidMoves) {
                if (state.whiteKingStatus.isInCheck) {
                    state.whiteKingStatus.isInCheckMate = true;
                } else {
                    state.isInStalemate = true;
                }
            }
        } else {
            if (!hasBlackValidMoves) {
                if (state.blackKingStatus.isInCheck) {
                    state.blackKingStatus.isInCheckMate = true;
                } else {
                    state.isInStalemate = true;
                }
            }
        }

        if (state.whiteKingStatus.isInCheckMate) {
            state.badges['wk1'] = 'checkmate_white';
            state.badges['bk1'] = 'winner';
        } else if (state.blackKingStatus.isInCheckMate) {
            state.badges['bk1'] = 'checkmate_black';
            state.badges['wk1'] = 'winner';
        } else if (state.isInStalemate) {
            state.badges['wk1'] = 'draw_white';
            state.badges['bk1'] = 'draw_black';
        }
    }

    updateValidMoves(state: ChessBoardState, validMoves: Partial<Record<PieceId, SquareId[]>>): Partial<Record<PieceId, SquareId[]>> {
        const validationState = state.clone();
        const newValidMoves: Partial<Record<PieceId, SquareId[]>> = {};
        for (const [pieceId, targetSquareIds] of Object.entries(validMoves)) {
            if (!targetSquareIds) {
                continue;
            }
            const sourceId = Object.entries(validationState.squares).find(([_squareId, id]) => id === pieceId)?.[0] as SquareId;
            if (!sourceId) {
                console.warn(`Square not found for piece ${pieceId}`);
                continue;
            }
            const pieceInfo = asPieceInfo(pieceId as PieceId);
            const filteredTargetSquareIds: SquareId[] = [];

            for (const targetId of targetSquareIds) {

                // check if same color king is in check
                const simulatedState = this.simulateMove(validationState, sourceId, targetId);
                const isInCheck = pieceInfo.colorName === 'w'
                    ? simulatedState.whiteKingStatus.isInCheck
                    : simulatedState.blackKingStatus.isInCheck;
                if (!isInCheck) {
                    filteredTargetSquareIds.push(targetId);
                }
            }
            if (filteredTargetSquareIds.length > 0) {
                newValidMoves[pieceId as PieceId] = filteredTargetSquareIds;
            }
        }
        // console.log(`updated valid moves`, validMoves, newValidMoves);
        return newValidMoves;
    }

    simulateMove(state: ChessBoardState, sourceId: SquareId, targetId: SquareId): ChessBoardState {
        const clonedState = state.clone();
        const simulationController = new DefaultChessBoardController(
            this.kind,
            this.enableWhite,
            this.enableBlack,
            clonedState
        );
        simulationController.onSimulateMove(sourceId, targetId);
        return simulationController.currentState();
    }

    removeCastlingMovesNotValid(state: ChessBoardState): void {
        // White king castling check
        if (state.squares['e1'] === 'wk1' && !state.movedPieces.includes('wk1')) {
            const whiteKingMoves = state.validWhiteMoves['wk1'];
            if (whiteKingMoves) {
                // Remove kingside castling if path is attacked
                if (whiteKingMoves.includes('g1') && 
                    state.blackTargetSquareIds.some(id => ['e1', 'f1', 'g1'].includes(id))) {
                    state.validWhiteMoves['wk1'] = whiteKingMoves.filter(move => move !== 'g1');
                }
                // Remove queenside castling if path is attacked
                if (whiteKingMoves.includes('c1') && 
                    state.blackTargetSquareIds.some(id => ['e1', 'd1', 'c1'].includes(id))) {
                    state.validWhiteMoves['wk1'] = whiteKingMoves.filter(move => move !== 'c1');
                }
            }
        }
    
        // Black king castling check
        if (state.squares['e8'] === 'bk1' && !state.movedPieces.includes('bk1')) {
            const blackKingMoves = state.validBlackMoves['bk1'];
            if (blackKingMoves) {
                // Remove kingside castling if path is attacked
                if (blackKingMoves.includes('g8') && 
                    state.whiteTargetSquareIds.some(id => ['e8', 'f8', 'g8'].includes(id))) {
                    state.validBlackMoves['bk1'] = blackKingMoves.filter(move => move !== 'g8');
                }
                // Remove queenside castling if path is attacked
                if (blackKingMoves.includes('c8') && 
                    state.whiteTargetSquareIds.some(id => ['e8', 'd8', 'c8'].includes(id))) {
                    state.validBlackMoves['bk1'] = blackKingMoves.filter(move => move !== 'c8');
                }
            }
        }
    }

    updateChecks(state: ChessBoardState): void {

        const whiteKingSquareId = state.whiteKingStatus.squareId;
        const blackKingSquareId = state.blackKingStatus.squareId;

        // reset before checking
        state.whiteKingStatus = {
            squareId: whiteKingSquareId,
            isInCheck: false,
            isInCheckMate: false,
        };
        state.blackKingStatus = {
            squareId: blackKingSquareId,
            isInCheck: false,
            isInCheckMate: false,
        };
        state.isInStalemate = false;

        if (state.blackTargetSquareIds.includes(whiteKingSquareId)) {
            state.whiteKingStatus.isInCheck = true;
        }
        if (state.whiteTargetSquareIds.includes(blackKingSquareId)) {
            state.blackKingStatus.isInCheck = true;
        }
    }

}

