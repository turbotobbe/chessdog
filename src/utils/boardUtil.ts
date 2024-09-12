// create a function that takes a set of chess pieces and returns a random setup
// the pieces are strings of the form 'wr' 'bn' 'bp' 'bq' 'bk' 'bb' 'br' 'bk' 'bn' 'bp' 'bq' 'bk' 'bb' 'br'
// the pieces are placed on a 8x8 board
// the pieces are placed in random positions
// the position must be a valid position
// the function must return the board setup

import { BoardState, files, PieceId, toPieceInfo, ranks, SquareId, squareIds, toSquareInfo } from "../models/BoardState";


export function getDefaultBoard(): BoardState {
    const board = new BoardState();

    board.setPiece('wr1', 'a1');
    board.setPiece('wn1', 'b1');
    board.setPiece('wb1', 'c1');
    board.setPiece('wq', 'd1');
    board.setPiece('wk', 'e1');
    board.setPiece('wb2', 'f1');
    board.setPiece('wn2', 'g1');
    board.setPiece('wr2', 'h1');

    board.setPiece('wp1', 'a2');
    board.setPiece('wp2', 'b2');
    board.setPiece('wp3', 'c2');
    board.setPiece('wp4', 'd2');
    board.setPiece('wp5', 'e2');
    board.setPiece('wp6', 'f2');
    board.setPiece('wp7', 'g2');
    board.setPiece('wp8', 'h2');

    board.setPiece('br1', 'a8');
    board.setPiece('bn1', 'b8');
    board.setPiece('bb1', 'c8');
    board.setPiece('bq', 'd8');
    board.setPiece('bk', 'e8');
    board.setPiece('bb2', 'f8');
    board.setPiece('bn2', 'g8');
    board.setPiece('br2', 'h8');

    board.setPiece('bp1', 'a7');
    board.setPiece('bp2', 'b7');
    board.setPiece('bp3', 'c7');
    board.setPiece('bp4', 'd7');
    board.setPiece('bp5', 'e7');
    board.setPiece('bp6', 'f7');
    board.setPiece('bp7', 'g7');
    board.setPiece('bp8', 'h7');

    return board;
}

export function getRandomBoard(pieceIds: PieceId[]): BoardState {

    let initialSolution: Solution = {
        board: new BoardState(),
        pieceIds: [...pieceIds],
        squareIds: [...squareIds]
    };

    // shuffle the board squares
    initialSolution.squareIds.sort(() => Math.random() - 0.5);

    const solvedSolution = putPieces(initialSolution);

    if (solvedSolution === undefined) {
        return initialSolution.board;
    }

    return solvedSolution.board;
}


// object to store a solution
interface Solution {
    board: BoardState;
    pieceIds: PieceId[];
    squareIds: SquareId[];
}

function cloneSolution(solution: Solution): Solution {
    return {
        board: solution.board.clone(), // Assuming we add a clone method to BoardState
        pieceIds: [...solution.pieceIds],
        squareIds: [...solution.squareIds]
    };
}

function isValidPosition(board: BoardState, pieceId: PieceId, squareId: SquareId): boolean {

    const square = toSquareInfo(squareId);
    const piece = toPieceInfo(pieceId);

    // check if the piece is already on the board
    if (board.getPiece(pieceId)?.squareId !== null) {
        return false;
    }

    // check if white pawns are on the first rank    
    if (piece.color === 'w' && piece.piece === 'p' && square.rank === '1') {
        return false;
    }

    // check if black pawns are on the last row
    if (piece.color === 'b' && piece.piece === 'p' && square.rank === '8') {
        return false;
    }

    // check if there are kings on the board
    if (piece.piece === 'k') {
        const k1 = squareId;
        const k2 = board.getPiece(piece.color === 'w' ? 'bk' : 'wk')?.squareId;

        // check if there are two kings on the board
        if (k1 && k2) {
            const otherSquare = toSquareInfo(k2)
            // distance between kings must be at least 2 squares
            const k1FileIndex = files.indexOf(square.file)
            const k1RankIndex = ranks.indexOf(square.rank)
            const k2FileIndex = files.indexOf(otherSquare.file)
            const k2RankIndex = ranks.indexOf(otherSquare.rank)

            // file distance
            const fileDistance = Math.abs(k1FileIndex - k2FileIndex);
            const rankDistance = Math.abs(k1RankIndex - k2RankIndex);

            // kings must be at least 2 squares apart
            if (fileDistance < 2 && rankDistance < 2) {
                return false;
            }
        }
    }

    return true;
}

// recursively put the next piece on the board
function putPieces(initialSolution: Solution): Solution | undefined {

    // all pieces are placed
    if (initialSolution.pieceIds.length === 0) {
        return initialSolution;
    }

    // clone the solution
    const suggestedSolution: Solution = cloneSolution(initialSolution);

    // get next piece
    const pieceId = suggestedSolution.pieceIds[0];
    suggestedSolution.pieceIds.splice(0, 1);

    // try every coordinate, accept the first valid one
    for (let i = 0; i < suggestedSolution.squareIds.length; i++) {

        // get a candidate square
        let squareId = suggestedSolution.squareIds[i];
        // remove the candidate square from the list
        suggestedSolution.squareIds.splice(i, 1);

        // check if this position is valid for the piece
        if (isValidPosition(suggestedSolution.board, pieceId, squareId)) {
            // all good, put the piece on the board
            suggestedSolution.board.setPiece(pieceId, squareId);

            // continue with the rest of the pieces
            const solvedSolution = putPieces(suggestedSolution);

            // check if we found a complete solution
            if (solvedSolution !== undefined) {
                if (i > 0) {
                    console.log(`solved with index ${i}`);
                }
                return solvedSolution;
            }
        }

        console.log(`invalid position for ${pieceId} at ${squareId}`);

        // put the candidate square back in the list 
        suggestedSolution.squareIds.splice(i, 0, squareId);
    }

    return undefined;
}
