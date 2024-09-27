// create a function that takes a set of chess pieces and returns a random setup
// the pieces are strings of the form 'wr' 'bn' 'bp' 'bq' 'bk' 'bb' 'br' 'bk' 'bn' 'bp' 'bq' 'bk' 'bb' 'br'
// the pieces are placed on a 8x8 board
// the pieces are placed in random positions
// the position must be a valid position
// the function must return the board setup

import { a1, b1, c1, d1, e1, f1, g1, h1, a2, b2, c2, d2, e2, f2, g2, h2, a8, b8, c8, d8, e8, f8, g8, h8, a7, b7, c7, d7, e7, f7, g7, h7, blackKing, blackKingsideBishop, blackKingsideKnight, blackKingsideRook, blackPawn1, blackPawn2, blackPawn3, blackPawn4, blackPawn5, blackPawn6, blackPawn7, blackPawn8, blackQueen, blackQueensideBishop, blackQueensideKnight, blackQueensideRook, ColorName, FileName, files, PieceInfo, PieceName, RankName, ranks, SquareId, squareIds, SquareInfo, whiteKing, whiteKingsideKnight, whiteKingsideRook, whitePawn1, whitePawn2, whitePawn3, whitePawn4, whitePawn5, whitePawn6, whitePawn7, whitePawn8, whiteQueen, whiteQueensideBishop, whiteQueensideKnight, whiteQueensideRook, PieceId, whiteKingsideBishop } from "@/types/chess";
import { BoardState, PieceState } from "../models/BoardState";


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
        rankName: squareId.charAt(1) as RankName,
        fileIndex: files.indexOf(squareId.charAt(0) as FileName),
        rankIndex: ranks.indexOf(squareId.charAt(1) as RankName)
    };
}

export function toSquareId(fileIndex: number, rankIndex: number): SquareId {
    return `${files[fileIndex]}${ranks[rankIndex]}` as SquareId;
}


export function getEmptyBoard(): BoardState {
    const boardState = new BoardState();
    calculateMoves(boardState);
    return boardState;
}

export function getDefaultBoard(): BoardState {
    const boardState = new BoardState();
    boardState.initialize([
        [a1, whiteQueensideRook],
        [b1, whiteQueensideKnight],
        [c1, whiteQueensideBishop],
        [d1, whiteQueen],
        [e1, whiteKing],
        [f1, whiteKingsideBishop],
        [g1, whiteKingsideKnight],
        [h1, whiteKingsideRook],

        [a2, whitePawn1],
        [b2, whitePawn2],
        [c2, whitePawn3],
        [d2, whitePawn4],
        [e2, whitePawn5],
        [f2, whitePawn6],
        [g2, whitePawn7],
        [h2, whitePawn8],

        [a8, blackQueensideRook],
        [b8, blackQueensideKnight],
        [c8, blackQueensideBishop],
        [d8, blackQueen],
        [e8, blackKing],
        [f8, blackKingsideBishop],
        [g8, blackKingsideKnight],
        [h8, blackKingsideRook],

        [a7, blackPawn1],
        [b7, blackPawn2],
        [c7, blackPawn3],
        [d7, blackPawn4],
        [e7, blackPawn5],
        [f7, blackPawn6],
        [g7, blackPawn7],
        [h7, blackPawn8],
    ])

    updateMoves(boardState, true);
    // calculateMoves(boardState);

    // console.log(boardState);
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

    calculateMoves(solvedSolution.boardState);
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

export function areKingsInCheck(boardState: BoardState): { white: boolean, black: boolean } {
    const checks = {
        white: false,
        black: false
    }

    const whiteKingSquareId = boardState.whiteKingSquareId;
    if (whiteKingSquareId) {
        for (const sourceSquareId of squareIds) {
            const pieceState = boardState.getPiece(sourceSquareId);
            if (pieceState && pieceState.pieceInfo.colorName === 'b') {
                // if (pieceState.pieceInfo.pieceName === 'q') {
                //     console.log(`White king is at ${whiteKingSquareId}`);
                //     console.log(`Checking ${pieceState.pieceInfo.id} at ${sourceSquareId}`);
                //     console.log(`Valid moves: ${pieceState.validMoveSquareIds}`);
                // }

                if (pieceState.validMoveSquareIds.includes(whiteKingSquareId)) {
                    // console.log(`white king ${whiteKingSquareId} in check by valid move by ${pieceState.pieceInfo.id} at ${sourceSquareId}`);
                    checks.white = true;
                }
            }
        }
    }

    const blackKingSquareId = boardState.blackKingSquareId;
    if (blackKingSquareId) {
        for (const sourceSquareId of squareIds) {
            const pieceState = boardState.getPiece(sourceSquareId);
            if (pieceState && pieceState.pieceInfo.colorName === 'w') {
                if (pieceState.validMoveSquareIds.includes(blackKingSquareId)) {
                    // console.log(`black king ${blackKingSquareId} in check by valid move by ${pieceState.pieceInfo.id} at ${sourceSquareId}`);
                    checks.black = true;
                }
            }
        }
    }

    if (checks.black || checks.white) {
        console.log(checks);
    }
    return checks;
}

// Add this new function
function simulateMovePiece(boardState: BoardState, sourceSquareId: SquareId, targetSquareId: SquareId): BoardState {
    const clonedBoardState = boardState.clone();
    // Temporarily set the turn to match the moving piece's color
    const movingPiece = clonedBoardState.getPiece(sourceSquareId);
    if (movingPiece) {
        clonedBoardState.whitesTurn = movingPiece.pieceInfo.colorName === 'w';
    }
    // Perform the full move
    const resultBoard = movePiece(clonedBoardState, sourceSquareId, targetSquareId, false);
    // Reset the turn to the original state
    resultBoard.whitesTurn = boardState.whitesTurn;
    return resultBoard;
}

export function calculateMoves(boardState: BoardState): [SquareId, SquareId[]][] {

    const allPossibleMoves: [SquareId, SquareId[]][] = [];
    for (const sourceSquareId of squareIds) {
        const pieceState = boardState.getPiece(sourceSquareId);
        if (pieceState) {
            let possibleMoves: SquareId[] = [];
            switch (pieceState.pieceInfo.pieceName) {
                case 'p':
                    possibleMoves = getValidPawnMoves(boardState, sourceSquareId, pieceState.pieceInfo);
                    break;
                case 'r':
                    possibleMoves = getValidRookMoves(boardState, sourceSquareId, pieceState.pieceInfo);
                    break;
                case 'n':
                    possibleMoves = getValidKnightMoves(boardState, sourceSquareId, pieceState.pieceInfo);
                    break;
                case 'b':
                    possibleMoves = getValidBishopMoves(boardState, sourceSquareId, pieceState.pieceInfo);
                    break;
                case 'q':
                    possibleMoves = getValidQueenMoves(boardState, sourceSquareId, pieceState.pieceInfo);
                    console.log(`Valid moves for ${pieceState.pieceInfo.id} at ${sourceSquareId}:`, possibleMoves);
                    break;
                case 'k':
                    possibleMoves = getValidKingMoves(boardState, sourceSquareId, pieceState.pieceInfo);
                    break;
                default:
                    break;
            }
            allPossibleMoves.push([sourceSquareId, possibleMoves]);
        }
    }

    return allPossibleMoves;
}

function getValidPawnMoves(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): SquareId[] {
    const squareInfo = toSquareInfo(squareId);
    const fileIndex = files.indexOf(squareInfo.fileName);
    const rankIndex = ranks.indexOf(squareInfo.rankName);

    const dir = pieceInfo.colorName === 'w' ? 1 : -1;
    const candidates = [];

    const stepOneDelta = { dx: 0, dy: dir * 1 };
    const stepOneIndecies = { x: fileIndex + stepOneDelta.dx, y: rankIndex + stepOneDelta.dy }

    // only add square if square is empty
    if (stepOneIndecies.x >= 0 && stepOneIndecies.x < 8 && stepOneIndecies.y >= 0 && stepOneIndecies.y < 8) {
        const stepOneSquareId = toSquareId(stepOneIndecies.x, stepOneIndecies.y) as SquareId;
        const stepOnePieceState = boardState.getPiece(stepOneSquareId);
        if (stepOnePieceState == null) {
            candidates.push(stepOneDelta);
        }
    }

    // only add square if square is empty
    if ((pieceInfo.colorName === 'w' && squareInfo.rankName === '2') || (pieceInfo.colorName === 'b' && squareInfo.rankName === '7')) {
        const stepTwoDelta = { dx: 0, dy: dir * 2 };
        const stepTwoIndecies = { x: fileIndex + stepTwoDelta.dx, y: rankIndex + stepTwoDelta.dy }
        if (stepTwoIndecies.x >= 0 && stepTwoIndecies.x < 8 && stepTwoIndecies.y >= 0 && stepTwoIndecies.y < 8) {
            const stepTwoSquareId = toSquareId(stepTwoIndecies.x, stepTwoIndecies.y) as SquareId;
            const stepTwoPieceState = boardState.getPiece(stepTwoSquareId);
            if (stepTwoPieceState == null) {
                candidates.push(stepTwoDelta);
            }
        }
    }

    // only add square if square is occupied by opponent
    const captureLeftDelta = { dx: -1, dy: dir * 1 }
    const captureLeftIndecies = { x: fileIndex + captureLeftDelta.dx, y: rankIndex + captureLeftDelta.dy }
    if (captureLeftIndecies.x >= 0 && captureLeftIndecies.x < 8 && captureLeftIndecies.y >= 0 && captureLeftIndecies.y < 8) {
        const captureLeftSquareId = toSquareId(fileIndex + captureLeftDelta.dx, rankIndex + captureLeftDelta.dy) as SquareId;
        const captureLeftPieceState = boardState.getPiece(captureLeftSquareId);
        if (captureLeftPieceState && captureLeftPieceState.pieceInfo.colorName !== pieceInfo.colorName) {
            candidates.push(captureLeftDelta);
        }
    }

    // only add square if square is occupied by opponent
    const captureRightDelta = { dx: 1, dy: dir * 1 }
    const captureRightIndecies = { x: fileIndex + captureRightDelta.dx, y: rankIndex + captureRightDelta.dy }
    if (captureRightIndecies.x >= 0 && captureRightIndecies.x < 8 && captureRightIndecies.y >= 0 && captureRightIndecies.y < 8) {
        const captureRightSquareId = toSquareId(fileIndex + captureRightDelta.dx, rankIndex + captureRightDelta.dy) as SquareId;
        const captureRightPieceState = boardState.getPiece(captureRightSquareId);
        if (captureRightPieceState && captureRightPieceState.pieceInfo.colorName !== pieceInfo.colorName) {
            candidates.push(captureRightDelta);
        }
    }

    const validMoves = candidates.flatMap(dir =>
        getMovesFromCandidates(boardState, fileIndex, rankIndex, dir.dx, dir.dy, pieceInfo.colorName)
    );

    // en passant
    if (isEnPassantMove(boardState, squareId, pieceInfo)) {
        const lastMove = boardState.getLastMove();
        if (lastMove) {
            const lastMoveSourceSquareId = lastMove.sourceSquareId;
            const lastMoveSquareInfo = toSquareInfo(lastMoveSourceSquareId);
            const lastMoveSquareFileIndex = files.indexOf(lastMoveSquareInfo.fileName);
            let lastMoveSquareRankIndex = ranks.indexOf(lastMoveSquareInfo.rankName);

            if (lastMoveSquareInfo.rankName === '2') {
                lastMoveSquareRankIndex += 1;
            } else {
                lastMoveSquareRankIndex -= 1;
            }

            const enPassantSquareId = toSquareId(lastMoveSquareFileIndex, lastMoveSquareRankIndex) as SquareId;
            validMoves.push(enPassantSquareId);
        }
    }

    return validMoves;
}

export function isEnPassantMove(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): boolean {

    const squareInfo = toSquareInfo(squareId);

    // check if the piece is a pawn
    if (pieceInfo.pieceName !== 'p') {
        return false;
    }

    if (pieceInfo.colorName === 'w') {
        // check if the white pawn is on the 5th rank
        if (squareInfo.rankName !== '5') {
            return false;
        }
    } else {
        // check if the black pawn is on the 4th rank
        if (squareInfo.rankName !== '4') {
            return false;
        }
    }

    // en passant
    const lastMove = boardState.getLastMove();
    if (!lastMove) {
        return false;
    }
    const lastMoveSourceSquareInfo = toSquareInfo(lastMove.sourceSquareId);
    const lastMoveTargetSquareInfo = toSquareInfo(lastMove.targetSquareId);

    const lastMovePieceState = boardState.getPiece(lastMove.targetSquareId);
    const movedPieceColor = lastMovePieceState?.pieceInfo.colorName;

    // check if the last move was a pawn
    if (lastMovePieceState?.pieceInfo.pieceName !== 'p') {
        return false;
    }

    if (movedPieceColor === 'w') {

        // check if the last move was a white pawn moving two squares forward
        if (lastMoveSourceSquareInfo.rankName !== '2') {
            return false;
        }
        if (lastMoveTargetSquareInfo.rankName !== '4') {
            return false;
        }
    } else {

        // check if the last move was a black pawn moving two squares forward
        if (lastMoveSourceSquareInfo.rankName !== '7') {
            return false;
        }
        if (lastMoveTargetSquareInfo.rankName !== '5') {
            return false;
        }
    }

    const squareFileIndex = files.indexOf(squareInfo.fileName);
    const lastMoveSourceSquareFileIndex = files.indexOf(lastMoveSourceSquareInfo.fileName);

    // check if the last move is on the same file as the current square
    if (Math.abs(squareFileIndex - lastMoveSourceSquareFileIndex) !== 1) {
        return false;
    }

    return true;
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
    const targetSquarIds = candidates.flatMap(dir =>
        getMovesFromCandidates(boardState, fileIndex, rankIndex, dir.dx, dir.dy, pieceInfo.colorName)
    );

    // Check for castling
    if (pieceInfo.colorName === 'w') {

        // can king castle
        if (squareId === 'e1' && !boardState.hasPieceMoved(whiteKing)) {

            // can king side rook castle
            const kingsideRook = boardState.getPiece('h1');
            if (kingsideRook && kingsideRook.pieceInfo.pieceName === 'r' && !boardState.hasPieceMoved(whiteKingsideRook)) {
                if (!boardState.getPiece('f1') && !boardState.getPiece('g1')) {
                    targetSquarIds.push('g1');
                }
            }

            // can queen side rook castle
            const queensideRook = boardState.getPiece('a1');
            if (queensideRook && queensideRook.pieceInfo.pieceName === 'r' && !boardState.hasPieceMoved(whiteQueensideRook)) {
                if (!boardState.getPiece('b1') && !boardState.getPiece('c1') && !boardState.getPiece('d1')) {
                    targetSquarIds.push('c1');
                }
            }
        }
    } else if (pieceInfo.colorName === 'b') {

        // can king castle
        if (squareId === 'e8' && !boardState.hasPieceMoved(blackKing)) {

            // can king side rook castle
            const kingsideRook = boardState.getPiece('h8');
            if (kingsideRook && kingsideRook.pieceInfo.pieceName === 'r' && !boardState.hasPieceMoved(blackKingsideRook)) {
                if (!boardState.getPiece('f8') && !boardState.getPiece('g8')) {
                    targetSquarIds.push('g8');
                }
            }

            // can queen side rook castle
            const queensideRook = boardState.getPiece('a8');
            if (queensideRook && queensideRook.pieceInfo.pieceName === 'r' && !boardState.hasPieceMoved(blackQueensideRook)) {
                if (!boardState.getPiece('b8') && !boardState.getPiece('c8') && !boardState.getPiece('d8')) {
                    targetSquarIds.push('c8');
                }
            }
        }
    }
    return targetSquarIds;
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
            suggestedSolution.boardState.putPiece(squareId, new PieceState(pieceId));

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

export function movePiece(boardState: BoardState, sourceSquareId: SquareId, targetSquareId: SquareId, recalculateMoves: boolean = true): BoardState {
    const clonedBoardState = boardState.clone();

    if (clonedBoardState.getPiece(sourceSquareId)?.pieceInfo.colorName === 'w' && !clonedBoardState.whitesTurn) {
        throw new Error(`It's not whites move`);
    }
    if (clonedBoardState.getPiece(sourceSquareId)?.pieceInfo.colorName === 'b' && clonedBoardState.whitesTurn) {
        throw new Error(`It's not blacks move`);
    }

    // get the piece
    const piece = clonedBoardState.getPiece(sourceSquareId);
    if (!piece) {
        throw new Error(`No piece at ${sourceSquareId}`);
    }

    // check if the move is valid
    if (!piece.validMoveSquareIds.includes(targetSquareId)) {
        throw new Error(`Piece ${piece.pieceInfo.colorName}${piece.pieceInfo.pieceName}${piece.pieceInfo.number} cannot move from ${sourceSquareId} to ${targetSquareId}`);
    }

    const sourceSquare = toSquareInfo(sourceSquareId);
    const sourceFileIndex = files.indexOf(sourceSquare.fileName);
    const sourceRankIndex = ranks.indexOf(sourceSquare.rankName);
    const targetSquare = toSquareInfo(targetSquareId);
    const targetFileIndex = files.indexOf(targetSquare.fileName);
    const targetRankIndex = ranks.indexOf(targetSquare.rankName);
    const targetPieceState = clonedBoardState.getPiece(targetSquareId);

    // capture pieces
    if (targetPieceState) {
        console.log(`capture move ${targetSquareId}`);
        clonedBoardState.capturePiece(targetPieceState.pieceInfo.id);
    }

    // move the piece
    clonedBoardState.movePiece(sourceSquareId, targetSquareId);

    // check if en passant move
    if (piece.pieceInfo.pieceName === 'p') {

        // check if diagonal move and target is empty
        if (sourceSquare.fileName !== targetSquare.fileName && targetPieceState === null) {

            const enPassantTargetFileIndex = targetFileIndex;
            const enPassantTargetRankIndex = ranks.indexOf(targetSquare.rankName === '3' ? '4' : '5');
            const enPassantTargetSquareId = toSquareId(enPassantTargetFileIndex, enPassantTargetRankIndex);
            const enPassantPieceState = clonedBoardState.getPiece(enPassantTargetSquareId);

            // remove any piece that is captured on the en passant target square
            if (enPassantPieceState) {
                clonedBoardState.capturePiece(enPassantPieceState.pieceInfo.id);
            }
        }
    }

    // check if castle move
    if (piece.pieceInfo.pieceName === 'k' && Math.abs(sourceFileIndex - targetFileIndex) === 2) {
        // castle kingside
        if (targetFileIndex === 6) {
            // move rook
            clonedBoardState.movePiece(toSquareId(7, sourceRankIndex), toSquareId(5, sourceRankIndex));
        }

        // castle queenside
        if (targetFileIndex === 2) {
            // move rook
            clonedBoardState.movePiece(toSquareId(0, sourceRankIndex), toSquareId(3, sourceRankIndex));
        }
    }

    // remember the move
    clonedBoardState.setLastMove(sourceSquareId, targetSquareId);

    const checks = areKingsInCheck(boardState);
    boardState.whiteKingInCheck = checks.white;
    boardState.blackKingInCheck = checks.black;
    console.log(`white king in check: ${boardState.whiteKingInCheck}`);
    console.log(`black king in check: ${boardState.blackKingInCheck}`);

    updateMoves(clonedBoardState, recalculateMoves);

    clonedBoardState.whitesTurn = !boardState.whitesTurn;

    return clonedBoardState;
}

export function updateMoves(boardState: BoardState, recalculateMoves: boolean = true): void {

    // check if the move puts the king in check
    if (recalculateMoves) {
        const initialBoardState = boardState.clone();
        const allPossibleMoves = calculateMoves(boardState);
        console.log("all possible moves");
        console.log(allPossibleMoves);

        // invalidate all moves
        for (const squareId of squareIds) {
            const pieceState = boardState.getPiece(squareId);
            if (pieceState) {
                pieceState.validMoveSquareIds = [];
            }
        }

        // set all valid moves initially
        for (const possibleMoves of allPossibleMoves) {
            const [sourceSquareId, targetSquareIds] = possibleMoves;
            const pieceState = initialBoardState.getPiece(sourceSquareId);
            if (!pieceState) {
                throw new Error(`No piece at ${sourceSquareId}`);
            }
            pieceState.validMoveSquareIds = targetSquareIds;
        }
        console.log("initial board state");
        console.log(initialBoardState);

        // try out all moves and test for check

        for (const possibleMoves of allPossibleMoves) {
            const [sourceSquareId, targetSquareIds] = possibleMoves;
            const pieceState = boardState.getPiece(sourceSquareId);
            if (!pieceState) {
                throw new Error(`No piece at ${sourceSquareId}`);
            }
            for (const targetSquareId of targetSquareIds) {
                const clonedBoardState = initialBoardState.clone();
                const simulatesBoardState = simulateMovePiece(clonedBoardState, sourceSquareId, targetSquareId);
                console.log(`simulated move ${sourceSquareId} ${targetSquareId} ${simulatesBoardState.whiteKingInCheck} ${simulatesBoardState.blackKingInCheck}`);
                if (simulatesBoardState.whiteKingInCheck) {
                    console.log(`move ${sourceSquareId} ${targetSquareId} puts white king in check`);
                } else if (simulatesBoardState.blackKingInCheck) {
                    console.log(`move ${sourceSquareId} ${targetSquareId} puts black king in check`);
                } else {
                    pieceState.validMoveSquareIds.push(targetSquareId);
                }
            }
            // pieceState.validMoveSquareIds = []
            // for (const targetSquareId of targetSquareIds) {
            //     console.log(`${sourceSquareId} ${targetSquareId}`);
            //     const clonedBoardState = initialBoardState.clone();
            //     const simulatesBoardState = simulateMovePiece(clonedBoardState, sourceSquareId, targetSquareId);
            //     console.log(`simulated move ${sourceSquareId} ${targetSquareId} ${simulatesBoardState.whiteKingInCheck} ${simulatesBoardState.blackKingInCheck}`);
            //     if (simulatesBoardState.whiteKingInCheck) {
            //         console.log(`move ${sourceSquareId} ${targetSquareId} puts white king in check`);
            //     } else if (simulatesBoardState.blackKingInCheck) {
            //         console.log(`move ${sourceSquareId} ${targetSquareId} puts black king in check`);
            //     } else {
            //         pieceState.validMoveSquareIds.push(targetSquareId);
            //     }
            // }
        }
    }
}