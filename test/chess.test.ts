import { expect, test } from 'vitest'
import { ChessPieceState, ChessGameState, getDefaultChessGameState, nextChessGameState, updateValidMoves, filterValidMoves, updateChecksAndMatesStatuses } from '../src/models/chess'
import { parsePgn, parseMove } from '../src/utils/pgn'
import * as chess from '../src/types/chess'
import { getPossibleMovesForQueen } from '../src/models/chessMoves'
function handlePgn(chessGameState: ChessGameState, pgnText: string): ChessGameState {

    const pgn = parsePgn(pgnText);
    for (const turn of pgn.turns) {
        const move = turn.white.move;
        const { sourceSquareId, targetSquareId, promotionPieceName } = parseMove(chessGameState, move);
        chessGameState = nextChessGameState(chessGameState, {
            sourceSquareId: sourceSquareId,
            targetSquareId: targetSquareId,
            promotionPieceName: promotionPieceName?.toLowerCase()
        });
        if (turn.black.move.length > 0) {
            const move = turn.black.move;
            const { sourceSquareId, targetSquareId, promotionPieceName } = parseMove(chessGameState, move);
            chessGameState = nextChessGameState(chessGameState, {
                sourceSquareId: sourceSquareId,
                targetSquareId: targetSquareId,
                promotionPieceName: promotionPieceName?.toLowerCase()
            });
        }
    }
    return chessGameState;
}

test('default chess setup', () => {
    const chessGameState = getDefaultChessGameState();

    expect(chessGameState.whitesTurn).toBe(true);

    expect(chessGameState.whiteKingInCheck).toBe(false);
    expect(chessGameState.blackKingInCheck).toBe(false);
    expect(chessGameState.whiteKingSquareId).toBe(chess.e1);
    expect(chessGameState.blackKingSquareId).toBe(chess.e8);

    // white pieces
    expect(chessGameState.getPieceAt(chess.a1)?.id).toBe(chess.whiteQueensideRook);
    expect(chessGameState.getPieceAt(chess.b1)?.id).toBe(chess.whiteQueensideKnight);
    expect(chessGameState.getPieceAt(chess.c1)?.id).toBe(chess.whiteQueensideBishop);
    expect(chessGameState.getPieceAt(chess.d1)?.id).toBe(chess.whiteQueen);
    expect(chessGameState.getPieceAt(chess.e1)?.id).toBe(chess.whiteKing);
    expect(chessGameState.getPieceAt(chess.f1)?.id).toBe(chess.whiteKingsideBishop);
    expect(chessGameState.getPieceAt(chess.g1)?.id).toBe(chess.whiteKingsideKnight);
    expect(chessGameState.getPieceAt(chess.h1)?.id).toBe(chess.whiteKingsideRook);

    // white pawns
    expect(chessGameState.getPieceAt(chess.a2)?.id).toBe(chess.whitePawn1);
    expect(chessGameState.getPieceAt(chess.b2)?.id).toBe(chess.whitePawn2);
    expect(chessGameState.getPieceAt(chess.c2)?.id).toBe(chess.whitePawn3);
    expect(chessGameState.getPieceAt(chess.d2)?.id).toBe(chess.whitePawn4);
    expect(chessGameState.getPieceAt(chess.e2)?.id).toBe(chess.whitePawn5);
    expect(chessGameState.getPieceAt(chess.f2)?.id).toBe(chess.whitePawn6);
    expect(chessGameState.getPieceAt(chess.g2)?.id).toBe(chess.whitePawn7);
    expect(chessGameState.getPieceAt(chess.h2)?.id).toBe(chess.whitePawn8);

    // black pawns
    expect(chessGameState.getPieceAt(chess.a7)?.id).toBe(chess.blackPawn1);
    expect(chessGameState.getPieceAt(chess.b7)?.id).toBe(chess.blackPawn2);
    expect(chessGameState.getPieceAt(chess.c7)?.id).toBe(chess.blackPawn3);
    expect(chessGameState.getPieceAt(chess.d7)?.id).toBe(chess.blackPawn4);
    expect(chessGameState.getPieceAt(chess.e7)?.id).toBe(chess.blackPawn5);
    expect(chessGameState.getPieceAt(chess.f7)?.id).toBe(chess.blackPawn6);
    expect(chessGameState.getPieceAt(chess.g7)?.id).toBe(chess.blackPawn7);
    expect(chessGameState.getPieceAt(chess.h7)?.id).toBe(chess.blackPawn8);

    // black pieces
    expect(chessGameState.getPieceAt(chess.a8)?.id).toBe(chess.blackQueensideRook);
    expect(chessGameState.getPieceAt(chess.b8)?.id).toBe(chess.blackQueensideKnight);
    expect(chessGameState.getPieceAt(chess.c8)?.id).toBe(chess.blackQueensideBishop);
    expect(chessGameState.getPieceAt(chess.d8)?.id).toBe(chess.blackQueen);
    expect(chessGameState.getPieceAt(chess.e8)?.id).toBe(chess.blackKing);
    expect(chessGameState.getPieceAt(chess.f8)?.id).toBe(chess.blackKingsideBishop);
    expect(chessGameState.getPieceAt(chess.g8)?.id).toBe(chess.blackKingsideKnight);
    expect(chessGameState.getPieceAt(chess.h8)?.id).toBe(chess.blackKingsideRook);

    const wp1 = chessGameState.getPieceAt(chess.a2);
    expect(wp1?.id).toBe(chess.whitePawn1);
    expect(wp1?.validMoveSquareIds).toEqual([chess.a3, chess.a4]);

    const wk1 = chessGameState.getPieceAt(chess.e1);
    expect(wk1?.id).toBe(chess.whiteKing);
    expect(wk1?.validMoveSquareIds).toEqual([]);

    const wn1 = chessGameState.getPieceAt(chess.b1);
    expect(wn1?.id).toBe(chess.whiteQueensideKnight);
    expect(wn1?.validMoveSquareIds).toEqual([chess.c3, chess.a3]);

    const bp1 = chessGameState.getPieceAt(chess.c7);
    expect(bp1?.pieceName).toBe('p');
    expect(bp1?.validMoveSquareIds).toEqual([chess.c6, chess.c5]);

    const bk1 = chessGameState.getPieceAt(chess.e8);
    expect(bk1?.id).toBe(chess.blackKing);
    expect(bk1?.validMoveSquareIds).toEqual([]);

    const bn1 = chessGameState.getPieceAt(chess.g8);
    expect(bn1?.id).toBe(chess.blackKingsideKnight);
    expect(bn1?.validMoveSquareIds).toEqual([chess.h6, chess.f6]);

});


test('test 1. e4 1... e5 2. f4', () => {
    let chessGameState = getDefaultChessGameState();

    expect(chessGameState.whitesTurn).toBe(true);
    chessGameState = nextChessGameState(chessGameState, { sourceSquareId: chess.e2, targetSquareId: chess.e4, promotionPieceName: null });
    expect(chessGameState.whitesTurn).toBe(false);
    chessGameState = nextChessGameState(chessGameState, { sourceSquareId: chess.e7, targetSquareId: chess.e5, promotionPieceName: null });
    expect(chessGameState.whitesTurn).toBe(true);
    chessGameState = nextChessGameState(chessGameState, { sourceSquareId: chess.f2, targetSquareId: chess.f4, promotionPieceName: null });
    expect(chessGameState.whitesTurn).toBe(false);

    expect(chessGameState.whiteKingInCheck).toBe(false);
    expect(chessGameState.blackKingInCheck).toBe(false);
    expect(chessGameState.whiteKingSquareId).toBe(chess.e1);
    expect(chessGameState.blackKingSquareId).toBe(chess.e8);

    // white pawns
    expect(chessGameState.getPieceAt(chess.e2)?.id).toBe(undefined);
    expect(chessGameState.getPieceAt(chess.e4)?.id).toBe(chess.whitePawn5);

    // black pawns
    expect(chessGameState.getPieceAt(chess.e7)?.id).toBe(undefined);
    expect(chessGameState.getPieceAt(chess.e5)?.id).toBe(chess.blackPawn5);

    const wp5 = chessGameState.getPieceAt(chess.e4);
    expect(wp5?.pieceName).toBe('p');
    expect(wp5?.validMoveSquareIds).toEqual([]);

    const wp6 = chessGameState.getPieceAt(chess.f4);
    expect(wp6?.pieceName).toBe('p');
    expect(wp6?.validMoveSquareIds).toEqual([chess.f5, chess.e5]);

    const wk1 = chessGameState.getPieceAt(chess.e1);
    expect(wk1?.id).toBe(chess.whiteKing);
    expect(wk1?.validMoveSquareIds).toEqual([chess.e2, chess.f2]);

});

test('test check', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. e4 1... e5 2. f4 2... Qh4+"
    chessGameState = handlePgn(chessGameState, pgnText);

    expect(chessGameState.whiteKingInCheck).toBe(true);
    expect(chessGameState.blackKingInCheck).toBe(false);
    expect(chessGameState.whiteKingSquareId).toBe(chess.e1);
    expect(chessGameState.blackKingSquareId).toBe(chess.e8);

    // white pawns
    expect(chessGameState.getPieceAt(chess.e2)?.id).toBe(undefined);
    expect(chessGameState.getPieceAt(chess.e4)?.id).toBe(chess.whitePawn5);
    expect(chessGameState.getPieceAt(chess.f2)?.id).toBe(undefined);
    expect(chessGameState.getPieceAt(chess.f4)?.id).toBe(chess.whitePawn6);

    // black pawns
    expect(chessGameState.getPieceAt(chess.e7)?.id).toBe(undefined);
    expect(chessGameState.getPieceAt(chess.e5)?.id).toBe(chess.blackPawn5);

    // black queen
    expect(chessGameState.getPieceAt(chess.d8)?.id).toBe(undefined);
    expect(chessGameState.getPieceAt(chess.h4)?.id).toBe(chess.blackQueen);

    // check white king valid moves
    const wk1 = chessGameState.getPieceAt(chess.e1);
    console.log(wk1?.validMoveSquareIds);
    expect(wk1?.id).toBe(chess.whiteKing);
    expect(wk1?.validMoveSquareIds).toEqual([chess.e2]);

    // check white pawn g2 valid moves
    const wp7 = chessGameState.getPieceAt(chess.g2);
    expect(wp7?.pieceName).toBe('p');
    expect(wp7?.validMoveSquareIds).toEqual([chess.g3]);

    // check white pawn h2 valid moves
    const wp8 = chessGameState.getPieceAt(chess.h2);
    expect(wp8?.pieceName).toBe('p');
    expect(wp8?.validMoveSquareIds).toEqual([]);

});

test('test 1. e4 1... e5 2. Bc4 2... a6 3. Qf3 3... a5 4. Qxf7#', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. e4 1... e5 2. Bc4 2... a6 3. Qf3 3... a5 4. Qxf7#"
    chessGameState = handlePgn(chessGameState, pgnText);
    // kings position and check status
    expect(chessGameState.whiteKingInCheck).toBe(false);
    expect(chessGameState.blackKingInCheck).toBe(true);
    expect(chessGameState.whiteKingSquareId).toBe(chess.e1);
    expect(chessGameState.blackKingSquareId).toBe(chess.e8);

    expect(chessGameState.whiteKingInCheckMate).toBe(false);
    expect(chessGameState.blackKingInCheckMate).toBe(true);
})

test('simple capture 1. e4 1... d5 2. xd5', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. e4 1... d5 2. xd5"
    chessGameState = handlePgn(chessGameState, pgnText);

    expect(chessGameState.getPieceAt(chess.d5)?.id).toBe(chess.whitePawn5);
    expect(chessGameState.getPieceAt(chess.e4)).toBe(null);
    // expect(chessGameState.getCapturedPieceIds().length).toBe(1);
    expect(chessGameState.capturedBlackPieceIds).toEqual([chess.blackPawn4]);
    expect(chessGameState.capturedWhitePieceIds).toEqual([]);
})

test('Stalemate scenario', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. e3 1... a5 2. Qh5 2... Ra6 3. Qxa5 3... h5 4. h4 4... Rah6 5. Qxc7 5... f6 6. Qxd7+ 6... Kf7 7. Qxb7 7... Qd3 8. Qxb8 8... Qh7 9. Qxc8 9... Kg6 10. Qe6"
    chessGameState = handlePgn(chessGameState, pgnText);

    // Check stalemate conditions
    expect(chessGameState.blackKingInCheck).toBe(false);
    expect(chessGameState.blackKingInCheckMate).toBe(false);
    expect(chessGameState.isStalemate).toBe(true);

    // Verify that black king has no valid moves

    const blackKing = chessGameState.getPieceAt(chessGameState.blackKingSquareId);
    expect(blackKing?.validMoveSquareIds).toEqual([]);
});

test('king side castling 1. e4 1... e5 2. Bc4 2... Bc5 3. Nf3 3... Nf6 4. O-O 4... O-O', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. e4 1... e5 2. Bc4 2... Bc5 3. Nf3 3... Nf6 4. O-O 4... O-O"
    chessGameState = handlePgn(chessGameState, pgnText);

    // check king
    // check king and rook
    expect(chessGameState.whiteKingSquareId).toBe(chess.g1);
    expect(chessGameState.getPieceAt(chess.f1)?.id).toBe(chess.whiteKingsideRook);

    expect(chessGameState.blackKingSquareId).toBe(chess.g8);
    expect(chessGameState.getPieceAt(chess.f8)?.id).toBe(chess.blackKingsideRook);

})

test('queen side castling 1. d4 1... d5 2. Bf4 2... Bf5 3. Nc3 3... Nc6 4. Qd2 4... Qd7 5. O-O-O 5... O-O-O', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. d4 1... d5 2. Bf4 2... Bf5 3. Nc3 3... Nc6 4. Qd2 4... Qd7 5. O-O-O 5... O-O-O"
    chessGameState = handlePgn(chessGameState, pgnText);

    // check king
    // check king and rook
    expect(chessGameState.whiteKingSquareId).toBe(chess.c1);
    expect(chessGameState.getPieceAt(chess.d1)?.id).toBe(chess.whiteQueensideRook);

    expect(chessGameState.blackKingSquareId).toBe(chess.c8);
    expect(chessGameState.getPieceAt(chess.d8)?.id).toBe(chess.blackQueensideRook);

})

test('en passant', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. e4 1... d5 2. exd5 2... e5 3. e6"
    chessGameState = handlePgn(chessGameState, pgnText);

    expect(chessGameState.getPieceAt(chess.e6)?.id).toBe(chess.whitePawn5);
    expect(chessGameState.capturedBlackPieceIds).toEqual([chess.blackPawn4, chess.blackPawn5]);
    expect(chessGameState.capturedWhitePieceIds).toEqual([]);
    expect(chessGameState.getPieceAt(chess.e5)).toBe(null);
})

test('promotion', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. e4 1... d5 2. exd5 2... c6 3. dxc6 3... Nf6 4. cxb7 4... Bd7 5. bxa8=Q"
    chessGameState = handlePgn(chessGameState, pgnText);

    const captures = [
         chess.blackPawn2, 
         chess.blackPawn3, 
         chess.blackPawn4, 
         chess.blackQueensideRook
        ]
    expect(chessGameState.capturedBlackPieceIds.sort()).toEqual(captures.sort());
    expect(chessGameState.capturedWhitePieceIds).toEqual([]);

    expect(chessGameState.getPieceAt(chess.a7)?.pieceName).toBe('p'); // Black pawn on a7

    const expectedMoves = [
        chess.a7,  // Move down and capture pawn
        chess.b8,  // Move right and capture knight
        chess.b7,  // Diabonal move
        chess.c6,  // Diagonal move
        chess.d5,  // Diagonal move
        chess.e4,  // Diagonal move
        chess.f3,  // Diagonal move
    ];

    expect(chessGameState.getPieceAt(chess.a8)?.validMoveSquareIds.sort()).toEqual(expectedMoves.sort());

    // Additional checks to ensure the board state is correct
    expect(chessGameState.getPieceAt(chess.a7)?.pieceName).toBe('p'); // Black pawn on a7
    expect(chessGameState.getPieceAt(chess.d7)?.pieceName).toBe('b'); // Black bishop on d7
    expect(chessGameState.getPieceAt(chess.f6)?.pieceName).toBe('n'); // Black knight on f6
    expect(chessGameState.getPieceAt(chess.e8)?.pieceName).toBe('k'); // Black king on e8
    expect(chessGameState.getPieceAt(chess.d8)?.pieceName).toBe('q'); // Black queen on d8
    expect(chessGameState.getPieceAt(chess.g2)?.pieceName).toBe('p'); // White pawn on g2
    expect(chessGameState.whitesTurn).toBe(false); // It should be Black's turn after White's promotion
    
})

test('promotion with check', () => {
    let chessGameState = getDefaultChessGameState();
    const pgnText = "1. e4 1... d5 2. exd5 2... c5 3. d6 3... Qa5 4. d7+ 4... Kd8 5. c3 5... Kc7 6. d8=Q+"
    chessGameState = handlePgn(chessGameState, pgnText);

    expect(chessGameState.getPieceAt(chess.d8)?.pieceName).toBe('q'); // white queen on d8
    expect(chessGameState.getPieceAt(chess.c7)?.pieceName).toBe('k'); // black king on c7
    expect(chessGameState.whiteKingInCheck).toBe(false);
    expect(chessGameState.blackKingInCheck).toBe(true);
    expect(chessGameState.getPieceAt(chess.c7)?.validMoveSquareIds.sort()).toEqual([chess.c6, chess.d8].sort());
})

test('Queen moves', () => {
    const chessGameState = new ChessGameState();
    // Place a white queen on e4
    chessGameState.setPieceAt('e4', new ChessPieceState('wq'));
    
    const queenMoves = getPossibleMovesForQueen(chessGameState, 'e4', 'w');
    
    const expectedMoves = [
        'e5', 'e6', 'e7', 'e8', // up
        'e3', 'e2', 'e1',       // down
        'f4', 'g4', 'h4',       // right
        'd4', 'c4', 'b4', 'a4', // left
        'f5', 'g6', 'h7',       // up-right
        'd3', 'c2', 'b1',       // down-left
        'f3', 'g2', 'h1',       // down-right
        'd5', 'c6', 'b7', 'a8'  // up-left
    ];
    
    expect(queenMoves.sort()).toEqual(expectedMoves.sort());
});