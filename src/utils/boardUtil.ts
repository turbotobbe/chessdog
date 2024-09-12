// create a function that takes a set of chess pieces and returns a random setup
// the pieces are strings of the form 'wr' 'bn' 'bp' 'bq' 'bk' 'bb' 'br' 'bk' 'bn' 'bp' 'bq' 'bk' 'bb' 'br'
// the pieces are placed on a 8x8 board
// the pieces are placed in random positions
// the position must be a valid position
// the function must return the board setup

import { PieceName } from "../models/BoardSetup";

// object to store a solution
interface Solution {
    board: (PieceName | null)[][];
    pieces: PieceName[];
    coordinates: [number, number][];
}

function isValidPosition(board: (PieceName | null)[][], piece: PieceName, row: number, col: number): boolean {

    // check if the position is already occupied
    if (board[row][col] !== null) {
        return false;
    }

    // check if white pawns are on the first row    
    if (piece === 'wp' && row === 0) {
        return false;
    }

    // check if black pawns are on the last row
    if (piece === 'bp' && row === 7) {
        return false;
    }

    // check if the white bishop is on the same color square
    if (piece === 'wb' && (row + col) % 2 === 0) {
        return false;
    }

    // check if the black bishop is on the same color square
    if (piece === 'bb' && (row + col) % 2 === 0) {
        return false;
    }

    // check if the kings are adjecent to each other
    if (piece === 'bk' || piece === 'wk') {
        let thisKingRow = row;
        let thisKingCol = col;
        // find the white king on the board
        let thatKingRow = -1;
        let thatKingCol = -1;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] === 'wk' || board[i][j] === 'bk') {
                    thatKingRow = i;
                    thatKingCol = j;
                }
            }
        }
        let colDistance = Math.abs(thisKingCol - thatKingCol);
        let rowDistance = Math.abs(thisKingRow - thatKingRow);
        if (colDistance < 2 && rowDistance < 2) {
            return false;
        }
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
    const sugestedSolution = JSON.parse(JSON.stringify(initialSolution)); 

    // get next piece
    const piece = sugestedSolution.pieces[0];
    sugestedSolution.pieces.splice(0, 1);

    // try every coordinate, accept the first valid one
    for (let i = 0; i < sugestedSolution.coordinates.length; i++) {
        let coordinate = sugestedSolution.coordinates[i];
        const [row, col] = coordinate;

        // check if the position is already occupied (should not happen)
        if (sugestedSolution.board[row][col] !== null) {
            continue;
        }

        // check if this position is valid for the piece
        if (!isValidPosition(sugestedSolution.board, piece, row, col)) {
            continue;
        }

        // all good, put the piece on the board
        sugestedSolution.board[row][col] = piece;

        // remove the coordinate from the list
        sugestedSolution.coordinates.splice(i, 1);

        // continue with the rest of the pieces
        const solvedSolution = putPieces(sugestedSolution);

        // check if we found a complete solution
        if (solvedSolution !== undefined) {
            if (i>0) {
                console.log(`solved with index ${i}`);
            }
            return solvedSolution;
        }

        // remove the piece from the board
        sugestedSolution.board[row][col] = null;

        // put the coordinate back in the list 
        sugestedSolution.coordinates.splice(i, 0, coordinate);
    }

    return undefined;
}

export function getRandomBoard(pieces: PieceName[]): (PieceName | null)[][] | undefined {

    let initialSolution: Solution = {
        board: Array(8).fill(null).map(() => Array(8).fill(null)),
        pieces: pieces,
        coordinates: []
    };

    // genenerate the board coordinates
    initialSolution.coordinates = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            initialSolution.coordinates.push([row, col]);
        }
    }

    // shuffle the board coordinates
    initialSolution.coordinates.sort(() => Math.random() - 0.5);

    const solvedSolution = putPieces(initialSolution);

    if (solvedSolution === undefined) {
        return undefined;
    }

    return solvedSolution.board;
}

export function getDefaultBoard(): (PieceName | null)[][] {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[0][0] = 'wr';
    board[0][7] = 'wr';
    board[7][0] = 'br';
    board[7][7] = 'br';
    board[0][1] = 'wn';
    board[0][6] = 'wn';
    board[7][1] = 'bn';
    board[7][6] = 'bn';
    board[0][2] = 'wb';
    board[0][5] = 'wb';
    board[7][2] = 'bb';
    board[7][5] = 'bb';
    board[0][3] = 'wq';
    board[0][4] = 'wk';
    board[7][3] = 'bq';
    board[7][4] = 'bk';
    for (let col = 0; col < 8; col++) {
      board[1][col] = 'wp';
      board[6][col] = 'bp';
    }

    return board;
}