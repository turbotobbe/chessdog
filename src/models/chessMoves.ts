import { ChessPieceState, asSquareId, asSquareInfo } from './chess';
import { ColorName, PieceId, SquareId, SquareInfo } from '@/types/chess';
import { ChessGameState } from '@/models/chess';
import * as chess from '@/types/chess';


export function getPossibleMovesForPiece(chessGameState: ChessGameState, squareId: SquareId, pieceInfo: ChessPieceState): SquareId[] {
    switch (pieceInfo.pieceName) {
        case 'p':
            return getPossibleMovesForPawn(chessGameState, squareId, pieceInfo.colorName);
        case 'r':
            return getPossibleMovesForRook(chessGameState, squareId, pieceInfo.colorName);
        case 'n':
            return getPossibleMovesForKnight(chessGameState, squareId, pieceInfo.colorName);
        case 'b':
            return getPossibleMovesForBishop(chessGameState, squareId, pieceInfo.colorName);
        case 'q':
            return getPossibleMovesForQueen(chessGameState, squareId, pieceInfo.colorName);
        case 'k':
            return getPossibleMovesForKing(chessGameState, squareId, pieceInfo.colorName);
        default:
            return [];
    }
}

function getPossibleMovesInDirection(
    chessGameState: ChessGameState,
    squareInfo: SquareInfo,
    colorName: ColorName,
    directions: { x: number, y: number }[],
    maxSteps: number = 7
): SquareId[] {
    const possibleMoves: SquareId[] = [];
    for (const direction of directions) {
        for (let i = 1; i < (maxSteps+1); i++) {

            const x = squareInfo.fileIndex + direction.x * i;
            const y = squareInfo.rankIndex + direction.y * i;
            if (x >= 8 || y >= 8 || x < 0 || y < 0) {
                break;
            } else {
                const newSquareId = asSquareId(x, y);
                const pieceOnSquare = chessGameState.getPieceAt(newSquareId);
                if (!pieceOnSquare) {
                    possibleMoves.push(newSquareId);
                } else if (pieceOnSquare.colorName !== colorName) {
                    possibleMoves.push(newSquareId);
                    break; // Stop after capturing an opponent's piece
                } else {
                    break; // Stop at own piece
                }
            }
        }
    }
    return possibleMoves;
}

export function getPossibleMovesForRook(chessGameState: ChessGameState, squareId: SquareId, colorName: ColorName): SquareId[] {
    const squareInfo = asSquareInfo(squareId);
    const directions = [
        { x: 1, y: 0 }, // right
        { x: -1, y: 0 }, // left
        { x: 0, y: 1 }, // up
        { x: 0, y: -1 } // down
    ];
    return getPossibleMovesInDirection(chessGameState, squareInfo, colorName, directions);
}


export function getPossibleMovesForPawn(chessGameState: ChessGameState, squareId: SquareId, colorName: ColorName): SquareId[] {
    const squareInfo = asSquareInfo(squareId);
    const direction = colorName === 'w' ? 1 : -1;
    const possibleMoves: SquareId[] = [];

    // Move forward one square
    const oneSquareForward = asSquareId(squareInfo.fileIndex, squareInfo.rankIndex + direction);
    if (oneSquareForward && !chessGameState.getPieceAt(oneSquareForward)) {
        possibleMoves.push(oneSquareForward);

        // Move forward two squares if it's the pawn's first move
        if ((colorName === 'w' && squareInfo.rankIndex === 1) || (colorName === 'b' && squareInfo.rankIndex === 6)) {
            const twoSquaresForward = asSquareId(squareInfo.fileIndex, squareInfo.rankIndex + 2 * direction);
            if (twoSquaresForward && !chessGameState.getPieceAt(twoSquaresForward)) {
                possibleMoves.push(twoSquaresForward);
            }
        }
    }

    // Capture diagonally
    const captureSquares = [
        asSquareId(squareInfo.fileIndex + 1, squareInfo.rankIndex + direction),
        asSquareId(squareInfo.fileIndex - 1, squareInfo.rankIndex + direction)
    ];

    for (const captureSquare of captureSquares) {
        if (captureSquare) {
            const pieceOnSquare = chessGameState.getPieceAt(captureSquare);
            if (pieceOnSquare && pieceOnSquare.colorName !== colorName) {
                possibleMoves.push(captureSquare);
            }
        }
    }

    // En passant
    if ((colorName === 'w' && squareInfo.rankName === '5') || (colorName === 'b' && squareInfo.rankName === '4')) {
        const leftSquare = asSquareId(squareInfo.fileIndex - 1, squareInfo.rankIndex);
        const rightSquare = asSquareId(squareInfo.fileIndex + 1, squareInfo.rankIndex);

        [leftSquare, rightSquare].forEach(adjacentSquare => {
            if (adjacentSquare) {
                const adjacentPiece = chessGameState.getPieceAt(adjacentSquare);
                if (!adjacentPiece) {
                    // nothing on the adjacent square
                    return;
                }
                if (adjacentPiece.pieceName !== 'p' || adjacentPiece.colorName === colorName) {
                    // not a pawn or not opposing color
                    return;
                }
                if (!chessGameState.lastMove.toSquareId || !chessGameState.lastMove.fromSquareId) {
                    // no last move
                    return;
                }
                
                const adjacentToSquareInfo = asSquareInfo(chessGameState.lastMove.toSquareId);
                const adjacentFromSquareInfo = asSquareInfo(chessGameState.lastMove.fromSquareId);

                if (chessGameState.lastMove.toSquareId !== adjacentSquare) {
                    // last move was not to the adjacent square
                    return;
                }
                if (Math.abs(adjacentToSquareInfo.rankIndex - adjacentFromSquareInfo.rankIndex) !== 2) {
                    // last move was not two squares
                    return;
                }

                const enPassantSquare = asSquareId(adjacentToSquareInfo.fileIndex, adjacentToSquareInfo.rankIndex + direction);
                if (enPassantSquare) {
                    possibleMoves.push(enPassantSquare);
                }
            }
        });
    }

    return possibleMoves;
}



export function getPossibleMovesForKnight(chessGameState: ChessGameState, squareId: SquareId, colorName: ColorName): SquareId[] {
    const squareInfo = asSquareInfo(squareId);
    const possibleMoves: SquareId[] = [];
    const knightMoves = [
        { x: 2, y: 1 }, { x: 2, y: -1 },
        { x: -2, y: 1 }, { x: -2, y: -1 },
        { x: 1, y: 2 }, { x: 1, y: -2 },
        { x: -1, y: 2 }, { x: -1, y: -2 }
    ];

    for (const move of knightMoves) {
        const x = squareInfo.fileIndex + move.x;
        const y = squareInfo.rankIndex + move.y;
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const newSquareId = asSquareId(x, y);
            const pieceOnSquare = chessGameState.getPieceAt(newSquareId);
            if (!pieceOnSquare || pieceOnSquare.colorName !== colorName) {
                possibleMoves.push(newSquareId);
            }
        }
    }

    return possibleMoves;
}

export function getPossibleMovesForBishop(chessGameState: ChessGameState, squareId: SquareId, colorName: ColorName): SquareId[] {
    const squareInfo = asSquareInfo(squareId);
    const directions = [
        { x: 1, y: 1 }, // up right
        { x: -1, y: -1 }, // down left
        { x: 1, y: -1 }, // down right
        { x: -1, y: 1 } // up left
    ];
    return getPossibleMovesInDirection(chessGameState, squareInfo, colorName, directions);
}

export function getPossibleMovesForQueen(chessGameState: ChessGameState, squareId: SquareId, colorName: ColorName): SquareId[] {
    const squareInfo = asSquareInfo(squareId);
    const directions = [
        { x: 1, y: 0 }, // right
        { x: -1, y: 0 }, // left
        { x: 0, y: 1 }, // up
        { x: 0, y: -1 }, // down
        { x: 1, y: 1 }, // up right
        { x: -1, y: -1 }, // down left
        { x: 1, y: -1 }, // down right
        { x: -1, y: 1 } // up left
    ];
    return getPossibleMovesInDirection(chessGameState, squareInfo, colorName, directions);
}

export function getPossibleMovesForKing(chessGameState: ChessGameState, squareId: SquareId, colorName: ColorName): SquareId[] {
    const squareInfo = asSquareInfo(squareId);
    const directions = [
        { x: 1, y: 0 }, // right
        { x: -1, y: 0 }, // left
        { x: 0, y: 1 }, // up
        { x: 0, y: -1 }, // down
        { x: 1, y: 1 }, // up right
        { x: -1, y: -1 }, // down left
        { x: 1, y: -1 }, // down right
        { x: -1, y: 1 } // up left
    ];
    const normalMoves = getPossibleMovesInDirection(chessGameState, squareInfo, colorName, directions, 1);

    // Add castling moves
    const castlingMoves: SquareId[] = [];
    if (canCastle(chessGameState, colorName, 'kingside')) {
        castlingMoves.push(colorName === 'w' ? 'g1' as SquareId : 'g8' as SquareId);
    }
    if (canCastle(chessGameState, colorName, 'queenside')) {
        castlingMoves.push(colorName === 'w' ? 'c1' as SquareId : 'c8' as SquareId);
    }

    return [...normalMoves, ...castlingMoves];
}

function canCastle(chessGameState: ChessGameState, colorName: ColorName, side: 'kingside' | 'queenside'): boolean {
    const kingId: PieceId = colorName === 'w' ? chess.whiteKing : chess.blackKing;
    const rookId: PieceId = colorName === 'w' 
        ? (side === 'kingside' ? chess.whiteKingsideRook : chess.whiteQueensideRook)
        : (side === 'kingside' ? chess.blackKingsideRook : chess.blackQueensideRook);

    // Check if king or rook has moved
    if (chessGameState.hasMoved(kingId) || chessGameState.hasMoved(rookId)) {
        return false;
    }

    // Check if squares between king and rook are empty
    const kingSquareId = colorName === 'w' ? chessGameState.whiteKingSquareId : chessGameState.blackKingSquareId;
    if (!kingSquareId) {
        throw new Error('King square not found');
    }
    const kingSquareInfo = asSquareInfo(kingSquareId);
    const {fileIndex, rankIndex} = kingSquareInfo;

    const middleSquares = side === 'kingside' 
        ? [asSquareId(fileIndex+1, rankIndex), asSquareId(fileIndex+2, rankIndex)] as SquareId[]
        : [asSquareId(fileIndex-1, rankIndex), asSquareId(fileIndex-2, rankIndex), asSquareId(fileIndex-3, rankIndex)] as SquareId[];

    for (const square of middleSquares) {
        if (chessGameState.getPieceAt(square) !== null) {
            return false;
        }
    }

    // Check if king is in check or passes through check
    const passThrough = side === 'kingside' ? asSquareId(fileIndex+1, rankIndex) : asSquareId(fileIndex-1, rankIndex);
    if (isSquareUnderAttack(chessGameState, kingSquareId, colorName) ||
        isSquareUnderAttack(chessGameState, passThrough, colorName)) {
        return false;
    }

    return true;
}

function isSquareUnderAttack(chessGameState: ChessGameState, squareId: SquareId, defendingColor: ColorName): boolean {
    const attackingColor = defendingColor === 'w' ? 'b' : 'w';
    for (const attackerSquareId of chess.squareIds) {
        const attacker = chessGameState.getPieceAt(attackerSquareId);
        if (attacker && attacker.colorName === attackingColor) {
            if(attacker.validMoveSquareIds.includes(squareId)){
                return true;
            }
        }
    }
    return false;
}
