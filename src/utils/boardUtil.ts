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

    calculateMoves(boardState);

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

    calculateMoves(boardState);

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

export function calculateMoves(boardState: BoardState): void {
    for (const sourceSquareId of squareIds) {
        const pieceState = boardState.getPiece(sourceSquareId);
        if (pieceState) {
            pieceState.setCaptureMoves([])
            pieceState.setValidMoves([])
            const validMoves: SquareId[] = [];
            switch (pieceState.pieceInfo.pieceName) {
                case 'p':
                    validMoves.push(...getValidPawnMoves(boardState, sourceSquareId, pieceState.pieceInfo));
                    break;
                case 'r':
                    validMoves.push(...getValidRookMoves(boardState, sourceSquareId, pieceState.pieceInfo));
                    break;
                case 'n':
                    validMoves.push(...getValidKnightMoves(boardState, sourceSquareId, pieceState.pieceInfo));
                    break;
                case 'b':
                    validMoves.push(...getValidBishopMoves(boardState, sourceSquareId, pieceState.pieceInfo));
                    break;
                case 'q':
                    validMoves.push(...getValidQueenMoves(boardState, sourceSquareId, pieceState.pieceInfo));
                    break;
                case 'k':
                    validMoves.push(...getValidKingMoves(boardState, sourceSquareId, pieceState.pieceInfo));
                    break;
                default:
                    break;
            }
            for (const targetSquareId of validMoves) {

                // pawns are special, if not straight move, then it must be a capture
                if (pieceState.pieceInfo.pieceName === 'p') {

                    const sourceSquareInfo = toSquareInfo(sourceSquareId);
                    const targetSquareInfo = toSquareInfo(targetSquareId);

                    if (sourceSquareInfo.fileName !== targetSquareInfo.fileName) {
                        pieceState.setCaptureMoves([...pieceState.getCaptureMoves(), targetSquareId]);
                    } else {
                        pieceState.setValidMoves([...pieceState.getValidMoves(), targetSquareId]);
                    }
                } else {
                    const targetPieceState = boardState.getPiece(targetSquareId);
                    if (targetPieceState && targetPieceState.pieceInfo.colorName !== pieceState.pieceInfo.colorName) {
                        pieceState.setCaptureMoves([...pieceState.getCaptureMoves(), targetSquareId]);
                    } else {
                        pieceState.setValidMoves([...pieceState.getValidMoves(), targetSquareId]);
                    }
                }
            }
        }
    }
    console.log(boardState);
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
        // console.log(`isEnPassantMove: ${squareId} ${pieceInfo.id} ${boardState.getLastMove()?.sourceSquareId} ${boardState.getLastMove()?.targetSquareId}`);
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
        
        console.log(`validMoves: ${validMoves}`);
    }
    
    return validMoves;
}

export function isEnPassantMove(boardState: BoardState, squareId: SquareId, pieceInfo: PieceInfo): boolean {

    // console.log(`isEnPassantMove: ${squareId} ${pieceInfo.id} ${boardState.getLastMove()?.sourceSquareId} ${boardState.getLastMove()?.targetSquareId}`);
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
    console.log('gooooo')
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
    console.log('gooooo')

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
    console.log('gooooo')

    const squareFileIndex = files.indexOf(squareInfo.fileName);
    const lastMoveSourceSquareFileIndex = files.indexOf(lastMoveSourceSquareInfo.fileName);
    console.log(`squareFileIndex: ${squareFileIndex} lastMoveSourceSquareFileIndex: ${lastMoveSourceSquareFileIndex}`)
    // check if the last move is on the same file as the current square
    if (Math.abs(squareFileIndex - lastMoveSourceSquareFileIndex) !== 1) {
        return false;
    }
    console.log('gooooo')

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

export function movePiece(boardState: BoardState, sourceSquareId: SquareId, targetSquareId: SquareId): BoardState {
    const clonedBoardState = boardState.clone();

    if (boardState.getPiece(sourceSquareId)?.pieceInfo.colorName === 'w' && !boardState.isWhitesTurn()) {
        throw new Error(`It's not whites move`);
      }
      if (boardState.getPiece(sourceSquareId)?.pieceInfo.colorName === 'b' && boardState.isWhitesTurn()) {
        throw new Error(`It's not blacks move`);
      }
  
      // get the piece
      const piece = boardState.getPiece(sourceSquareId);
      if (!piece) {
        throw new Error(`No piece at ${sourceSquareId}`);
      }
  
      // check if the move is valid
      if (!piece.getValidMoves().includes(targetSquareId) && !piece.getCaptureMoves().includes(targetSquareId)) {
        throw new Error(`Piece ${piece.pieceInfo.colorName}${piece.pieceInfo.pieceName}${piece.pieceInfo.number} cannot move from ${sourceSquareId} to ${targetSquareId}`);
      }
  
      const sourceSquare = toSquareInfo(sourceSquareId);
      const sourceFileIndex = files.indexOf(sourceSquare.fileName);
      const sourceRankIndex = ranks.indexOf(sourceSquare.rankName);
      const targetSquare = toSquareInfo(targetSquareId);
      const targetFileIndex = files.indexOf(targetSquare.fileName);
      const targetRankIndex = ranks.indexOf(targetSquare.rankName);
      const targetPieceState = boardState.getPiece(targetSquareId);
  
      // check if en passant move
      if (piece.pieceInfo.pieceName === 'p') {
  
        // check if diagonal move and target is empty
        if (sourceSquare.fileName !== targetSquare.fileName && targetPieceState === null) {
  
          console.log('en passant');
  
          const enPassantTargetFileIndex = targetFileIndex;
          const enPassantTargetRankIndex = ranks.indexOf(targetSquare.rankName === '3' ? '4' : '5');
          const enPassantTargetSquareId = toSquareId(enPassantTargetFileIndex, enPassantTargetRankIndex);
          const enPassantPieceState = boardState.getPiece(enPassantTargetSquareId);
  
          // remove any piece that is captured on the en passant target square
          if (enPassantPieceState) {
  
            console.log('en passant');
            clonedBoardState.pushPieceId(enPassantPieceState.pieceInfo.id);
            clonedBoardState.putPiece(toSquareId(enPassantTargetFileIndex, enPassantTargetRankIndex), null);
          }
        }
    }

    // remove any piece that is captured on the target square
    if (targetPieceState) {
        clonedBoardState.pushPieceId(targetPieceState.pieceInfo.id);
        clonedBoardState.putPiece(toSquareId(targetFileIndex, targetRankIndex), null);
    }

    // remove the piece from the source square
    clonedBoardState.putPiece(toSquareId(sourceFileIndex, sourceRankIndex), null);

    // set the piece on the board (remove previous)
    clonedBoardState.putPiece(toSquareId(targetFileIndex, targetRankIndex), piece);

    // remember the move
    clonedBoardState.setLastMove(sourceSquareId, targetSquareId);

    calculateMoves(clonedBoardState);

    clonedBoardState.setIsWhitesTurn(!boardState.isWhitesTurn());

    return clonedBoardState;
}