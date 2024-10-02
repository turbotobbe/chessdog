import { expect, test } from "vitest";
import { loadBoardState } from "../src/models/BoardState";
import { parsePgn } from "../src/utils/pgn";

test('empty board state', () => {
    const boardStates = loadBoardState([]);
    expect(boardStates.nodes.length).toBe(0);
});

test('single move', () => {
    const pgnGame = parsePgn("1. e4");
    console.log(pgnGame);
    const boardStates = loadBoardState([pgnGame]);
    console.log(boardStates);

    let node = boardStates.nodes[0];
    expect(node.sourceSquareId).toBe("e2");
    expect(node.targetSquareId).toBe("e4");
    expect(node.pgn).toBe("e4");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(0);
});


test('single line', () => {
    const pgnGame = parsePgn("1. e4 1... e5 2. d4 2... d5");
    console.log(pgnGame);
    const boardStates = loadBoardState([pgnGame]);
    console.log(boardStates);

    let node = boardStates.nodes[0];
    expect(node.sourceSquareId).toBe("e2");
    expect(node.targetSquareId).toBe("e4");
    expect(node.pgn).toBe("e4");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(1);

    node = boardStates.nodes[0].nodes[0];
    expect(node.sourceSquareId).toBe("e7");
    expect(node.targetSquareId).toBe("e5");
    expect(node.pgn).toBe("e5");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(1);

    node = boardStates.nodes[0].nodes[0].nodes[0];
    expect(node.sourceSquareId).toBe("d2");
    expect(node.targetSquareId).toBe("d4");
    expect(node.pgn).toBe("d4");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(1);

    node = boardStates.nodes[0].nodes[0].nodes[0].nodes[0];
    expect(node.sourceSquareId).toBe("d7");
    expect(node.targetSquareId).toBe("d5");
    expect(node.pgn).toBe("d5");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(0);
});

test('double line', () => {
    const pgnGame = parsePgn("1. e4 1... e5 2. d4 2... d5");
    const pgnGame2 = parsePgn("1. e4 1... e5 2. Nf3 2... Nc6 3. Bc4");
    console.log(pgnGame);
    const boardStates = loadBoardState([pgnGame, pgnGame2]);
    console.log(boardStates);
    console.log(JSON.stringify(boardStates, null, 2));

    let node = boardStates.nodes[0];
    expect(node.sourceSquareId).toBe("e2");
    expect(node.targetSquareId).toBe("e4");
    expect(node.pgn).toBe("e4");
    expect(node.index).toBe(0);
    expect(node.count).toBe(2);
    expect(node.nodes.length).toBe(1);

    node = boardStates.nodes[0].nodes[0];
    expect(node.sourceSquareId).toBe("e7");
    expect(node.targetSquareId).toBe("e5");
    expect(node.pgn).toBe("e5");
    expect(node.index).toBe(0);
    expect(node.count).toBe(2);
    expect(node.nodes.length).toBe(2);

    node = boardStates.nodes[0].nodes[0].nodes[0];
    expect(node.sourceSquareId).toBe("d2");
    expect(node.targetSquareId).toBe("d4");
    expect(node.pgn).toBe("d4");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(1);

    node = boardStates.nodes[0].nodes[0].nodes[0].nodes[0];
    expect(node.sourceSquareId).toBe("d7");
    expect(node.targetSquareId).toBe("d5");
    expect(node.pgn).toBe("d5");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(0);

    node = boardStates.nodes[0].nodes[0].nodes[1];
    expect(node.sourceSquareId).toBe("g1");
    expect(node.targetSquareId).toBe("f3");
    expect(node.pgn).toBe("Nf3");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(1);

    node = boardStates.nodes[0].nodes[0].nodes[1].nodes[0];
    expect(node.sourceSquareId).toBe("b8");
    expect(node.targetSquareId).toBe("c6");
    expect(node.pgn).toBe("Nc6");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(1);

    node = boardStates.nodes[0].nodes[0].nodes[1].nodes[0].nodes[0];
    expect(node.sourceSquareId).toBe("f1");
    expect(node.targetSquareId).toBe("c4");
    expect(node.pgn).toBe("Bc4");
    expect(node.index).toBe(0);
    expect(node.count).toBe(1);
    expect(node.nodes.length).toBe(0);
});