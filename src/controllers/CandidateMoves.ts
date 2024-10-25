import { asSquareInfo, asSquareId, asPieceInfo } from "@/models/chess";
import { PieceInfo, SquareId, PieceId, SquareInfo, castelingSquareIds } from "@/types/chess";

export type CastleStatus = {
    white: {
        queenSide: boolean,
        kingSide: boolean,
    },
    black: {
        queenSide: boolean,
        kingSide: boolean,
    },
};

export const getCandidateMoves = (
    squareId: SquareId,
    pieceInfo: PieceInfo,
    pieces: Partial<Record<SquareId, PieceId>>,
    movedPieces: PieceId[],
    lastMove?: [SquareId, SquareId],
): SquareId[] => {
    const squareInfo = asSquareInfo(squareId);
    const pieceName = pieceInfo.promotionPieceName || pieceInfo.pieceName;
    switch (pieceName) {
        case "p":
            return getPawnCandidateMoves(squareInfo, pieceInfo, pieces, lastMove);
        case "n":
            return getKnightCandidateMoves(squareInfo, pieceInfo, pieces);
        case "b":
            return getBishopCandidateMoves(squareInfo, pieceInfo, pieces);
        case "r":
            return getRookCandidateMoves(squareInfo, pieceInfo, pieces);
        case "q":
            return getQueenCandidateMoves(squareInfo, pieceInfo, pieces);
        case "k":
            return getKingCandidateMoves(squareInfo, pieceInfo, pieces, movedPieces);
        default:
            return [];
    }
};

export const getPawnCandidateMoves = (squareInfo: SquareInfo, pieceInfo: PieceInfo, pieces: Partial<Record<SquareId, PieceId>>, lastMove?: [SquareId, SquareId]): SquareId[] => {

    const isWhite = pieceInfo.colorName === 'w';
    const candidateMoves: SquareId[] = [];

    // candidates
    // 1 step forward
    const targetSquareFileIndex = squareInfo.fileIndex;
    const targetSquareRankIndex = squareInfo.rankIndex + (isWhite ? 1 : -1);
    const targetSquareId = asSquareId(targetSquareFileIndex, targetSquareRankIndex);
    const targetPieceId = pieces[targetSquareId];
    if (!targetPieceId) {
        candidateMoves.push(targetSquareId);
        // 2 step forward if on starting square
        if (squareInfo.rankName === (isWhite ? '2' : '7')) {
            const targetSquareFileIndex = squareInfo.fileIndex;
            const targetSquareRankIndex = squareInfo.rankIndex + (isWhite ? 2 : -2);
            const targetSquareId = asSquareId(targetSquareFileIndex, targetSquareRankIndex);
            const targetPieceId = pieces[targetSquareId];
            if (!targetPieceId) {
                candidateMoves.push(targetSquareId);
            }
        }
    }

    // capture diagonally
    [1, -1].forEach(side => {
        const targetSquareFileIndex = squareInfo.fileIndex + side;
        const targetSquareRankIndex = squareInfo.rankIndex + (isWhite ? 1 : -1);
        const targetSquareId = asSquareId(targetSquareFileIndex, targetSquareRankIndex);
        const targetPieceId = pieces[targetSquareId];
        if (targetPieceId) {
            const targetPieceInfo = asPieceInfo(targetPieceId);
            if (targetPieceInfo.colorName !== pieceInfo.colorName) {
                candidateMoves.push(targetSquareId);
            }
        }
    })
    // en passant
    const enPassantCandidateMoves: SquareId[] = getEnPassantCandidateMoves(squareInfo, pieceInfo, pieces, lastMove);
    candidateMoves.push(...enPassantCandidateMoves);

    return candidateMoves;
};

export const getEnPassantCandidateMoves = (
    squareInfo: SquareInfo,
    pieceInfo: PieceInfo,
    pieces: Partial<Record<SquareId, PieceId>>,
    lastMove?: [SquareId, SquareId],
): SquareId[] => {

    const isWhite = pieceInfo.colorName === 'w';

    const enPassantCandidateMoves: SquareId[] = [];
    if (!lastMove) {
        return enPassantCandidateMoves;
    }

    const lastMoveSourceId = lastMove[0];
    const lastMoveSourceSquareInfo = asSquareInfo(lastMoveSourceId);
    const lastMoveTargetId = lastMove[1];
    const lastMoveTargetSquareInfo = asSquareInfo(lastMoveTargetId);
    const lastMovePieceId = pieces[lastMoveTargetId];
    if (!lastMovePieceId) {
        return enPassantCandidateMoves;
    }

    const lastMovePieceInfo = asPieceInfo(lastMovePieceId);

    // check if last move is a 2 step pawn move (of opponents color)
    if (lastMovePieceInfo.pieceName !== 'p') {
        return enPassantCandidateMoves;
    }
    if (lastMovePieceInfo.colorName === pieceInfo.colorName) {
        return enPassantCandidateMoves;
    }
    if (lastMoveSourceSquareInfo.rankName !== (isWhite ? '7' : '2')) {
        return enPassantCandidateMoves;
    }
    if (lastMoveTargetSquareInfo.rankName !== (isWhite ? '5' : '4')) {
        return enPassantCandidateMoves;
    }

    // check if we are in a position to capture en passant
    if (pieceInfo.pieceName !== 'p') {
        return enPassantCandidateMoves;
    }
    if (squareInfo.rankName !== (isWhite ? '5' : '4')) {
        return enPassantCandidateMoves;
    }

    // check if our position is in a position to capture en passant
    [1, -1].forEach(side => {
        const neighborSquareId = asSquareId(squareInfo.fileIndex + side, squareInfo.rankIndex);
        if (neighborSquareId === lastMoveTargetId) {
            const enPassantTargetRankIndex = isWhite ? squareInfo.rankIndex + 1 : squareInfo.rankIndex - 1;
            const enPassantTargetSquareId = asSquareId(lastMoveTargetSquareInfo.fileIndex, enPassantTargetRankIndex);
            enPassantCandidateMoves.push(enPassantTargetSquareId);
        }
    });
    return enPassantCandidateMoves;
};

export const getKnightCandidateMoves = (squareInfo: SquareInfo, pieceInfo: PieceInfo, pieces: Partial<Record<SquareId, PieceId>>): SquareId[] => {

    const offsets = [
        [[2, 1]],
        [[2, -1]],
        [[1, 2]],
        [[1, -2]],
        [[-1, 2]],
        [[-1, -2]],
        [[-2, 1]],
        [[-2, -1]],
    ];
    return getCandidateMovesForOffsets(squareInfo, pieceInfo, pieces, offsets);
};

export const getBishopCandidateMoves = (squareInfo: SquareInfo, pieceInfo: PieceInfo, pieces: Partial<Record<SquareId, PieceId>>): SquareId[] => {

    const offsets = [
        [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
        [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
        [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
        [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
    ];
    return getCandidateMovesForOffsets(squareInfo, pieceInfo, pieces, offsets);
};

export const getRookCandidateMoves = (squareInfo: SquareInfo, pieceInfo: PieceInfo, pieces: Partial<Record<SquareId, PieceId>>): SquareId[] => {

    const offsets = [
        [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
        [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]],
        [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
        [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]],
    ];
    return getCandidateMovesForOffsets(squareInfo, pieceInfo, pieces, offsets);
};

export const getQueenCandidateMoves = (squareInfo: SquareInfo, pieceInfo: PieceInfo, pieces: Partial<Record<SquareId, PieceId>>): SquareId[] => {

    const offsets = [
        [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
        [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]],
        [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
        [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]],
        [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
        [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
        [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
        [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
    ];
    return getCandidateMovesForOffsets(squareInfo, pieceInfo, pieces, offsets);
};

export const getKingCandidateMoves = (
    squareInfo: SquareInfo,
    pieceInfo: PieceInfo,
    pieces: Partial<Record<SquareId, PieceId>>,
    movedPieces: PieceId[],
): SquareId[] => {

    const isWhite = pieceInfo.colorName === 'w';

    const offsets = [
        [[0, 1]],
        [[0, -1]],
        [[1, 0]],
        [[-1, 0]],
        [[1, 1]],
        [[1, -1]],
        [[-1, 1]],
        [[-1, -1]],
    ];

    // must not have moved
    const hasKingMoved = movedPieces.indexOf(pieceInfo.id) >= 0;
    // if (hasKingMoved) {
    //     console.log(`king ${pieceInfo.id} has moved`, movedPieces);
    // }
    const hasQueenSideRookMoved = movedPieces.indexOf(isWhite ? 'wr1' : 'wr2') >= 0;
    // if (hasQueenSideRookMoved) {
    //     console.log(`queen side rook ${isWhite ? 'wr1' : 'wr2'} has moved`, movedPieces);
    // }
    const hasKingSideRookMoved = movedPieces.indexOf(isWhite ? 'br1' : 'br2') >= 0;
    // if (hasKingSideRookMoved) {
    //     console.log(`king side rook ${isWhite ? 'br1' : 'br2'} has moved`, movedPieces);
    // }

    // must have empty squares between king and rook to castle
    const queenSideSquareIds: SquareId[] = isWhite ? castelingSquareIds.white.queenSide.middleSquares : castelingSquareIds.black.queenSide.middleSquares;
    const kingSideSquareIds: SquareId[] = isWhite ? castelingSquareIds.white.kingSide.middleSquares : castelingSquareIds.black.kingSide.middleSquares;

    // count non empty squares between king and rook to castle
    const nonEmptyQueenSideSquares = queenSideSquareIds.reduce((acc, squareId) => acc + (pieces[squareId] ? 1 : 0), 0);
    const nonEmptyKingSideSquares = kingSideSquareIds.reduce((acc, squareId) => acc + (pieces[squareId] ? 1 : 0), 0);

    // TODO check if squares or king is in check
    if (!hasKingMoved && !hasQueenSideRookMoved && nonEmptyQueenSideSquares === 0) offsets.push([[-2, 0]]);
    if (!hasKingMoved && !hasKingSideRookMoved && nonEmptyKingSideSquares === 0) offsets.push([[2, 0]]);

    return getCandidateMovesForOffsets(squareInfo, pieceInfo, pieces, offsets);
};

export const getCandidateMovesForOffsets = (squareInfo: SquareInfo, pieceInfo: PieceInfo, pieces: Partial<Record<SquareId, PieceId>>, offsets: number[][][]): SquareId[] => {
    const candidateMoves: SquareId[] = [];
    for (const offsetDirection of offsets) {
        for (const offsetStep of offsetDirection) {
            const fileIndex = squareInfo.fileIndex + offsetStep[0];
            const rankIndex = squareInfo.rankIndex + offsetStep[1];
            if (fileIndex < 0 || fileIndex > 7 || rankIndex < 0 || rankIndex > 7) {
                // we're out of bounds
                // stop checking this direction
                break;
            }
            const newSquareId = asSquareId(fileIndex, rankIndex);
            const targetPieceId = pieces[newSquareId];
            if (targetPieceId) {
                const targetPieceInfo = asPieceInfo(targetPieceId);
                if (targetPieceInfo.colorName === pieceInfo.colorName) {
                    // can't move to square with own piece
                    // stop checking this direction
                    break;
                } else {
                    // can capture opponent's piece
                    // stop checking this direction
                    candidateMoves.push(newSquareId);
                    break;
                }
            }
            // can move to empty square
            candidateMoves.push(newSquareId);
        }
    }
    return candidateMoves;
};

