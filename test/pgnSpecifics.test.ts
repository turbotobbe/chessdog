import { expect, test } from 'vitest'
import { parsePgn, parseMove, PgnTurn } from '../src/utils/pgn'
import { getDefaultBoard, movePiece } from '../src/utils/board'
import {  BoardState } from '../src/models/BoardState';
import { SquareId } from '../src/types/chess';
function checkMoves(boards: BoardState[], turns: PgnTurn[], expecteds: string[][]) {
    // expect(turns.length).toBe(expecteds.length/2)
    console.log(turns);
    try {
        turns.forEach((turn, index) => {

            // white move is required
            let expected = expecteds[index * 2];
            {
                const { sourceSquareId, targetSquareId } = parseMove(boards[boards.length - 1], turn.white.move);
                expect(sourceSquareId).toBe(expected[0])
                expect(targetSquareId).toBe(expected[1])
    
                const newBoard = movePiece(boards[boards.length - 1], sourceSquareId as SquareId, targetSquareId as SquareId);
                boards.push(newBoard);
            }

            // black move is optional
            expected = expecteds[(index * 2)+1];
            if (expected) {
                const { sourceSquareId, targetSquareId } = parseMove(boards[boards.length - 1], turn.black.move);
                expect(sourceSquareId).toBe(expected[0])
                expect(targetSquareId).toBe(expected[1])
    
                const newBoard = movePiece(boards[boards.length - 1], sourceSquareId as SquareId, targetSquareId as SquareId);
                boards.push(newBoard);
            }
    
        });
    } catch (e) {
        console.log(e)
        return false
    }
    return true
}

test('validate basic pawn movement', () => {
    const boards = [getDefaultBoard()];
    const pgnGame = parsePgn('1. e4 1... e5 2. d4 2... d5')
    const expecteds = [
        ['e2', 'e4'],
        ['e7', 'e5'],
        ['d2', 'd4'],
        ['d7', 'd5']
    ]
    const isValid = checkMoves(boards, pgnGame.turns, expecteds)
    expect(isValid).toBe(true)
})

test('validate illegal pawn movement', () => {
    const boards = [getDefaultBoard()];
    const pgnGame = parsePgn('1. e4 1... e5 2. d5') // Pawn moving two squares after first move
    const expecteds = [
        ['e2', 'e4'],
        ['e7', 'e5'],
        ['d2', 'd5'],
        ['d7', 'd5']
    ]
    const isValid = checkMoves(boards, pgnGame.turns, expecteds)
    expect(isValid).toBe(false)
})

test('validate basic knight movement', () => {
    const boards = [getDefaultBoard()];
    const pgnGame = parsePgn('1. Nf3 1... Nc6')
    const expecteds = [
        ['g1', 'f3'],
        ['b8', 'c6'],
    ]
    const isValid = checkMoves(boards, pgnGame.turns, expecteds)
    expect(isValid).toBe(true)
})

test('validate illegal knight movement', () => {
    const boards = [getDefaultBoard()];
    const pgnGame = parsePgn('1. Ng3') // Knight can't move to g3 from starting position
    const expecteds = []
    const isValid = checkMoves(boards, pgnGame.turns, expecteds)
    expect(isValid).toBe(false)
})

test('validate king side castling', () => {
    const boards = [getDefaultBoard()];
    const pgnGame = parsePgn('1. e4 1... e5 2. Nf3 2... Nc6 3. Bc4 3... Bc5 4. O-O 4... O-O')
    const expecteds = [
        ['e2', 'e4'],
        ['e7', 'e5'],
        ['g1', 'f3'],
        ['b8', 'c6'],
        ['f1', 'c4'],
        ['f8', 'c5'],
        ['e1', 'g1'],
    ]
    const isValid = checkMoves(boards, pgnGame.turns, expecteds)
    expect(isValid).toBe(true)
})

test('validate queen side castling', () => {
    const boards = [getDefaultBoard()];
    const pgnGame = parsePgn('1. d4 1... d5 2. Nc3 2... Nc6 3. Bf4 3... Bf5 4. Qd2 4... Qd7 5. O-O-O 5... O-O-O')
    const expecteds = [
        ['d2', 'd4'],
        ['d7', 'd5'],
        ['b1', 'c3'],
        ['b8', 'c6'],
        ['c1', 'f4'],
        ['c8', 'f5'],
        ['d1', 'd2'],
        ['d8', 'd7'],
        ['e1', 'c1'],
        ['e8', 'c8'],
    ]
    const isValid = checkMoves(boards, pgnGame.turns, expecteds)
    expect(isValid).toBe(true)
})

// test('validate illegal castling through check', () => {
//     const pgnGame = parsePgn('1. e4 e5 2. Bc4 Bc5 3. Qh5 g6 4. Qf3 Nf6 5. O-O') // White can't castle through check
//     const isValid = validateChessRules(pgnGame.turns)
//     expect(isValid).toBe(false)
// })

// test('validate en passant', () => {
//     const pgnGame = parsePgn('1. e4 d6 2. e5 f5 3. exf6')
//     const isValid = validateChessRules(pgnGame.turns)
//     expect(isValid).toBe(true)
// })

// test('validate illegal en passant', () => {
//     const pgnGame = parsePgn('1. e4 d6 2. e5 f5 3. d4 g6 4. exf6') // En passant only valid immediately after pawn's two-square advance
//     const isValid = validateChessRules(pgnGame.turns)
//     expect(isValid).toBe(false)
// })

// test('validate pawn promotion', () => {
//     const pgnGame = parsePgn('1. e4 d5 2. exd5 c6 3. dxc6 Nf6 4. cxb7 Nbd7 5. bxa8=Q')
//     const isValid = validateChessRules(pgnGame.turns)
//     expect(isValid).toBe(true)
// })

// test('validate illegal pawn promotion', () => {
//     const pgnGame = parsePgn('1. e4 d5 2. exd5 c6 3. dxc6 Nf6 4. c7 Nbd7 5. c8=N') // Pawn can't promote to knight from c7
//     const isValid = validateChessRules(pgnGame.turns)
//     expect(isValid).toBe(false)
// })
