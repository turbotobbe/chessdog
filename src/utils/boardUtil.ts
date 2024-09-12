// create a function that takes a set of chess pieces and returns a random setup
// the pieces are strings of the form 'wr' 'bn' 'bp' 'bq' 'bk' 'bb' 'br' 'bk' 'bn' 'bp' 'bq' 'bk' 'bb' 'br'
// the pieces are placed on a 8x8 board
// the pieces are placed in random positions
// the position must be a valid position
// the function must return the board setup

import { BoardState, files, PieceId, ranks, Square } from "../models/BoardState";


export function getDefaultBoard(): BoardState {
    const board = new BoardState();

    board.setPiece('wr1', { file: 'a', rank: '1' });
    board.setPiece('wn1', { file: 'b', rank: '1' });
    board.setPiece('wb1', { file: 'c', rank: '1' });
    board.setPiece('wq', { file: 'd', rank: '1' });
    board.setPiece('wk', { file: 'e', rank: '1' });
    board.setPiece('wb2', { file: 'f', rank: '1' });
    board.setPiece('wn2', { file: 'g', rank: '1' });
    board.setPiece('wr2', { file: 'h', rank: '1' });

    board.setPiece('wp1', { file: 'a', rank: '2' });
    board.setPiece('wp2', { file: 'b', rank: '2' });
    board.setPiece('wp3', { file: 'c', rank: '2' });
    board.setPiece('wp4', { file: 'd', rank: '2' });
    board.setPiece('wp5', { file: 'e', rank: '2' });
    board.setPiece('wp6', { file: 'f', rank: '2' });
    board.setPiece('wp7', { file: 'g', rank: '2' });
    board.setPiece('wp8', { file: 'h', rank: '2' });

    board.setPiece('br1', { file: 'a', rank: '8' });
    board.setPiece('bn1', { file: 'b', rank: '8' });
    board.setPiece('bb1', { file: 'c', rank: '8' });
    board.setPiece('bq', { file: 'd', rank: '8' });
    board.setPiece('bk', { file: 'e', rank: '8' });
    board.setPiece('bb2', { file: 'f', rank: '8' });
    board.setPiece('bn2', { file: 'g', rank: '8' });
    board.setPiece('br2', { file: 'h', rank: '8' });

    board.setPiece('bp1', { file: 'a', rank: '7' });
    board.setPiece('bp2', { file: 'b', rank: '7' });
    board.setPiece('bp3', { file: 'c', rank: '7' });
    board.setPiece('bp4', { file: 'd', rank: '7' });
    board.setPiece('bp5', { file: 'e', rank: '7' });
    board.setPiece('bp6', { file: 'f', rank: '7' });
    board.setPiece('bp7', { file: 'g', rank: '7' });
    board.setPiece('bp8', { file: 'h', rank: '7' });

    return board;
}

export function getRandomBoard(pieceIds: PieceId[]): BoardState {

    let initialSolution: Solution = {
        board: new BoardState(),
        pieceIds: pieceIds,
        squares: []
    };
    // generate the board squares
    initialSolution.squares = [];
    for (let rank of ranks) {
        for (let file of files) {
            initialSolution.squares.push({ rank: rank, file: file });
        }
    }

    // shuffle the board squares
    initialSolution.squares.sort(() => Math.random() - 0.5);

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
    squares: Square[];
}

function cloneSolution(solution: Solution): Solution {
    return {
        board: solution.board.clone(), // Assuming we add a clone method to BoardState
        pieceIds: [...solution.pieceIds],
        squares: solution.squares.map(square => ({ ...square }))
    };
}

function isValidPosition(board: BoardState, pieceId: PieceId, square: Square): boolean {

    // check if the piece is already on the board
    if (board.getPiece(pieceId)?.square !== null) {
        return false;
    }

    // check if white pawns are on the first rank    
    if (pieceId.startsWith('wp') && square.rank === '1') {
        return false;
    }

    // check if black pawns are on the last row
    if (pieceId.startsWith('bp') && square.rank === '8') {
        return false;
    }

    // check if there are kings on the board
    if (pieceId.startsWith('bk') || pieceId.startsWith('wk')) {
        const k1 = square;
        const k2 = board.getPiece(pieceId === 'bk' ? 'wk' : 'bk')?.square;

        // check if there are two kings on the board
        if (k1 && k2) {
            // distance between kings must be at least 2 squares
            const k1FileIndex = files.indexOf(k1.file)
            const k1RankIndex = ranks.indexOf(k1.rank)
            const k2FileIndex = files.indexOf(k2.file)
            const k2RankIndex = ranks.indexOf(k2.rank)

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
    for (let i = 0; i < suggestedSolution.squares.length; i++) {

        // get a candidate square
        let square = suggestedSolution.squares[i];
        // remove the candidate square from the list
        suggestedSolution.squares.splice(i, 1);

        // check if this position is valid for the piece
        if (isValidPosition(suggestedSolution.board, pieceId, square)) {
            // all good, put the piece on the board
            suggestedSolution.board.setPiece(pieceId, square);

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

        console.log(`invalid position for ${pieceId} at ${square.file}${square.rank}`);

        // put the candidate square back in the list 
        suggestedSolution.squares.splice(i, 0, square);
    }

    return undefined;
}
