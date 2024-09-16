// create a function that takes a set of chess pieces and returns a random setup
// the pieces are strings of the form 'wr' 'bn' 'bp' 'bq' 'bk' 'bb' 'br' 'bk' 'bn' 'bp' 'bq' 'bk' 'bb' 'br'
// the pieces are placed on a 8x8 board
// the pieces are placed in random positions
// the position must be a valid position
// the function must return the board setup

import { BoardState, PieceId, SquareId, squareIds, RankName, FileName, PieceInfo, ColorName, PieceName, SquareInfo, ranks, files } from "../models/BoardState";


export function toPieceInfo(pieceId: PieceId): PieceInfo {
    return {
        id: pieceId,
        colorName: pieceId.charAt(0) as ColorName,
        pieceName: pieceId.charAt(1) as PieceName,
        number: parseInt(pieceId.charAt(2), 10)
    };
}

export function toSquareInfo(squareId: SquareId): SquareInfo {
    return {
        id: squareId,
        fileName: squareId.charAt(0) as FileName,
        rankName: squareId.charAt(1) as RankName
    };
}

export function toSquareId(fileIndex: number, rankIndex: number): SquareId {
    return `${files[fileIndex]}${ranks[rankIndex]}` as SquareId;
}


export function getDummyBoard(): BoardState {
    const boardState = new BoardState();

    boardState.setPiece('b2', 'wp2');
    boardState.setPiece('a3', 'bn1');
    boardState.setPiece('a1', 'bn2');
    boardState.setPiece('c3', 'bb1');
    boardState.setPiece('c1', 'bb2');

    boardState.setPiece('e7', 'bp6');
    boardState.setPiece('d8', 'wn1');
    boardState.setPiece('d6', 'wn2');
    boardState.setPiece('f8', 'wb1');
    boardState.setPiece('f6', 'wb2');

    calculateValidMoves(boardState);

    return boardState;
}

export function getDefaultBoard(): BoardState {
    const boardState = new BoardState();

    boardState.setPiece('a1', 'wr1');
    boardState.setPiece('b1', 'wn1');
    boardState.setPiece('c1', 'wb1');
    boardState.setPiece('d1', 'wq1');
    boardState.setPiece('e1', 'wk1');
    boardState.setPiece('f1', 'wb2');
    boardState.setPiece('g1', 'wn2');
    boardState.setPiece('h1', 'wr2');

    boardState.setPiece('a2', 'wp1');
    boardState.setPiece('b2', 'wp2');
    boardState.setPiece('c2', 'wp3');
    boardState.setPiece('d2', 'wp4');
    boardState.setPiece('e2', 'wp5');
    boardState.setPiece('f2', 'wp6');
    boardState.setPiece('g2', 'wp7');
    boardState.setPiece('h2', 'wp8');

    boardState.setPiece('a8', 'br1');
    boardState.setPiece('b8', 'bn1');
    boardState.setPiece('c8', 'bb1');
    boardState.setPiece('d8', 'bq1');
    boardState.setPiece('e8', 'bk1');
    boardState.setPiece('f8', 'bb2');
    boardState.setPiece('g8', 'bn2');
    boardState.setPiece('h8', 'br2');

    boardState.setPiece('a7', 'bp1');
    boardState.setPiece('b7', 'bp2');
    boardState.setPiece('c7', 'bp3');
    boardState.setPiece('d7', 'bp4');
    boardState.setPiece('e7', 'bp5');
    boardState.setPiece('f7', 'bp6');
    boardState.setPiece('g7', 'bp7');
    boardState.setPiece('h7', 'bp8');

    calculateValidMoves(boardState);

    return boardState;
}

export function getRandomBoard(pieceIds: PieceId[]): BoardState {

    let initialSolution: Solution = {
        boardState: new BoardState(),
        pieceIds: [...pieceIds],
        squareIds: [...squareIds]
    };

    // shuffle the board squares
    initialSolution.squareIds.sort(() => Math.random() - 0.5);
    const solvedSolution = putPieces(initialSolution);

    if (solvedSolution === undefined) {
        return initialSolution.boardState;
    }

    calculateValidMoves(solvedSolution.boardState);
    return solvedSolution.boardState;
}


// object to store a solution
interface Solution {
    boardState: BoardState;
    pieceIds: PieceId[];
    squareIds: SquareId[];
}

function cloneSolution(solution: Solution): Solution {
    return {
        boardState: solution.boardState.clone(),
        pieceIds: [...solution.pieceIds],
        squareIds: [...solution.squareIds]
    };
}

export function calculateValidMoves(boardState: BoardState): void {
    for (const squareId of squareIds) {
        const pieceState = boardState.getPiece(squareId);
        if (pieceState) {
            switch (pieceState.pieceInfo.pieceName) {
                case 'p':
                    pieceState.setValidMoves(getValidPawnMoves(boardState, squareId, pieceState.pieceInfo));
                    break;
                case 'r':
                    pieceState.setValidMoves(getValidRookMoves(boardState, squareId, pieceState.pieceInfo));
                    break;
                case 'n':
                    pieceState.setValidMoves(getValidKnightMoves(boardState, squareId, pieceState.pieceInfo));
                    break;
                case 'b':
                    pieceState.setValidMoves(getValidBishopMoves(boardState, squareId, pieceState.pieceInfo));
                    break;
                case 'q':
                    pieceState.setValidMoves(getValidQueenMoves(boardState, squareId, pieceState.pieceInfo));
                    break;
                case 'k':
                    pieceState.setValidMoves(getValidKingMoves(boardState, squareId, pieceState.pieceInfo));
                    break;
                default:
                    break;
            }
        }
    }
}

function getValidPawnMoves(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): SquareId[] {
    const squareInfo = toSquareInfo(squareId);
    const fileIndex = files.indexOf(squareInfo.fileName);
    const rankIndex = ranks.indexOf(squareInfo.rankName);

    const dir = pieceInfo.colorName === 'w' ? 1 : -1;
    const candidates = [
        { dx: 0, dy: dir*1 },  // forward
    ];
    if (pieceInfo.colorName === 'w' && squareInfo.rankName === '2') {
        candidates.push({ dx: 0, dy: dir * 2 }); // double forward
    }
    if (pieceInfo.colorName === 'b' && squareInfo.rankName === '7') {
        candidates.push({ dx: 0, dy: dir * 2 }); // double forward
    }

    // only add square if square is occupied by opponent
    const captureLeftDelta = { dx: -1, dy: dir * 1 }
    const captureLeftIndecies = {x: fileIndex+captureLeftDelta.dx, y: rankIndex+captureLeftDelta.dy}
    if (captureLeftIndecies.x >= 0 && captureLeftIndecies.x < 8 && captureLeftIndecies.y >= 0 && captureLeftIndecies.y < 8) {
        const captureLeftSquareId = toSquareId(fileIndex+captureLeftDelta.dx, rankIndex+captureLeftDelta.dy) as SquareId;
        const captureLeftPieceState = boardState.getPiece(captureLeftSquareId);
        if (captureLeftPieceState && captureLeftPieceState.pieceInfo.colorName !== pieceInfo.colorName) {
                candidates.push(captureLeftDelta);
        }
    }   

    // only add square if square is occupied by opponent
    const captureRightDelta = { dx: 1, dy: dir * 1 }
    const captureRightIndecies = {x: fileIndex+captureRightDelta.dx, y: rankIndex+captureRightDelta.dy}
    if (captureRightIndecies.x >= 0 && captureRightIndecies.x < 8 && captureRightIndecies.y >= 0 && captureRightIndecies.y < 8) {
        const captureRightSquareId = toSquareId(fileIndex+captureRightDelta.dx, rankIndex+captureRightDelta.dy) as SquareId;
        const captureRightPieceState = boardState.getPiece(captureRightSquareId);
        if (captureRightPieceState && captureRightPieceState.pieceInfo.colorName !== pieceInfo.colorName) {
            candidates.push(captureRightDelta);
        }
    }

    return candidates.flatMap(dir =>
        getMovesFromCandidates(boardState, fileIndex, rankIndex, dir.dx, dir.dy, pieceInfo.colorName)
    );
}

function getValidRookMoves(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): SquareId[] {
    const squareInfo = toSquareInfo(squareId);
    const fileIndex = files.indexOf(squareInfo.fileName);
    const rankIndex = ranks.indexOf(squareInfo.rankName);

    const directions = [
        { dx: 0, dy: 1 },  // up
        { dx: 0, dy: -1 }, // down
        { dx: 1, dy: 0 },  // right
        { dx: -1, dy: 0 }, // left
    ];

    return directions.flatMap(dir =>
        getMovesInDirection(boardState, fileIndex, rankIndex, dir.dx, dir.dy, pieceInfo.colorName)
    );
}

function getValidKnightMoves(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): SquareId[] {
    const squareInfo = toSquareInfo(squareId);
    const fileIndex = files.indexOf(squareInfo.fileName);
    const rankIndex = ranks.indexOf(squareInfo.rankName);

    const candidates = [
        { dx: -1, dy: 2 },  // up, up, left
        { dx: 1, dy: 2 }, // up, up, right
        { dx: -2, dy: 1 },  // up, left, left
        { dx: 2, dy: 1 }, // up, right, right
        { dx: -1, dy: -2 },  // down, down, left
        { dx: 1, dy: -2 }, // down, down, right
        { dx: -2, dy: -1 },  // down, left, left
        { dx: 2, dy: -1 }, // down, right, right
    ];
    return candidates.flatMap(dir =>
        getMovesFromCandidates(boardState, fileIndex, rankIndex, dir.dx, dir.dy, pieceInfo.colorName)
    );
}

function getValidBishopMoves(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): SquareId[] {
    const squareInfo = toSquareInfo(squareId);
    const fileIndex = files.indexOf(squareInfo.fileName);
    const rankIndex = ranks.indexOf(squareInfo.rankName);

    const directions = [
        { dx: 1, dy: 1 },  // up-right
        { dx: 1, dy: -1 }, // down-right
        { dx: -1, dy: 1 }, // up-left
        { dx: -1, dy: -1 }, // down-left
    ];

    return directions.flatMap(dir =>
        getMovesInDirection(boardState, fileIndex, rankIndex, dir.dx, dir.dy, pieceInfo.colorName)
    );
}

function getValidQueenMoves(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): SquareId[] {
    const squareInfo = toSquareInfo(squareId);
    const fileIndex = files.indexOf(squareInfo.fileName);
    const rankIndex = ranks.indexOf(squareInfo.rankName);

    const directions = [
        { dx: 0, dy: 1 },  // up
        { dx: 0, dy: -1 }, // down
        { dx: 1, dy: 0 },  // right
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 1 },  // up-right
        { dx: 1, dy: -1 }, // down-right
        { dx: -1, dy: 1 }, // up-left
        { dx: -1, dy: -1 }, // down-left
    ];

    return directions.flatMap(dir =>
        getMovesInDirection(boardState, fileIndex, rankIndex, dir.dx, dir.dy, pieceInfo.colorName)
    );
}

function getValidKingMoves(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): SquareId[] {
    const squareInfo = toSquareInfo(squareId);
    const fileIndex = files.indexOf(squareInfo.fileName);
    const rankIndex = ranks.indexOf(squareInfo.rankName);

    const candidates = [
        { dx: 0, dy: 1 },  // up
        { dx: 0, dy: -1 }, // down
        { dx: 1, dy: 0 },  // right
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 1 },  // up-right
        { dx: 1, dy: -1 }, // down-right
        { dx: -1, dy: 1 }, // up-left
        { dx: -1, dy: -1 }, // down-left
    ];
    return candidates.flatMap(dir =>
        getMovesFromCandidates(boardState, fileIndex, rankIndex, dir.dx, dir.dy, pieceInfo.colorName)
    );
}


function getMovesInDirection(
    boardState: BoardState,
    startX: number,
    startY: number,
    dx: number,
    dy: number,
    pieceColor: ColorName
): SquareId[] {
    const moves: SquareId[] = [];
    let x = startX + dx;
    let y = startY + dy;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const squareId = toSquareId(x, y) as SquareId;
        const pieceState = boardState.getPiece(squareId);

        if (pieceState) {
            if (pieceState.pieceInfo.colorName !== pieceColor) {
                moves.push(squareId);
            }
            break;
        }
        moves.push(squareId);
        x += dx;
        y += dy;
    }

    return moves;
}

function getMovesFromCandidates(
    boardState: BoardState,
    startX: number,
    startY: number,
    dx: number,
    dy: number,
    pieceColor: ColorName
): SquareId[] {
    const moves: SquareId[] = [];
    let x = startX + dx;
    let y = startY + dy;

    // check if the square is on the board
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const squareId = toSquareId(x, y) as SquareId;
        const pieceState = boardState.getPiece(squareId);

        if (pieceState == null) {
            moves.push(squareId);
        } else if (pieceState.pieceInfo.colorName !== pieceColor) {
            moves.push(squareId);
        }
    }

    return moves;
}

function isValidPosition(board: BoardState, pieceId: PieceId, squareId: SquareId): boolean {

    console.log(`isValidPosition: ${pieceId} at ${squareId} ${board.getPiece(squareId)?.pieceInfo.colorName}`);
    // const square = toSquareInfo(squareId);
    // const piece = toPieceInfo(pieceId);

    // // check if the piece is already on the board
    // if (board.getPiece(pieceId)?.squareId !== null) {
    //     return false;
    // }

    // // check if white pawns are on the first rank    
    // if (piece.color === 'w' && piece.piece === 'p' && square.rank === '1') {
    //     return false;
    // }

    // // check if black pawns are on the last row
    // if (piece.color === 'b' && piece.piece === 'p' && square.rank === '8') {
    //     return false;
    // }

    // // check if there are kings on the board
    // if (piece.piece === 'k') {
    //     const k1 = squareId;
    //     const k2 = board.getPiece(piece.color === 'w' ? 'bk' : 'wk')?.squareId;

    //     // check if there are two kings on the board
    //     if (k1 && k2) {
    //         const otherSquare = toSquareInfo(k2)
    //         // distance between kings must be at least 2 squares
    //         const k1FileIndex = files.indexOf(square.file)
    //         const k1RankIndex = ranks.indexOf(square.rank)
    //         const k2FileIndex = files.indexOf(otherSquare.file)
    //         const k2RankIndex = ranks.indexOf(otherSquare.rank)

    //         // file distance
    //         const fileDistance = Math.abs(k1FileIndex - k2FileIndex);
    //         const rankDistance = Math.abs(k1RankIndex - k2RankIndex);

    //         // kings must be at least 2 squares apart
    //         if (fileDistance < 2 && rankDistance < 2) {
    //             return false;
    //         }
    //     }
    // }

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

        console.log(`trying ${pieceId} at ${squareId}`);
        // check if this position is valid for the piece
        if (isValidPosition(suggestedSolution.boardState, pieceId, squareId)) {
            // all good, put the piece on the board
            suggestedSolution.boardState.setPiece(squareId, pieceId);

            // continue with the rest of the pieces
            const solvedSolution = putPieces(suggestedSolution);

            // check if we found a complete solution
            if (solvedSolution !== undefined) {
                return solvedSolution;
            }
        }

        console.log(`invalid position for ${pieceId} at ${squareId}`);

        // put the candidate square back in the list 
        suggestedSolution.squareIds.splice(i, 0, squareId);
    }

    return undefined;
}

