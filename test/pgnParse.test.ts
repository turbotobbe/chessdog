import { expect, test } from 'vitest'
import { parsePgn } from '../src/utils/pgn'
import fs from 'fs' 

const archiveContent = fs.readFileSync('./test/archive-2024-09.json', 'utf8');
const archiveData = JSON.parse(archiveContent);

test('archive data is valid', () => {
    expect(archiveData).toBeDefined();
    expect(archiveData.games).toBeDefined();
    expect(Array.isArray(archiveData.games)).toBe(true);
    expect(archiveData.games.length).toBeGreaterThan(0);
});

archiveData.games.forEach((game, index) => {
    test(`parse pgn for game ${index + 1}`, () => {
        expect(game.pgn).toBeDefined();
        const pgnGame = parsePgn(game.pgn);
        expect(pgnGame.turns.length).toBeGreaterThan(0);
        expect(pgnGame.headers.white).toBeTruthy();
        expect(pgnGame.headers.black).toBeTruthy();
        expect(pgnGame.headers.date).toBeTruthy();
        expect(pgnGame.headers.result).toBeTruthy();
    });
});

test('try to parse "a.pgn" file', () => {

    const file = 'a.pgn';
    const content = fs.readFileSync(`./test/pgns/${file}`, 'utf8');
    const pgnGame = parsePgn(content);
    expect(pgnGame.turns.length).toBeGreaterThan(0);
    expect(pgnGame.headers.white).toBe("PhonkCheck");
    expect(pgnGame.headers.black).toBe("hanc345");
    expect(pgnGame.headers.date).toBe("2024.09.01");
    expect(pgnGame.headers.result).toBe("1-0");
})

test('try to parse "b.pgn" file', () => {

    const file = 'b.pgn';
    const content = fs.readFileSync(`./test/pgns/${file}`, 'utf8');
    const pgnGame = parsePgn(content);
    expect(pgnGame.turns.length).toBeGreaterThan(0);
    expect(pgnGame.headers.white).toBe("Phil0059");
    expect(pgnGame.headers.black).toBe("PhonkCheck");
    expect(pgnGame.headers.date).toBe("2024.09.11");
    expect(pgnGame.headers.result).toBe("1-0");
})

test('try to parse "c.pgn" file', () => {

    const file = 'c.pgn';
    const content = fs.readFileSync(`./test/pgns/${file}`, 'utf8');
    const pgnGame = parsePgn(content);
    expect(pgnGame.turns.length).toBeGreaterThan(0);
    expect(pgnGame.headers.white).toBe("jseales04");
    expect(pgnGame.headers.black).toBe("PhonkCheck");
    expect(pgnGame.headers.date).toBe("2024.09.01");
    expect(pgnGame.headers.result).toBe("0-1");
})