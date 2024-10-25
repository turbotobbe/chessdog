import { ChessBoardController } from "@/contexts/ChessBoardController";
import { ChessBoardState, ChessBoardTree, defaultChessBoardState } from "@/contexts/ChessBoardState";
import { castelingSquareIds, PieceId, PieceInfo, SquareId } from "@/types/chess";
import { asPieceInfo, asSquareInfo } from "@/models/chess";
import { CastleStatus, getCandidateMoves } from "./CandidateMoves";
import { HistoryChessBoardController } from "./HistoryChessBoardController";

export const defaultChessBoardController = (canWhiteBeChecked: boolean = true, canBlackBeChecked: boolean = true, initialState?: ChessBoardState) => {
    return new DefaultChessBoardController(canWhiteBeChecked, canBlackBeChecked, initialState ?? defaultChessBoardState());
};

export class DefaultChessBoardController extends HistoryChessBoardController {

    private enableWhite: boolean;
    private enableBlack: boolean;

    constructor(
        enableWhite: boolean,
        enableBlack: boolean,
        initialState: ChessBoardState,
        gameTree?: ChessBoardTree
    ) {
        super(initialState, gameTree);
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

        if (this.handlePromotion(state, sourceId, targetId, sourcePieceInfo)) {
            console.log(`${actualMove ? '(actual)' : '(simulation)'} handled promotion`, sourcePieceId, sourcePieceInfo);
        } else if (this.handleEnPassant(state, sourceId, targetId, sourcePieceInfo)) {
            console.log(`${actualMove ? '(actual)' : '(simulation)'} handled en passant`, sourcePieceId, sourcePieceInfo);
        } else if (this.handleCastling(state, sourceId, targetId, sourcePieceInfo)) {
            console.log(`${actualMove ? '(actual)' : '(simulation)'} handled castling`, sourcePieceId, sourcePieceInfo);
        }

        // do the move ...
        super.onMove(sourceId, targetId, state);

        // update game state (this is a new state!)
        this.updateGameState(this.currentState(), currentMove, actualMove);
        if (actualMove) {
            console.log(this.gameTree);
        }
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
            rookSourceSquareId = castleKingSide ? 'a8' : 'h8';
            rookTargetSquareId = castleKingSide ? 'd8' : 'f8';
        }

        // all ok, lets castle
        this.moveBetweenSquares(state, rookSourceSquareId, rookTargetSquareId);
        return true;
    };

    clone(): ChessBoardController {
        const newController = new DefaultChessBoardController(
            this.enableWhite,
            this.enableBlack,
            this.initialState,
            this.gameTree.clone()
        );
        return newController;
    }

    updateGameState(state: ChessBoardState, currentMove: [SquareId, SquareId], actualMove: boolean): void {

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
        // this.updateCastleStatus();
        this.updateCastlingMoves(state);

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

        // Check for stalemate
        const isWhiteTurn = state.whitesTurn;
        const isStalemate = (isWhiteTurn && !hasWhiteValidMoves && !state.whiteKingStatus.isInCheck) ||
            (!isWhiteTurn && !hasBlackValidMoves && !state.blackKingStatus.isInCheck);
        state.isInStalemate = isStalemate;
        if (!isStalemate) {
            // check checkmate and statemate
            state.whiteKingStatus.isInCheckMate = !hasWhiteValidMoves;
            state.blackKingStatus.isInCheckMate = !hasBlackValidMoves;
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
        const newValidMoves: Partial<Record<PieceId, SquareId[]>> = {};
        for (const [pieceId, targetSquareIds] of Object.entries(validMoves)) {
            if (!targetSquareIds) {
                continue;
            }
            const sourceId = Object.entries(state.squares).find(([_squareId, id]) => id === pieceId)?.[0] as SquareId;
            if (!sourceId) {
                console.warn(`Square not found for piece ${pieceId}`);
                continue;
            }
            const pieceInfo = asPieceInfo(pieceId as PieceId);
            const filteredTargetSquareIds: SquareId[] = [];
            for (const targetId of targetSquareIds) {

                // check if same color king is in check
                const simulatedState = this.simulateMove(state, sourceId, targetId);
                if (pieceInfo.colorName === 'w') {
                    if (!simulatedState.whiteKingStatus.isInCheck) {
                        filteredTargetSquareIds.push(targetId);
                    }
                } else {
                    if (!simulatedState.blackKingStatus.isInCheck) {
                        filteredTargetSquareIds.push(targetId);
                    }
                }
            }
            if (filteredTargetSquareIds.length > 0) {
                newValidMoves[pieceId as PieceId] = filteredTargetSquareIds;
            }
        }
        return newValidMoves;
    }

    simulateMove(state: ChessBoardState, sourceId: SquareId, targetId: SquareId): ChessBoardState {
        if (targetId === 'h5') {
            console.log('simulateMove', sourceId, targetId);
        }
        const simulationController = new DefaultChessBoardController(
            this.enableWhite,
            this.enableBlack,
            state.clone()
        );
        const simulatedState = simulationController.currentState();

        // set checks to false to see if the move puts the king in check
        simulatedState.whiteKingStatus = {
            squareId: simulatedState.whiteKingStatus.squareId,
            isInCheck: false,
            isInCheckMate: false,
        }
        simulatedState.blackKingStatus = {
            squareId: simulatedState.blackKingStatus.squareId,
            isInCheck: false,
            isInCheckMate: false,
        }
        simulatedState.isInStalemate = false;

        simulationController.onSimulateMove(sourceId, targetId);
        return simulationController.currentState();
    }

    updateCastlingMoves(state: ChessBoardState): void {

        const whiteTargetSquareIds: SquareId[] = state.whiteTargetSquareIds;
        const blackTargetSquareIds: SquareId[] = state.blackTargetSquareIds;

        const whiteKingSquareId: SquareId = state.whiteKingStatus.squareId;
        const blackKingSquareId: SquareId = state.blackKingStatus.squareId;
        const whiteKingPieceId: PieceId | undefined = state.squares[whiteKingSquareId];
        const blackKingPieceId: PieceId | undefined = state.squares[blackKingSquareId];

        if (!whiteKingPieceId) {
            console.warn(`whiteKingPieceId not found for ${whiteKingSquareId}`);
            return;
        }
        if (!blackKingPieceId) {
            console.warn(`blackKingPieceId not found for ${blackKingSquareId}`);
            return;
        }

        const whiteKingsValidMoves: SquareId[] | undefined = state.validWhiteMoves[whiteKingPieceId];
        const blackKingsValidMoves: SquareId[] | undefined = state.validBlackMoves[blackKingPieceId];


        if (whiteKingsValidMoves) {

            // check if king has the queen side castle move
            if (whiteKingsValidMoves.includes(castelingSquareIds.white.queenSide.castleSquareId)) {

                castelingSquareIds.white.queenSide.middleSquares.forEach(squareId => {
                    // check to see if any pieces is targeting the castle square
                    if (blackTargetSquareIds.includes(squareId)) {
                        // remove castling move
                        const index = whiteKingsValidMoves.indexOf(castelingSquareIds.white.queenSide.castleSquareId);
                        if (index > -1) {
                            whiteKingsValidMoves.splice(index, 1);
                        }
                    }
                });
            }
            // check if king has the king side castle move
            if (whiteKingsValidMoves.includes(castelingSquareIds.white.kingSide.castleSquareId)) {

                castelingSquareIds.white.kingSide.middleSquares.forEach(squareId => {
                    // check to see if any pieces is targeting the castle square
                    if (blackTargetSquareIds.includes(squareId)) {
                        // remove castling move
                        const index = whiteKingsValidMoves.indexOf(castelingSquareIds.white.kingSide.castleSquareId);
                        if (index > -1) {
                            whiteKingsValidMoves.splice(index, 1);
                        }
                    }
                });
            }
        }
        state.validWhiteMoves[whiteKingPieceId] = whiteKingsValidMoves;
        if (blackKingsValidMoves) {

            // check if king has the queen side castle move
            if (blackKingsValidMoves.includes(castelingSquareIds.black.queenSide.castleSquareId)) {

                castelingSquareIds.black.queenSide.middleSquares.forEach(squareId => {
                    // check to see if any pieces is targeting the castle square
                    if (whiteTargetSquareIds.includes(squareId)) {
                        // remove castling move
                        const index = blackKingsValidMoves.indexOf(castelingSquareIds.black.queenSide.castleSquareId);
                        if (index > -1) {
                            blackKingsValidMoves.splice(index, 1);
                        }
                    }
                });
            }
            // check if king has the king side castle move
            if (blackKingsValidMoves.includes(castelingSquareIds.black.kingSide.castleSquareId)) {

                castelingSquareIds.black.kingSide.middleSquares.forEach(squareId => {
                    // check to see if any pieces is targeting the castle square
                    if (whiteTargetSquareIds.includes(squareId)) {
                        // remove castling move
                        const index = blackKingsValidMoves.indexOf(castelingSquareIds.black.kingSide.castleSquareId);
                        if (index > -1) {
                            blackKingsValidMoves.splice(index, 1);
                        }
                    }
                });
            }
        }
        state.validBlackMoves[blackKingPieceId] = blackKingsValidMoves;
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

    getCastleStatus(state: ChessBoardState): CastleStatus {

        const whiteKingHasMoved = state.movedPieces.includes("wk1");
        const whiteQueenSideRookHasMoved = state.movedPieces.includes('wr1');
        const whiteKingSideRookHasMoved = state.movedPieces.includes('wr2');

        const isEmptyB1 = !state.squares['b1'];
        const isEmptyC1 = !state.squares['c1'];
        const isEmptyD1 = !state.squares['d1'];
        const whiteQueenSideEmpty = isEmptyB1 && isEmptyC1 && isEmptyD1;

        const isEmptyF1 = !state.squares['f1'];
        const isEmptyG1 = !state.squares['g1'];
        const whiteKingSideEmpty = isEmptyF1 && isEmptyG1;

        const blackKingHasMoved = state.movedPieces.includes("bk1");
        const blackQueenSideRookHasMoved = state.movedPieces.includes('br1');
        const blackKingSideRookHasMoved = state.movedPieces.includes('br2');

        const isEmptyB8 = !state.squares['b8'];
        const isEmptyC8 = !state.squares['c8'];
        const isEmptyD8 = !state.squares['d8'];
        const blackQueenSideEmpty = isEmptyB8 && isEmptyC8 && isEmptyD8;

        const isEmptyF8 = !state.squares['f8'];
        const isEmptyG8 = !state.squares['g8'];
        const blackKingSideEmpty = isEmptyF8 && isEmptyG8;

        const castleStatus = {
            white: {
                queenSide: !whiteKingHasMoved && !whiteQueenSideRookHasMoved && whiteQueenSideEmpty,
                kingSide: !whiteKingHasMoved && !whiteKingSideRookHasMoved && whiteKingSideEmpty,
            },
            black: {
                queenSide: !blackKingHasMoved && !blackQueenSideRookHasMoved && blackQueenSideEmpty,
                kingSide: !blackKingHasMoved && !blackKingSideRookHasMoved && blackKingSideEmpty,
            },
        };

        if (castleStatus.white.queenSide) {
            const squaresToCheck: SquareId[] = ['b1', 'c1', 'd1'];
            castleStatus.white.queenSide =
                squaresToCheck.every(squareId => !state.blackTargetSquareIds.includes(squareId));
        }
        if (castleStatus.white.kingSide) {
            const squaresToCheck: SquareId[] = ['f1', 'g1'];
            castleStatus.white.kingSide =
                squaresToCheck.every(squareId => !state.blackTargetSquareIds.includes(squareId));
        }
        if (castleStatus.black.queenSide) {
            const squaresToCheck: SquareId[] = ['b8', 'c8', 'd8'];
            castleStatus.black.queenSide =
                squaresToCheck.every(squareId => !state.whiteTargetSquareIds.includes(squareId));
        }
        if (castleStatus.black.kingSide) {
            const squaresToCheck: SquareId[] = ['f8', 'g8'];
            castleStatus.black.kingSide =
                squaresToCheck.every(squareId => !state.whiteTargetSquareIds.includes(squareId));
        }

        return castleStatus;
    }

}

