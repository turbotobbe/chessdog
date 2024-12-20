import * as chess from "@/types/chess";
import { getPossibleMovesForPiece } from "./chessMoves";
import { castlingRookMoves, ColorName, FileName, files, GameSetup, Move, PieceId, pieceIds, PieceInfo, PieceName, RankName, ranks, SquareId, squareIds, SquareInfo } from "@/types/chess";

export function asPieceInfo(pieceId: PieceId): PieceInfo {
    return {
        id: pieceId,
        colorName: pieceId.charAt(0) as ColorName,
        pieceName: pieceId.charAt(1) as PieceName,
        number: parseInt(pieceId.charAt(2), 10),
        promotionPieceName: pieceId.charAt(3) as PieceName | undefined
    };
}

export function asPieceId(pieceInfo: PieceInfo): PieceId {
    if (pieceInfo.promotionPieceName) {
        return `${pieceInfo.colorName}${pieceInfo.pieceName}${pieceInfo.number}${pieceInfo.promotionPieceName}` as PieceId;
    }
    return `${pieceInfo.colorName}${pieceInfo.pieceName}${pieceInfo.number}` as PieceId;
}

export function asSquareInfo(squareId: SquareId): SquareInfo {
    const fileName = squareId.charAt(0) as FileName;
    const rankName = squareId.charAt(1) as RankName;
    const fileIndex = files.indexOf(fileName);
    const rankIndex = ranks.indexOf(rankName);
    return {
        id: squareId,
        fileName: fileName,
        rankName: rankName,
        fileIndex: fileIndex,
        rankIndex: rankIndex
    };
}

export function asSquareId(fileIndex: number, rankIndex: number): SquareId {
    const fileName = files[fileIndex];
    const rankName = ranks[rankIndex];
    return `${fileName}${rankName}` as SquareId;
}

export class ChessPieceState {
    public id: PieceId;
    public colorName: ColorName;
    public pieceName: PieceName;
    public validMoveSquareIds: SquareId[] = [];

    constructor(pieceId: PieceId) {
        const pieceInfo = asPieceInfo(pieceId);
        this.id = pieceId;
        this.colorName = pieceInfo.colorName;
        this.pieceName = pieceInfo.pieceName;
        this.validMoveSquareIds = [];
    }

    clone(): ChessPieceState {
        const cloneChessPieceState = new ChessPieceState(this.id);
        cloneChessPieceState.pieceName = this.pieceName;
        cloneChessPieceState.validMoveSquareIds = [...this.validMoveSquareIds];
        return cloneChessPieceState;
    }
}

export class ChessGameState {

    // initialize the board with empty squares
    private board: (ChessPieceState | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null));

    // initialize the inactive pieces
    public capturedWhitePieceIds: PieceId[] = [];
    public capturedBlackPieceIds: PieceId[] = [];
    private movedPieceIds: PieceId[] = [];

    public whitesTurn: boolean = true;

    public whiteKingSquareId: SquareId | null = null;
    public whiteKingInCheck: boolean = false;
    public whiteKingInCheckMate: boolean = false;

    public blackKingSquareId: SquareId | null = null;
    public blackKingInCheck: boolean = false;
    public blackKingInCheckMate: boolean = false;

    public isStalemate: boolean = false;

    public lastMove: { fromSquareId: SquareId | null, toSquareId: SquareId | null } = { fromSquareId: null, toSquareId: null };

    public pgn: string = "";

    public comments: string[] = [];
    public marks: SquareId[] = [];
    public arrows: { fromSquareId: SquareId, toSquareId: SquareId }[] = [];

    initialize(setup: GameSetup) {
        for (const [squareId, pieceId] of Object.entries(setup)) {
            this.setPieceAt(squareId as SquareId, new ChessPieceState(pieceId as PieceId));
        }
        this.updateKingPositions();

        const setupPieceIds = Object.values(setup).map(pieceId => pieceId as PieceId);
        const excludedPieceIds = pieceIds.filter(pieceId => !setupPieceIds.includes(pieceId));
        const excludedWhitePieceIds = excludedPieceIds.filter(pieceId => pieceId.charAt(0) === 'w');
        const excludedBlackPieceIds = excludedPieceIds.filter(pieceId => pieceId.charAt(0) === 'b');
        this.capturedWhitePieceIds = [...excludedWhitePieceIds];
        this.capturedBlackPieceIds = [...excludedBlackPieceIds];

        // this is done outside of initialize
        // updateChecksAndMatesStatuses(this);
        // updateValidMoves(this);
        // filterValidMoves(this);
    }

    getCapturedWhitePieceIds(): PieceId[] {
        return this.capturedWhitePieceIds;
    }

    getCapturedBlackPieceIds(): PieceId[] {
        return this.capturedBlackPieceIds;
    }

    getPieceAt(squareId: SquareId): ChessPieceState | null {
        const squareInfo = asSquareInfo(squareId);
        return this.board[squareInfo.rankIndex]?.[squareInfo.fileIndex] ?? null;
    }

    setPieceAt(squareId: SquareId, pieceInfo: ChessPieceState | null): void {
        const squareInfo = asSquareInfo(squareId);
        this.board[squareInfo.rankIndex][squareInfo.fileIndex] = pieceInfo;
        this.updateKingPositions();
    }

    capturePieceAt(squareId: SquareId): void {
        const squareInfo = asSquareInfo(squareId);
        const pieceInfo = this.getPieceAt(squareId);
        if (pieceInfo) {
            if (pieceInfo.colorName === 'w') {
                this.capturedWhitePieceIds.push(pieceInfo.id);
            } else {
                this.capturedBlackPieceIds.push(pieceInfo.id);
            }
            this.board[squareInfo.rankIndex][squareInfo.fileIndex] = null;
        }
        this.updateKingPositions();
    }

    movePiece(fromSquareId: SquareId, toSquareId: SquareId): void {
        const pieceInfo = this.getPieceAt(fromSquareId);
        if (pieceInfo) {
            this.setPieceAt(toSquareId, pieceInfo);
            this.setPieceAt(fromSquareId, null);
            if (!this.movedPieceIds.includes(pieceInfo.id)) {
                this.movedPieceIds.push(pieceInfo.id);
            }
            this.lastMove = { fromSquareId, toSquareId };
        }
        this.updateKingPositions();
    }

    hasMoved(pieceId: PieceId): boolean {
        return this.movedPieceIds.includes(pieceId);
    }

    updateKingPositions(): void {
        this.whiteKingSquareId = squareIds.find(squareId => this.getPieceAt(squareId)?.id === chess.whiteKing) as SquareId | null;
        this.blackKingSquareId = squareIds.find(squareId => this.getPieceAt(squareId)?.id === chess.blackKing) as SquareId | null;
    }

    clone(): ChessGameState {
        const cloneChessGameState = new ChessGameState();
        cloneChessGameState.whitesTurn = this.whitesTurn;
        cloneChessGameState.whiteKingSquareId = this.whiteKingSquareId;
        cloneChessGameState.whiteKingInCheck = this.whiteKingInCheck;
        cloneChessGameState.whiteKingInCheckMate = this.whiteKingInCheckMate;
        cloneChessGameState.blackKingSquareId = this.blackKingSquareId;
        cloneChessGameState.blackKingInCheck = this.blackKingInCheck;
        cloneChessGameState.blackKingInCheckMate = this.blackKingInCheckMate;
        cloneChessGameState.isStalemate = this.isStalemate;
        cloneChessGameState.board = this.board.map(row => row.map(piece => piece ? piece.clone() : null));
        cloneChessGameState.capturedWhitePieceIds = [...this.capturedWhitePieceIds];
        cloneChessGameState.capturedBlackPieceIds = [...this.capturedBlackPieceIds];
        cloneChessGameState.movedPieceIds = [...this.movedPieceIds];
        cloneChessGameState.lastMove = { fromSquareId: this.lastMove.fromSquareId, toSquareId: this.lastMove.toSquareId };
        cloneChessGameState.pgn = this.pgn;
        cloneChessGameState.comments = [...this.comments];
        cloneChessGameState.marks = [...this.marks];
        cloneChessGameState.arrows = [...this.arrows];
        return cloneChessGameState;
    }

}

function isKingInCheck(chessGameState: ChessGameState, color: ColorName): boolean {
    const kingSquareId = color === 'w' ? chessGameState.whiteKingSquareId : chessGameState.blackKingSquareId;
    const opponentColor = color === 'w' ? 'b' : 'w';

    if (kingSquareId) {
        for (const squareId of squareIds) {
            const pieceInfo = chessGameState.getPieceAt(squareId);
            if (pieceInfo && pieceInfo.colorName === opponentColor) {
                const possibleMoves = getPossibleMovesForPiece(chessGameState, squareId, pieceInfo);
                if (possibleMoves.includes(kingSquareId)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isKingInCheckMate(chessGameState: ChessGameState, color: ColorName): boolean {

    // Check if the king is in check
    if (color === 'w' && !chessGameState.whiteKingInCheck) {
        return false;
    }
    if (color === 'b' && !chessGameState.blackKingInCheck) {
        return false;
    }

    // Count the number of valid moves for all pieces of the current color
    for (const squareId of squareIds) {
        const pieceInfo = chessGameState.getPieceAt(squareId);
        if (pieceInfo && pieceInfo.colorName === color) {
            if (pieceInfo.validMoveSquareIds.length > 0) {
                return false; // If any piece has a valid move, it's not checkmate
            }
        }
    }

    // If we've checked all pieces and found none with valid moves, it's checkmate
    return true;
}

function isStalemate(chessGameState: ChessGameState): boolean {
    const currentColor = chessGameState.whitesTurn ? 'w' : 'b';

    // If the current player's king is in check, it's not a stalemate
    if ((currentColor === 'w' && chessGameState.whiteKingInCheck) ||
        (currentColor === 'b' && chessGameState.blackKingInCheck)) {
        return false;
    }

    // Check if the current player has any legal moves
    for (const squareId of squareIds) {
        const pieceInfo = chessGameState.getPieceAt(squareId);
        if (pieceInfo && pieceInfo.colorName === currentColor) {
            if (pieceInfo.validMoveSquareIds.length > 0) {
                // console.log(`Piece ${pieceInfo.id} at ${squareId} has valid moves: ${pieceInfo.validMoveSquareIds}`);
                return false; // If any piece has a valid move, it's not a stalemate
            }
        }
    }

    // If we've checked all pieces and found none with valid moves, it's a stalemate
    return true;
}

export function updateValidMoves(chessGameState: ChessGameState): void {

    // generate all possible moves for each piece
    for (const squareId of squareIds) {
        const pieceInfo = chessGameState.getPieceAt(squareId);
        if (pieceInfo) {
            pieceInfo.validMoveSquareIds = getPossibleMovesForPiece(chessGameState, squareId, pieceInfo);
        }
    }
}

export function updateChecksAndMatesStatuses(chessGameState: ChessGameState): void {
    chessGameState.whiteKingInCheck = isKingInCheck(chessGameState, 'w');
    chessGameState.blackKingInCheck = isKingInCheck(chessGameState, 'b');
    chessGameState.whiteKingInCheckMate = chessGameState.whiteKingInCheck && isKingInCheckMate(chessGameState, 'w');
    chessGameState.blackKingInCheckMate = chessGameState.blackKingInCheck && isKingInCheckMate(chessGameState, 'b');
    chessGameState.isStalemate = isStalemate(chessGameState);
}

export function filterValidMoves(chessGameState: ChessGameState): void {

    // iterate all squares to filter all valid moves
    for (const squareId of squareIds) {
        const pieceInfo = chessGameState.getPieceAt(squareId);
        if (pieceInfo) {
            // if (squareId == chess.g2) {
            //     console.log(`Filtering moves for piece ${pieceInfo.id} at ${squareId}`);
            //     console.log(`Initial valid moves: ${pieceInfo.validMoveSquareIds}`);
            // }
            pieceInfo.validMoveSquareIds = pieceInfo.validMoveSquareIds.filter(moveSquareId => {

                // if (squareId == chess.g2) {
                //     console.log(`Checking move ${moveSquareId} for piece ${pieceInfo.id}`);
                // }

                // create a new simulated chess game state
                const simulatedChessGameState = chessGameState.clone();

                // move the current piece to the new square
                simulatedChessGameState.movePiece(squareId, moveSquareId);

                // if (squareId == chess.g2) {
                //     console.log(`Before updateKingCheckStatus: White in check: ${simulatedChessGameState.whiteKingInCheck}, Black in check: ${simulatedChessGameState.blackKingInCheck}`);
                // }
                // update the king check status
                updateChecksAndMatesStatuses(simulatedChessGameState);
                // if (squareId == chess.g2) {
                //     console.log(`After updateKingCheckStatus: White in check: ${simulatedChessGameState.whiteKingInCheck}, Black in check: ${simulatedChessGameState.blackKingInCheck}`);
                // }

                // Check if the move puts or leaves the king in check
                const isValid = pieceInfo.colorName === 'w'
                    ? !simulatedChessGameState.whiteKingInCheck
                    : !simulatedChessGameState.blackKingInCheck;

                // if (squareId == chess.g2) {
                //     console.log(`Move ${moveSquareId} is ${isValid ? 'valid' : 'invalid'}`);
                // }
                return isValid;
            });
        }
    }

}
function handleEnPassant(chessGameState: ChessGameState, fromSquareInfo: SquareInfo, toSquareInfo: SquareInfo, pieceToMove: ChessPieceState): boolean {

    // 1. The piece being moved must be a pawn.
    // 2. The last move in the game must have been made by a pawn.
    // 3. The last move must have been a double-step move (moving two squares forward).
    // 4. The capturing pawn must be moving diagonally one square.
    // The capturing pawn must end up on the square that the captured pawn "skipped" over. This means:
    // 5.1. If it's a white pawn being captured, the capturing pawn moves to the rank between the captured pawn's start and end positions.
    // 5.2. If it's a black pawn being captured, the capturing pawn moves to the rank between the captured pawn's start and end positions.
    // 6. The capturing pawn must move to the same file as the pawn that just made the double-step move.
    // 7. The capture must be made immediately after the double-step move. If not done immediately, the right to capture en passant is lost.
    // 8. The capturing pawn must have been on the correct rank to make the capture:
    // 8.1. For a white pawn capturing, it must have been on the 5th rank.
    // 8.2. For a black pawn capturing, it must have been on the 4th rank.

    const lastMove = chessGameState.lastMove;
    if (!lastMove.fromSquareId || !lastMove.toSquareId) return false;

    const lastMovePiece = chessGameState.getPieceAt(lastMove.toSquareId);
    if (lastMovePiece?.pieceName !== 'p') return false;

    const lastMoveToSquareInfo = asSquareInfo(lastMove.toSquareId);
    const lastMoveFromSquareInfo = asSquareInfo(lastMove.fromSquareId);

    if (Math.abs(lastMoveToSquareInfo.rankIndex - lastMoveFromSquareInfo.rankIndex) !== 2) return false;
    if (Math.abs(toSquareInfo.fileIndex - fromSquareInfo.fileIndex) !== 1) return false;

    const lastMoveMinRankIndex = Math.min(lastMoveToSquareInfo.rankIndex, lastMoveFromSquareInfo.rankIndex);
    const lastMoveMaxRankIndex = Math.max(lastMoveToSquareInfo.rankIndex, lastMoveFromSquareInfo.rankIndex);
    if (toSquareInfo.rankIndex <= lastMoveMinRankIndex || toSquareInfo.rankIndex >= lastMoveMaxRankIndex) return false;
    if (toSquareInfo.fileIndex !== lastMoveToSquareInfo.fileIndex) return false;

    if ((pieceToMove.colorName === 'w' && fromSquareInfo.rankName === '5') ||
        (pieceToMove.colorName === 'b' && fromSquareInfo.rankName === '4')) {
        chessGameState.capturePieceAt(lastMove.toSquareId);
        return true;
    }

    return false;
}

function handleCastling(chessGameState: ChessGameState, fromSquareInfo: SquareInfo, toSquareInfo: SquareInfo, movingPiece: ChessPieceState): boolean {
    if (!movingPiece) {
        return false;
    }
    if (movingPiece.pieceName !== 'k') {
        return false;
    }
    const isKingside = toSquareInfo.fileIndex - fromSquareInfo.fileIndex === 2;
    const isQueenside = fromSquareInfo.fileIndex - toSquareInfo.fileIndex === 2;
    if (!(isKingside || isQueenside)) {
        return false;
    }

    const rookMove = castlingRookMoves[movingPiece.colorName][isKingside ? chess.kingside : chess.queenside];
    chessGameState.movePiece(rookMove.fromSquareId, rookMove.toSquareId);
    return true;
}

function handlePawnPromotion(chessGameState: ChessGameState, toSquareInfo: SquareInfo, movingPiece: ChessPieceState, promotionPieceName?: PieceName): boolean {
    // Handle pawn promotion
    if (!movingPiece || movingPiece.pieceName !== 'p') {
        return false;
    }

    if (!(toSquareInfo.rankName === '8' || toSquareInfo.rankName === '1')) {
        return false;
    }
    if (!promotionPieceName) {
        throw new Error("Pawn promotion piece not specified");
    }
    movingPiece.pieceName = promotionPieceName;
    chessGameState.setPieceAt(toSquareInfo.id, movingPiece);
    return true;
}

export function nextChessGameState(
    chessGameState: ChessGameState,
    move: Move): ChessGameState {


    // console.log(move)
    const toSquareInfo = asSquareInfo(move.targetSquareId);
    const fromSquareInfo = asSquareInfo(move.sourceSquareId);

    // console.log(`next chess game state for move ${move.fromSquareId} to ${move.toSquareId}`);
    // console.log(chessGameState);

    // create the new chess game state
    const newChessGameState = chessGameState.clone();

    // Validate the move
    const pieceToMove = newChessGameState.getPieceAt(move.sourceSquareId);
    if (!pieceToMove || !pieceToMove.validMoveSquareIds.includes(move.targetSquareId)) {
        console.log(`Invalid move: ${move.sourceSquareId} to ${move.targetSquareId}`);
        console.log(pieceToMove);
        console.log(pieceToMove?.validMoveSquareIds);
        throw new Error("Invalid move");
    }

    let isEnPassant = false;
    let isCapture = false;
    let isCastling: chess.SideName | null = null;
    let isPawnPromotion = false;

    // Handle en passant capture
    if (handleEnPassant(newChessGameState, fromSquareInfo, toSquareInfo, pieceToMove)) {
        isEnPassant = true;
        // console.log(`en passant move ${move.sourceSquareId} to ${move.targetSquareId}`);
    }

    // Handle capture
    if (newChessGameState.getPieceAt(move.targetSquareId)) {
        isCapture = true;
        // console.log(`capture move ${move.targetSquareId}`);
        newChessGameState.capturePieceAt(move.targetSquareId);
    }

    // move the piece
    newChessGameState.movePiece(move.sourceSquareId, move.targetSquareId);

    // Handle castling
    if (handleCastling(newChessGameState, fromSquareInfo, toSquareInfo, pieceToMove)) {
        isCastling = toSquareInfo.fileIndex - fromSquareInfo.fileIndex === 2 ? chess.kingside : chess.queenside;
        // console.log(`castling move ${move.sourceSquareId} to ${move.targetSquareId}`);
    }

    if (handlePawnPromotion(newChessGameState, toSquareInfo, pieceToMove, move.promotionPieceName)) {
        isPawnPromotion = true;
        // console.log(`pawn promotion move ${move.sourceSquareId} to ${move.targetSquareId}`);
    }

    // switch turns
    newChessGameState.whitesTurn = !newChessGameState.whitesTurn;

    // update the valid moves
    updateValidMoves(newChessGameState);

    // remove moves that put the king in check
    filterValidMoves(newChessGameState);

    // update the king check status
    updateChecksAndMatesStatuses(newChessGameState);

    const pgnMove = generatePGNMove(
        chessGameState,
        newChessGameState,
        fromSquareInfo,
        toSquareInfo,
        pieceToMove,
        isEnPassant,
        isCapture,
        isCastling,
        isPawnPromotion,
        move.promotionPieceName);
    newChessGameState.pgn = pgnMove;

    // console.log(newChessGameState.capturedBlackPieceIds);
    // console.log(newChessGameState.capturedWhitePieceIds);
    // if (newChessGameState.blackKingSquareId) {
    //     const blackKingPieceInfo = newChessGameState.getPieceAt(newChessGameState.blackKingSquareId);
    //     console.log("black king valid moves", blackKingPieceInfo?.validMoveSquareIds);
    // }
    return newChessGameState;
}

export function getSetupChessGameState(setup: GameSetup): ChessGameState {
    const initialChessGameState = new ChessGameState();
    // const positions = setup.white.concat(setup.black);
    initialChessGameState.initialize(setup);

    // update the valid moves
    updateValidMoves(initialChessGameState);

    // remove moves that put the king in check
    filterValidMoves(initialChessGameState);

    // update the king check status
    updateChecksAndMatesStatuses(initialChessGameState);

    // console.log(`initial chess game state`);
    // console.log(initialChessGameState);

    return initialChessGameState;
}

export function getDefaultChessGameState(): ChessGameState {
    const initialChessGameState = new ChessGameState();
    initialChessGameState.initialize({
        [chess.a1]: chess.whiteQueensideRook,
        [chess.b1]: chess.whiteQueensideKnight,
        [chess.c1]: chess.whiteQueensideBishop,
        [chess.d1]: chess.whiteQueen,
        [chess.e1]: chess.whiteKing,
        [chess.f1]: chess.whiteKingsideBishop,
        [chess.g1]: chess.whiteKingsideKnight,
        [chess.h1]: chess.whiteKingsideRook,
        [chess.a2]: chess.whitePawn1,
        [chess.b2]: chess.whitePawn2,
        [chess.c2]: chess.whitePawn3,
        [chess.d2]: chess.whitePawn4,
        [chess.e2]: chess.whitePawn5,
        [chess.f2]: chess.whitePawn6,
        [chess.g2]: chess.whitePawn7,
        [chess.h1]: chess.whiteKingsideRook,
        [chess.a2]: chess.whitePawn1,
        [chess.b2]: chess.whitePawn2,
        [chess.c2]: chess.whitePawn3,
        [chess.d2]: chess.whitePawn4,
        [chess.e2]: chess.whitePawn5,
        [chess.f2]: chess.whitePawn6,
        [chess.g2]: chess.whitePawn7,
        [chess.h2]: chess.whitePawn8,
        [chess.a7]: chess.blackPawn1,
        [chess.b7]: chess.blackPawn2,
        [chess.c7]: chess.blackPawn3,
        [chess.d7]: chess.blackPawn4,
        [chess.e7]: chess.blackPawn5,
        [chess.f7]: chess.blackPawn6,
        [chess.g7]: chess.blackPawn7,
        [chess.h7]: chess.blackPawn8,
        [chess.a8]: chess.blackQueensideRook,
        [chess.b8]: chess.blackQueensideKnight,
        [chess.c8]: chess.blackQueensideBishop,
        [chess.d8]: chess.blackQueen,
        [chess.e8]: chess.blackKing,
        [chess.f8]: chess.blackKingsideBishop,
        [chess.g8]: chess.blackKingsideKnight,
        [chess.h8]: chess.blackKingsideRook,
    });


    // update the valid moves
    updateValidMoves(initialChessGameState);

    // remove moves that put the king in check
    filterValidMoves(initialChessGameState);

    // update the king check status
    updateChecksAndMatesStatuses(initialChessGameState);

    // console.log(`initial chess game state`);
    // console.log(initialChessGameState);

    return initialChessGameState;
}

function placeOnBoard(pieceIds: PieceId[], squareIds: SquareId[], gameSetup: GameSetup): GameSetup | null {
    // console.log("placeOnBoard", pieceIds, squareIds);
    if (pieceIds.length === 0) {
        return gameSetup; // All pieces have been placed successfully
    }

    const currentPieceId = pieceIds[0];
    const remainingPieceIds = pieceIds.slice(1);

    const shuffledSquareIds = [...squareIds].sort(() => 0.5 - Math.random());
    for (const squareId of shuffledSquareIds) {
        // Try placing the current piece on this square

        const newGameSetup = { ...gameSetup };
        newGameSetup[squareId] = currentPieceId;

        // Check if the current setup is valid
        if (isValidSetup(newGameSetup)) {
            // Recursively try to place the remaining pieces
            return placeOnBoard(remainingPieceIds, squareIds.filter(id => id !== squareId), newGameSetup);
        }
    }

    return null; // No valid placement found for this piece
}

function isValidSetup(gameSetup: GameSetup): boolean {
    // console.log("isValidSetup", gameSetup);
    const chessGameState = getSetupChessGameState(gameSetup);

    // // Check for basic validity (e.g., kings are present, pawns are not on the first or last rank)
    // if (!chessGameState.whiteKingSquareId || !chessGameState.blackKingSquareId) {
    //     return false;
    // }

    // Get all squares with pawns on them from gameSetup
    const pawnSquares = Object.entries(gameSetup)
        .filter(([_, pieceId]) => asPieceInfo(pieceId).pieceName === 'p')
        .map(([squareId, _]) => squareId as SquareId);

    // Check if any pawns are on the first or last rank
    const pawnsOnInvalidRanks = pawnSquares.some(squareId => {
        const squareInfo = asSquareInfo(squareId);
        return squareInfo.rankName === '1' || squareInfo.rankName === '8';
    });

    if (pawnsOnInvalidRanks) {
        return false;
    }

    // Get all squares with bishops on them from gameSetup
    const bishopSquares = Object.entries(gameSetup)
        .filter(([_, pieceId]) => asPieceInfo(pieceId).pieceName === 'b')
        .map(([squareId, _]) => squareId as SquareId);

    const bishopsOnInvalidSquares = bishopSquares.some(squareId => {
        const pieceId = gameSetup[squareId];
        if (!pieceId) {
            return false;
        }
        // Check if light square bishop is on a light square
        if (['wb1', 'bb1'].includes(pieceId) && chess.lightSquareIds.includes(squareId)) {
            return true
        }
        // check if dark square bishop is on a dark square
        if (['wb1', 'bb1'].includes(pieceId) && chess.lightSquareIds.includes(squareId)) {
            return true
        }
        return false
    }
    );

    if (bishopsOnInvalidSquares) {
        return false;
    }

    // Check if either king is in check
    if (chessGameState.whiteKingInCheck || chessGameState.blackKingInCheck) {
        return false;
    }

    return true;
}

export function getValidRandomSetup(drill: PieceId[]): GameSetup {
    let pieceIds = [...drill];

    const initialSetup: GameSetup = {};
    const validSetup = placeOnBoard(pieceIds, squareIds, initialSetup);

    if (!validSetup) {
        throw new Error("Unable to generate a valid random chess game state");
    }

    return validSetup;
}

function generatePGNMove(
    prevChessGameState: ChessGameState,
    chessGameState: ChessGameState,
    fromSquareInfo: SquareInfo,
    toSquareInfo: SquareInfo,
    pieceToMove: ChessPieceState,
    isEnPassant: boolean,
    isCapture: boolean,
    isCastling: chess.SideName | null,
    isPawnPromotion: boolean,
    promotionPieceName?: PieceName
): string {

    let pgnMove = "";
    if (isCastling === chess.kingside) {
        pgnMove = "O-O";
    }
    else if (isCastling === chess.queenside) {
        pgnMove = "O-O-O";
    } else {

        const specifiedSource = getDisambiguation(prevChessGameState, fromSquareInfo, toSquareInfo, pieceToMove);
        if (isPawnPromotion) {
            if (isCapture) {
                pgnMove += fromSquareInfo.fileName;
            }
        } else if (specifiedSource.length > 0) {
            pgnMove += specifiedSource;
        } else if (pieceToMove.pieceName !== 'p') {
            pgnMove += pieceToMove.pieceName.toUpperCase();
        } else if (isCapture || isEnPassant) {
            pgnMove += fromSquareInfo.fileName;
        }

        // source destination

        if (isCapture || isEnPassant) {
            pgnMove += "x";
        }

        // Bxd3
        pgnMove += toSquareInfo.id;

        if (isEnPassant) {
            pgnMove += " e.p.";
        }
    }

    if (isPawnPromotion) {
        if (!promotionPieceName) {
            throw new Error("Pawn promotion piece not specified");
        }
        // d8=Q
        pgnMove += "=" + promotionPieceName.toUpperCase();
    }

    if (chessGameState.whitesTurn) {
        if (chessGameState.whiteKingInCheckMate) {
            pgnMove += "#";
        } else if (chessGameState.whiteKingInCheck) {
            pgnMove += "+";
        }
    } else {
        if (chessGameState.blackKingInCheckMate) {
            pgnMove += "#";
        } else if (chessGameState.blackKingInCheck) {
            pgnMove += "+";
        }
    }

    return pgnMove;
}

function getDisambiguation(
    chessGameState: ChessGameState,
    fromSquareInfo: SquareInfo,
    toSquareInfo: SquareInfo,
    pieceToMove: ChessPieceState
): string {
    const sourceSquareInfos = squareIds.filter(squareId => {
        const pieceInfo = chessGameState.getPieceAt(squareId);
        return pieceInfo &&
            pieceInfo.pieceName === pieceToMove.pieceName &&
            pieceInfo.colorName === pieceToMove.colorName &&
            pieceInfo.validMoveSquareIds.includes(toSquareInfo.id);
    }).map(squareId => asSquareInfo(squareId));

    if (sourceSquareInfos.length < 2) {
        return "";
    }

    let fileDisambiguation = "";
    let rankDisambiguation = "";

    // Check if file disambiguation is sufficient
    if (sourceSquareInfos.filter(squareInfo => squareInfo.fileName === fromSquareInfo.fileName).length === 1) {
        fileDisambiguation = fromSquareInfo.fileName;
    } else {
        // If file is not enough, use rank
        rankDisambiguation = fromSquareInfo.rankName;
        // If rank is also not enough, use both file and rank
        if (sourceSquareInfos.filter(squareInfo => squareInfo.rankName === fromSquareInfo.rankName).length > 1) {
            fileDisambiguation = fromSquareInfo.fileName;
        }
    }

    return fileDisambiguation + rankDisambiguation;
}
