import * as chess from "@/types/chess";
import { getPossibleMovesForPiece } from "./chessMoves";
import { castlingRookMoves, ColorName, FileName, files, PieceId, PieceInfo, PieceName, RankName, ranks, SquareId, squareIds, SquareInfo } from "@/types/chess";

export function toPieceInfo(pieceId: PieceId): PieceInfo {
    return {
        id: pieceId,
        colorName: pieceId.charAt(0) as ColorName,
        pieceName: pieceId.charAt(1) as PieceName,
        number: parseInt(pieceId.charAt(2), 10)
    };
}

export function toSquareInfo(squareId: SquareId): SquareInfo {
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

export function toSquareId(fileIndex: number, rankIndex: number): SquareId {
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
        const pieceInfo = toPieceInfo(pieceId);
        this.id = pieceId;
        this.colorName = pieceInfo.colorName;
        this.pieceName = pieceInfo.pieceName;
        this.validMoveSquareIds = [];
    }

    clone(): ChessPieceState {
        const cloneChessPieceState = new ChessPieceState(this.id);
        cloneChessPieceState.validMoveSquareIds = [...this.validMoveSquareIds];
        return cloneChessPieceState;
    }
}

export class ChessGameState {

    // initialize the board with empty squares
    private board: (ChessPieceState | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null));

    // initialize the inactive pieces
    private capturedPieceIds: PieceId[] = [];
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

    initialize(squareIdPieceIdPairs: { squareId: SquareId, pieceId: PieceId }[]) {
        for (const { squareId, pieceId } of squareIdPieceIdPairs) {
            this.setPieceAt(squareId, new ChessPieceState(pieceId));
        }
        this.updateKingPositions();
    }

    getCapturedPieceIds(): PieceId[] {
        return this.capturedPieceIds;
    }

    getPieceAt(squareId: SquareId): ChessPieceState | null {
        const squareInfo = toSquareInfo(squareId);
        return this.board[squareInfo.rankIndex]?.[squareInfo.fileIndex] ?? null;
    }

    setPieceAt(squareId: SquareId, pieceInfo: ChessPieceState | null): void {
        const squareInfo = toSquareInfo(squareId);
        this.board[squareInfo.rankIndex][squareInfo.fileIndex] = pieceInfo;
        this.updateKingPositions();
    }

    capturePieceAt(squareId: SquareId): void {
        const squareInfo = toSquareInfo(squareId);
        const pieceInfo = this.getPieceAt(squareId);
        if (pieceInfo) {
            this.capturedPieceIds.push(pieceInfo.id);
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
        cloneChessGameState.capturedPieceIds = [...this.capturedPieceIds];
        cloneChessGameState.movedPieceIds = [...this.movedPieceIds];
        cloneChessGameState.lastMove = { fromSquareId: this.lastMove.fromSquareId, toSquareId: this.lastMove.toSquareId };
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
function handleEnPassant(newChessGameState: ChessGameState, move: {
    fromSquareId: SquareId,
    toSquareId: SquareId,
    promotionPieceName: PieceName | null
}, pieceToMove: ChessPieceState): boolean {

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

    const lastMove = newChessGameState.lastMove;
    if (!lastMove.fromSquareId || !lastMove.toSquareId) return false;

    const lastMovePiece = newChessGameState.getPieceAt(lastMove.toSquareId);
    if (lastMovePiece?.pieceName !== 'p') return false;

    const lastMoveToSquareInfo = toSquareInfo(lastMove.toSquareId);
    const lastMoveFromSquareInfo = toSquareInfo(lastMove.fromSquareId);
    const moveToSquareInfo = toSquareInfo(move.toSquareId);
    const moveFromSquareInfo = toSquareInfo(move.fromSquareId);

    if (Math.abs(lastMoveToSquareInfo.rankIndex - lastMoveFromSquareInfo.rankIndex) !== 2) return false;
    if (Math.abs(moveToSquareInfo.fileIndex - moveFromSquareInfo.fileIndex) !== 1) return false;

    const lastMoveMinRankIndex = Math.min(lastMoveToSquareInfo.rankIndex, lastMoveFromSquareInfo.rankIndex);
    const lastMoveMaxRankIndex = Math.max(lastMoveToSquareInfo.rankIndex, lastMoveFromSquareInfo.rankIndex);
    if (moveToSquareInfo.rankIndex <= lastMoveMinRankIndex || moveToSquareInfo.rankIndex >= lastMoveMaxRankIndex) return false;
    if (moveToSquareInfo.fileIndex !== lastMoveToSquareInfo.fileIndex) return false;

    if ((pieceToMove.colorName === 'w' && moveFromSquareInfo.rankName === '5') ||
        (pieceToMove.colorName === 'b' && moveFromSquareInfo.rankName === '4')) {
        newChessGameState.capturePieceAt(lastMove.toSquareId);
        return true;
    }

    return false;
}

export function nextChessGameState(
    chessGameState: ChessGameState,
    move: {
        fromSquareId: SquareId,
        toSquareId: SquareId,
        promotionPieceName: PieceName | null
    }): ChessGameState {

    // console.log(`next chess game state for move ${move.fromSquareId} to ${move.toSquareId}`);
    // console.log(chessGameState);

    // create the new chess game state
    const newChessGameState = chessGameState.clone();

    // Validate the move
    const pieceToMove = newChessGameState.getPieceAt(move.fromSquareId);
    if (!pieceToMove || !pieceToMove.validMoveSquareIds.includes(move.toSquareId)) {
        console.log(`Invalid move: ${move.fromSquareId} to ${move.toSquareId}`);
        console.log(pieceToMove);
        console.log(pieceToMove?.validMoveSquareIds);
        throw new Error("Invalid move");
    }

    // Handle en passant capture
    handleEnPassant(newChessGameState, move, pieceToMove);

    // Handle capture
    if (newChessGameState.getPieceAt(move.toSquareId)) {
        newChessGameState.capturePieceAt(move.toSquareId);
    }

    // move the piece
    newChessGameState.movePiece(move.fromSquareId, move.toSquareId);

    // Handle castling
    const movingPiece = chessGameState.getPieceAt(move.fromSquareId);
    if (movingPiece) {
        if (movingPiece?.pieceName === 'k') {
            const movingPieceFromSquareInfo = toSquareInfo(move.fromSquareId);
            const movingPieceToSquareInfo = toSquareInfo(move.toSquareId);
            const isKingside = movingPieceToSquareInfo.fileIndex - movingPieceFromSquareInfo.fileIndex === 2;
            const rookMove = castlingRookMoves[movingPiece.colorName][isKingside ? chess.kingside : chess.queenside];
            newChessGameState.movePiece(rookMove.fromSquareId, rookMove.toSquareId);
        }
    }

    // Handle pawn promotion
    if (pieceToMove.pieceName === 'p') {
        const toRank = move.toSquareId[1];
        if (toRank === '8' || toRank === '1') {
            if (!move.promotionPieceName) {
                throw new Error("Pawn promotion piece not specified");
            }
            pieceToMove.pieceName = move.promotionPieceName;
            newChessGameState.setPieceAt(move.toSquareId, pieceToMove);
        }
    }

    // switch turns
    newChessGameState.whitesTurn = !newChessGameState.whitesTurn;

    // update the valid moves
    updateValidMoves(newChessGameState);

    // remove moves that put the king in check
    filterValidMoves(newChessGameState);

    // update the king check status
    updateChecksAndMatesStatuses(newChessGameState);

    return newChessGameState;
}

export function getDefaultChessGameState(): ChessGameState {
    const initialChessGameState = new ChessGameState();
    initialChessGameState.initialize([
        { squareId: chess.a1, pieceId: chess.whiteQueensideRook },
        { squareId: chess.b1, pieceId: chess.whiteQueensideKnight },
        { squareId: chess.c1, pieceId: chess.whiteQueensideBishop },
        { squareId: chess.d1, pieceId: chess.whiteQueen },
        { squareId: chess.e1, pieceId: chess.whiteKing },
        { squareId: chess.f1, pieceId: chess.whiteKingsideBishop },
        { squareId: chess.g1, pieceId: chess.whiteKingsideKnight },
        { squareId: chess.h1, pieceId: chess.whiteKingsideRook },
        { squareId: chess.a2, pieceId: chess.whitePawn1 },
        { squareId: chess.b2, pieceId: chess.whitePawn2 },
        { squareId: chess.c2, pieceId: chess.whitePawn3 },
        { squareId: chess.d2, pieceId: chess.whitePawn4 },
        { squareId: chess.e2, pieceId: chess.whitePawn5 },
        { squareId: chess.f2, pieceId: chess.whitePawn6 },
        { squareId: chess.g2, pieceId: chess.whitePawn7 },
        { squareId: chess.h2, pieceId: chess.whitePawn8 },
        { squareId: chess.a7, pieceId: chess.blackPawn1 },
        { squareId: chess.b7, pieceId: chess.blackPawn2 },
        { squareId: chess.c7, pieceId: chess.blackPawn3 },
        { squareId: chess.d7, pieceId: chess.blackPawn4 },
        { squareId: chess.e7, pieceId: chess.blackPawn5 },
        { squareId: chess.f7, pieceId: chess.blackPawn6 },
        { squareId: chess.g7, pieceId: chess.blackPawn7 },
        { squareId: chess.h7, pieceId: chess.blackPawn8 },
        { squareId: chess.a8, pieceId: chess.blackQueensideRook },
        { squareId: chess.b8, pieceId: chess.blackQueensideKnight },
        { squareId: chess.c8, pieceId: chess.blackQueensideBishop },
        { squareId: chess.d8, pieceId: chess.blackQueen },
        { squareId: chess.e8, pieceId: chess.blackKing },
        { squareId: chess.f8, pieceId: chess.blackKingsideBishop },
        { squareId: chess.g8, pieceId: chess.blackKingsideKnight },
        { squareId: chess.h8, pieceId: chess.blackKingsideRook },
    ]);


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
