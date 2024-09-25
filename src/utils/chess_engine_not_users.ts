// Chess piece types
enum PieceType {
    PAWN = 'P',
    KNIGHT = 'N',
    BISHOP = 'B',
    ROOK = 'R',
    QUEEN = 'Q',
    KING = 'K'
}

// Chess colors
enum Color {
    WHITE = 'w',
    BLACK = 'b'
}

// Chess piece
interface Piece {
    type: PieceType;
    color: Color;
}

// Chess board position
type Position = [number, number];

// Chess move
interface Move {
    from: Position;
    to: Position;
    promotion?: PieceType;
}

class ChessGame {
    private board: (Piece | null)[][];
    private currentTurn: Color;
    private castlingRights: {
        [Color.WHITE]: { kingSide: boolean; queenSide: boolean };
        [Color.BLACK]: { kingSide: boolean; queenSide: boolean };
    };
    private enPassantTarget: Position | null;
    private halfMoveClock: number;
    private fullMoveNumber: number;

    constructor() {
        this.board = this.initializeBoard();
        this.currentTurn = Color.WHITE;
        this.castlingRights = {
            [Color.WHITE]: { kingSide: true, queenSide: true },
            [Color.BLACK]: { kingSide: true, queenSide: true }
        };
        this.enPassantTarget = null;
        this.halfMoveClock = 0;
        this.fullMoveNumber = 1;
    }

    private initializeBoard(): (Piece | null)[][] {
        const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

        // Set up pawns
        for (let i = 0; i < 8; i++) {
            board[1][i] = { type: PieceType.PAWN, color: Color.WHITE };
            board[6][i] = { type: PieceType.PAWN, color: Color.BLACK };
        }

        // Set up other pieces
        const setupRow = (row: number, color: Color) => {
            board[row][0] = { type: PieceType.ROOK, color };
            board[row][1] = { type: PieceType.KNIGHT, color };
            board[row][2] = { type: PieceType.BISHOP, color };
            board[row][3] = { type: PieceType.QUEEN, color };
            board[row][4] = { type: PieceType.KING, color };
            board[row][5] = { type: PieceType.BISHOP, color };
            board[row][6] = { type: PieceType.KNIGHT, color };
            board[row][7] = { type: PieceType.ROOK, color };
        };

        setupRow(0, Color.WHITE);
        setupRow(7, Color.BLACK);

        return board;
    }

    public makeMove(move: Move): boolean {
        const { from, to } = move;
        const piece = this.board[from[0]][from[1]];

        if (!piece || piece.color !== this.currentTurn) {
            return false;
        }

        if (!this.isValidMove(move)) {
            return false;
        }

        // Handle en passant capture
        if (piece.type === PieceType.PAWN && to[1] !== from[1] && !this.board[to[0]][to[1]]) {
            this.board[from[0]][to[1]] = null; // Remove the captured pawn
        }

        // Move the piece
        this.board[to[0]][to[1]] = piece;
        this.board[from[0]][from[1]] = null;

        // Handle pawn promotion
        if (move.promotion && piece.type === PieceType.PAWN && (to[0] === 0 || to[0] === 7)) {
            this.board[to[0]][to[1]] = { type: move.promotion, color: piece.color };
        }

        // Handle castling
        if (piece.type === PieceType.KING && Math.abs(to[1] - from[1]) === 2) {
            const rookFrom = [from[0], to[1] > from[1] ? 7 : 0] as Position;
            const rookTo = [from[0], to[1] > from[1] ? 5 : 3] as Position;
            this.board[rookTo[0]][rookTo[1]] = this.board[rookFrom[0]][rookFrom[1]];
            this.board[rookFrom[0]][rookFrom[1]] = null;
        }

        // Update castling rights
        this.updateCastlingRights(piece, from);

        // Set en passant target
        this.enPassantTarget = (piece.type === PieceType.PAWN && Math.abs(to[0] - from[0]) === 2)
            ? [Math.floor((from[0] + to[0]) / 2), from[1]]
            : null;

        // Update move counters
        if (piece.type === PieceType.PAWN || this.board[to[0]][to[1]]) {
            this.halfMoveClock = 0;
        } else {
            this.halfMoveClock++;
        }

        if (this.currentTurn === Color.BLACK) {
            this.fullMoveNumber++;
        }

        // Switch turns
        this.currentTurn = this.currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE;

        return true;
    }

    private isValidMove(move: Move): boolean {
        const { from, to } = move;
        const piece = this.board[from[0]][from[1]];

        if (!piece) {
            return false;
        }

        const dx = Math.abs(to[1] - from[1]);
        const dy = to[0] - from[0];

        switch (piece.type) {
            case PieceType.PAWN:
                return this.isValidPawnMove(piece.color, from, to, dx, dy);
            case PieceType.KNIGHT:
                return (dx === 1 && Math.abs(dy) === 2) || (dx === 2 && Math.abs(dy) === 1);
            case PieceType.BISHOP:
                return dx === Math.abs(dy) && this.isClearPath(from, to);
            case PieceType.ROOK:
                return (dx === 0 || Math.abs(dy) === 0) && this.isClearPath(from, to);
            case PieceType.QUEEN:
                return (dx === 0 || Math.abs(dy) === 0 || dx === Math.abs(dy)) && this.isClearPath(from, to);
            case PieceType.KING:
                return this.isValidKingMove(piece.color, from, to, dx, dy);
            default:
                return false;
        }
    }

    private isValidPawnMove(color: Color, from: Position, to: Position, dx: number, dy: number): boolean {
        const direction = color === Color.WHITE ? 1 : -1;
        const startRow = color === Color.WHITE ? 1 : 6;

        // Regular move
        if (dx === 0 && dy === direction && !this.board[to[0]][to[1]]) {
            return true;
        }

        // Double move from start
        if (dx === 0 && dy === 2 * direction && from[0] === startRow && !this.board[to[0]][to[1]] && !this.board[from[0] + direction][from[1]]) {
            return true;
        }

        // Capture
        if (dx === 1 && dy === direction && this.board[to[0]][to[1]] && this.board[to[0]][to[1]]!.color !== color) {
            return true;
        }

        // En passant
        if (dx === 1 && dy === direction && this.enPassantTarget && to[0] === this.enPassantTarget[0] && to[1] === this.enPassantTarget[1]) {
            return true;
        }

        return false;
    }

    private isValidKingMove(color: Color, from: Position, to: Position, dx: number, dy: number): boolean {
        // Regular move
        if (dx <= 1 && Math.abs(dy) <= 1) {
            return true;
        }

        // Castling
        if (dy === 0 && dx === 2) {
            const row = color === Color.WHITE ? 0 : 7;
            const kingSide = to[1] === 6;

            if (!this.castlingRights[color][kingSide ? 'kingSide' : 'queenSide']) {
                return false;
            }

            const rookCol = kingSide ? 7 : 0;
            if (!this.board[row][rookCol] || this.board[row][rookCol]!.type !== PieceType.ROOK) {
                return false;
            }

            const start = Math.min(from[1], rookCol);
            const end = Math.max(from[1], rookCol);
            for (let col = start + 1; col < end; col++) {
                if (this.board[row][col]) {
                    return false;
                }
            }

            // Check if the king is not in check and doesn't pass through check
            for (let col = from[1]; col <= to[1]; col++) {
                if (this.isSquareUnderAttack([row, col], color)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    private isClearPath(from: Position, to: Position): boolean {
        const dx = to[1] - from[1];
        const dy = to[0] - from[0];
        const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
        const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

        let x = from[1] + stepX;
        let y = from[0] + stepY;

        while (x !== to[1] || y !== to[0]) {
            if (this.board[y][x]) {
                return false;
            }
            x += stepX;
            y += stepY;
        }

        return true;
    }

    private updateCastlingRights(piece: Piece, from: Position): void {
        if (piece.type === PieceType.KING) {
            this.castlingRights[piece.color].kingSide = false;
            this.castlingRights[piece.color].queenSide = false;
        } else if (piece.type === PieceType.ROOK) {
            if (from[1] === 0) {
                this.castlingRights[piece.color].queenSide = false;
            } else if (from[1] === 7) {
                this.castlingRights[piece.color].kingSide = false;
            }
        }
    }

    private isSquareUnderAttack(square: Position, defendingColor: Color): boolean {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color !== defendingColor) {
                    if (this.isValidMove({ from: [row, col], to: square })) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public getCurrentBoard(): (Piece | null)[][] {
        return this.board.map(row => [...row]);
    }

    public getCurrentTurn(): Color {
        return this.currentTurn;
    }

    public isGameOver(): boolean {
        // Check for checkmate or stalemate
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentTurn) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove({ from: [row, col], to: [toRow, toCol] })) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    public isCheck(): boolean {
        const kingPosition = this.findKing(this.currentTurn);
        return kingPosition ? this.isSquareUnderAttack(kingPosition, this.currentTurn) : false;
    }

    private findKing(color: Color): Position | null {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === PieceType.KING && piece.color === color) {
                    return [row, col];
                }
            }
        }
        return null;
    }
}

export { ChessGame, Color, PieceType, Move, Position };

