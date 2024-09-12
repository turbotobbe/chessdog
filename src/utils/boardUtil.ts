// create a function that takes a set of chess pieces and returns a random setup
// the pieces are strings of the form 'wr' 'bn' 'bp' 'bq' 'bk' 'bb' 'br' 'bk' 'bn' 'bp' 'bq' 'bk' 'bb' 'br'
// the pieces are placed on a 8x8 board
// the pieces are placed in random positions
// the position must be a valid position
// the function must return the board setup

import { BoardState, files, PieceName, ranks, Square } from "../models/BoardState";


export function getDefaultBoard(): BoardState {
    const board = new BoardState();
    board.setPiece({file: 'a', rank: '1'}, 'wr');
    board.setPiece({file: 'b', rank: '1'}, 'wn');
    board.setPiece({file: 'c', rank: '1'}, 'wb');
    board.setPiece({file: 'd', rank: '1'}, 'wq');
    board.setPiece({file: 'e', rank: '1'}, 'wk');
    board.setPiece({file: 'f', rank: '1'}, 'wb');
    board.setPiece({file: 'g', rank: '1'}, 'wn');
    board.setPiece({file: 'h', rank: '1'}, 'wr');

    board.setPiece({file: 'a', rank: '2'}, 'wp');
    board.setPiece({file: 'b', rank: '2'}, 'wp');
    board.setPiece({file: 'c', rank: '2'}, 'wp');
    board.setPiece({file: 'd', rank: '2'}, 'wp');
    board.setPiece({file: 'e', rank: '2'}, 'wp');
    board.setPiece({file: 'f', rank: '2'}, 'wp');
    board.setPiece({file: 'g', rank: '2'}, 'wp');
    board.setPiece({file: 'h', rank: '2'}, 'wp');

    board.setPiece({file: 'a', rank: '7'}, 'bp');
    board.setPiece({file: 'b', rank: '7'}, 'bp');
    board.setPiece({file: 'c', rank: '7'}, 'bp');
    board.setPiece({file: 'd', rank: '7'}, 'bp');
    board.setPiece({file: 'e', rank: '7'}, 'bp');
    board.setPiece({file: 'f', rank: '7'}, 'bp');
    board.setPiece({file: 'g', rank: '7'}, 'bp');
    board.setPiece({file: 'h', rank: '7'}, 'bp');

    board.setPiece({file: 'a', rank: '8'}, 'br');
    board.setPiece({file: 'b', rank: '8'}, 'bn');
    board.setPiece({file: 'c', rank: '8'}, 'bb');
    board.setPiece({file: 'd', rank: '8'}, 'bq');
    board.setPiece({file: 'e', rank: '8'}, 'bk');
    board.setPiece({file: 'f', rank: '8'}, 'bb');
    board.setPiece({file: 'g', rank: '8'}, 'bn');
    board.setPiece({file: 'h', rank: '8'}, 'br');

    return board;
}

export function getRandomBoard(pieces: PieceName[]): BoardState {

    let initialSolution: Solution = {
        state: new BoardState(),
        pieces: pieces,
        squares: []
    };

    // generate the board squares
    initialSolution.squares = [{ rank: ranks[0], file: files[0] }];
    for (let rank of ranks) {
        for (let file of files) {
            initialSolution.squares.push({ rank: rank, file: file });
        }
    }

    // shuffle the board squares
    initialSolution.squares.sort(() => Math.random() - 0.5);

    const solvedSolution = putPieces(initialSolution);

    if (solvedSolution === undefined) {
        return initialSolution.state;
    }

    return solvedSolution.state;
}


// object to store a solution
interface Solution {
    state: BoardState;
    pieces: PieceName[];
    squares: Square[]
}

function cloneSolution(solution: Solution): Solution {
    return {
        state: solution.state.clone(), // Assuming we add a clone method to BoardState
        pieces: [...solution.pieces],
        squares: solution.squares.map(square => ({...square}))
    };
}

function isValidPosition(state: BoardState, piece: PieceName, square: Square): boolean {

    // check if the position is already occupied
    if (state.getPiece(square) !== null) {
        return false;
    }

    // check if white pawns are on the first rank    
    if (piece === 'wp' && square.rank === '1') {
        return false;
    }

    // check if black pawns are on the last row
    if (piece === 'bp' && square.rank === '8') {
        return false;
    }

    return true;
}

// recursively put the next piece on the board
function putPieces(initialSolution: Solution): Solution | undefined {

    // all pieces are placed
    if (initialSolution.pieces.length === 0) {
        return initialSolution;
    }

    // clone the solution
    const suggestedSolution: Solution = cloneSolution(initialSolution);

    // get next piece
    const piece = suggestedSolution.pieces[0];
    suggestedSolution.pieces.splice(0, 1);

    // try every coordinate, accept the first valid one
    for (let i = 0; i < suggestedSolution.squares.length; i++) {
        let square = suggestedSolution.squares[i];

        // check if the position is already occupied (should not happen)
        if (suggestedSolution.state.getPiece(square) !== null) {
            continue;
        }

        // check if this position is valid for the piece
        if (!isValidPosition(suggestedSolution.state, piece, square)) {
            continue;
        }

        // all good, put the piece on the board
        suggestedSolution.state.setPiece(square, piece);

        // remove the coordinate from the list
        suggestedSolution.squares.splice(i, 1);

        // continue with the rest of the pieces
        const solvedSolution = putPieces(suggestedSolution);

        // check if we found a complete solution
        if (solvedSolution !== undefined) {
            if (i>0) {
                console.log(`solved with index ${i}`);
            }
            return solvedSolution;
        }

        // remove the piece from the board
        suggestedSolution.state.setPiece(square, null);

        // put the coordinate back in the list 
        suggestedSolution.squares.splice(i, 0, square);
    }

    return undefined;
}
