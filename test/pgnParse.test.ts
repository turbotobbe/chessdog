import { expect, test } from 'vitest'
import { movesToString, parsePgn, tokenize, tokensToMoves } from '../src/utils/pgn'
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
        expect(pgnGame.headers['White']).toBeTruthy();
        expect(pgnGame.headers['Black']).toBeTruthy();
        expect(pgnGame.headers['Date']).toBeTruthy();
        expect(pgnGame.headers['Result']).toBeTruthy();
    });
});

test('try to parse "a.pgn" file', () => {

    const file = 'a.pgn';
    const content = fs.readFileSync(`./test/pgns/${file}`, 'utf8');
    const pgnGame = parsePgn(content);
    expect(pgnGame.turns.length).toBeGreaterThan(0);
    expect(pgnGame.headers['White']).toBe("PhonkCheck");
    expect(pgnGame.headers['Black']).toBe("hanc345");
    expect(pgnGame.headers['Date']).toBe("2024.09.01");
    expect(pgnGame.headers['Result']).toBe("1-0");
})

test('try to parse "b.pgn" file', () => {

    const file = 'b.pgn';
    const content = fs.readFileSync(`./test/pgns/${file}`, 'utf8');
    const pgnGame = parsePgn(content);
    expect(pgnGame.turns.length).toBeGreaterThan(0);
    expect(pgnGame.headers['White']).toBe("Phil0059");
    expect(pgnGame.headers['Black']).toBe("PhonkCheck");
    expect(pgnGame.headers['Date']).toBe("2024.09.11");
    expect(pgnGame.headers['Result']).toBe("1-0");
})

test('try to parse "c.pgn" file', () => {

    const file = 'c.pgn';
    const content = fs.readFileSync(`./test/pgns/${file}`, 'utf8');
    const pgnGame = parsePgn(content);
    expect(pgnGame.turns.length).toBeGreaterThan(0);
    expect(pgnGame.headers['White']).toBe("jseales04");
    expect(pgnGame.headers['Black']).toBe("PhonkCheck");
    expect(pgnGame.headers['Date']).toBe("2024.09.01");
    expect(pgnGame.headers['Result']).toBe("0-1");
})

test('parse pgn', () => {
    const pgn = [
        "1. e2",
        "1... e3 {comment for line 1. and 1... e3}",
        "2. e2 {line 2. e2 {nested}} {line 3. with {more} nesting}",
        "2... a3 {[%clk 0:00:00]} {[%marks a1 a2 a3]} {[%arrow a1 a2]}",
        "1-0"].join(' ');
    const tokens = tokenize(pgn);
    const { moves, result } = tokensToMoves(tokens);
    expect(moves.length).toBe(4);
    
    expect(moves[0].index).toBe(1);
    expect(moves[0].isWhite).toBe(true);
    expect(moves[0].pgn).toBe("e2");
    expect(moves[0].comments?.length).toBe(0);
    expect(moves[0].clock).toBe(undefined);
    expect(moves[0].marks?.length).toBe(0);
    expect(moves[0].arrows?.length).toBe(0);

    expect(moves[1].index).toBe(1);
    expect(moves[1].isWhite).toBe(false);
    expect(moves[1].pgn).toBe("e3");
    expect(moves[1].comments?.length).toBe(1);
    expect(moves[1].comments?.[0]).toBe("comment for line 1. and 1... e3");
    expect(moves[1].clock).toBe(undefined);
    expect(moves[1].marks?.length).toBe(0);
    expect(moves[1].arrows?.length).toBe(0);
    
    expect(moves[2].index).toBe(2);
    expect(moves[2].isWhite).toBe(true);
    expect(moves[2].pgn).toBe("e2");
    expect(moves[2].comments?.length).toBe(2);
    expect(moves[2].comments?.[0]).toBe("line 2. e2 {nested}");
    expect(moves[2].comments?.[1]).toBe("line 3. with {more} nesting");
    expect(moves[2].clock).toBe(undefined);
    expect(moves[2].marks?.length).toBe(0);
    expect(moves[2].arrows?.length).toBe(0);
    
    expect(moves[3].index).toBe(2);
    expect(moves[3].isWhite).toBe(false);
    expect(moves[3].pgn).toBe("a3");
    expect(moves[3].comments?.length).toBe(0);
    expect(moves[3].clock).toBe("0:00:00");
    expect(moves[3].marks?.length).toBe(3);
    expect(moves[3].marks?.[0]).toBe("a1");
    expect(moves[3].marks?.[1]).toBe("a2");
    expect(moves[3].marks?.[2]).toBe("a3");
    expect(moves[3].arrows?.length).toBe(1);
    expect(moves[3].arrows?.[0].fromSquareId).toBe("a1");
    expect(moves[3].arrows?.[0].toSquareId).toBe("a2");

    expect(result).toBe("1-0");
});

test('parse game', () => {
    const pgn = [
        "[Event \"Let's Play!\"]",
        "[Site \"Chess.com\"]",
        "[Date \"2024.09.27\"]",
        "[Round \"1\"]",
        "[White \"PhonkCheck\"]",
        "[Black \"misskittysmom\"]",
        "[Result \"*\"]",
        "[CurrentPosition \"r3r1k1/pp1n1ppp/3b2q1/8/5PQ1/2B3K1/P1P3PP/R3R3 w - - 0 21\"]",
        "[Timezone \"UTC\"]",
        "[ECO \"B21\"]",
        "[ECOUrl \"https://www.chess.com/openings/Sicilian-Defense-McDonnell-Tal-Gambit\"]",
        "[UTCDate \"2024.09.27\"]",
        "[UTCTime \"15:21:27\"]",
        "[WhiteElo \"1181\"]",
        "[BlackElo \"1239\"]",
        "[TimeControl \"1/86400\"]",
        "[StartTime \"15:21:27\"]",
        "[Link \"https://www.chess.com/game/daily/708525085\"]",
        "",
        "1. e4 {[%clk 23:59:44]} 1... c5 {[%clk 23:57:46]} 2. f4 {[%clk 23:58:59]} 2... d5 {[%clk 21:23:43]} 3. exd5 {[%clk 23:57:05]} 3... Nf6 {[%clk 23:57:57]} 4. Nc3 {[%clk 23:48:54]} 4... Nxd5 {[%clk 23:39:18]} 5. d4 {[%clk 19:54:47]} 5... Nxc3 {[%clk 22:01:10]} 6. bxc3 {[%clk 17:24:13]} 6... Qa5 {[%clk 17:00:20]} 7. Bd2 {[%clk 22:22:43]} 7... e6 {[%clk 23:59:17]} 8. Nf3 {[%clk 23:57:31]} 8... Bd6 {[%clk 23:53:53]} 9. c4 {[%clk 23:59:07]} 9... Qa3 {[%clk 23:56:32]} 10. d5 {[%clk 9:59:12]} 10... O-O {[%clk 21:00:40]} 11. Bd3 {[%clk 12:48:35]} 11... exd5 {[%clk 23:50:19]} 12. cxd5 {[%clk 0:00:00]} 12... Re8+ {[%clk 2:34:22]} 13. Kf2 {[%clk 18:53:49]} 13... c4 {[%clk 16:59:26]} 14. Bxc4 {[%clk 13:28:02]} 14... Qc5+ {[%clk 23:44:52]} 15. Kg3 {[%clk 11:00:03]} 15... Qxc4 {[%clk 23:46:07]} 16. Re1 {[%clk 6:57:08]} 16... Bd7 {[%clk 17:13:55]} 17. Ne5 {[%clk 22:06:07]} 17... Qxd5 {[%clk 23:31:11]} 18. Bc3 {[%clk 22:06:49]} 18... Qe6 {[%clk 23:27:56]} 19. Nxd7 {[%clk 22:59:26]} 19... Qg6+ {[%clk 23:44:08]} 20. Qg4 {[%clk 13:12:40]} 20... Nxd7 {[%clk 18:35:24]} *",
        ""].join('\n')
    const game = parsePgn(pgn);
    expect(game.turns.length).toBeGreaterThan(0);
    expect(game.headers['White']).toBe("PhonkCheck");
    expect(game.headers['Black']).toBe("misskittysmom");
    expect(game.headers['Date']).toBe("2024.09.27");
    expect(game.headers['Result']).toBe("*");
});

test('parse game from archive', () => {
    const pgn = [
        "[Event \"Live Chess\"]",
        "[Site \"Chess.com\"]",
        "[Date \"2024.09.04\"]",
        "[Round \"-\"]",
        "[White \"PhonkCheck\"]",
        "[Black \"gimeragi\"]",
        "[Result \"1-0\"]",
        "[CurrentPosition \"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3\"]",
        "[Timezone \"UTC\"]",
        "[ECO \"B00\"]",
        "[ECOUrl \"https://www.chess.com/openings/Kings-Pawn-Opening\"]",
        "[UTCDate \"2024.09.04\"]",
        "[UTCTime \"22:04:52\"]",
        "[WhiteElo \"869\"]",
        "[BlackElo \"1035\"]",
        "[TimeControl \"600\"]",
        "[Termination \"PhonkCheck won - game abandoned\"]",
        "[StartTime \"22:04:52\"]",
        "[EndDate \"2024.09.04\"]",
        "[EndTime \"22:05:33\"]",
        "[Link \"https://www.chess.com/game/live/119226579611\"]",
        "1. e4 {[%clk 0:09:52]} 1-0",
        ""
    ].join('\n');
    const game = parsePgn(pgn);
    expect(game.turns.length).toBe(1);
    expect(game.headers['White']).toBe("PhonkCheck");
    expect(game.headers['Black']).toBe("gimeragi");
    expect(game.headers['Date']).toBe("2024.09.04");
    expect(game.headers['Result']).toBe("1-0");
    expect(game.turns[0].white.pgn).toBe("e4");
    expect(game.turns[0].white.index).toBe(1);
    expect(game.turns[0].white.isWhite).toBe(true);
    expect(game.turns[0].white.clock).toBe("0:09:52");
    expect(game.turns[0].white.comments?.length).toBe(0);
    expect(game.turns[0].white.marks?.length).toBe(0);
    expect(game.turns[0].white.arrows?.length).toBe(0);
    expect(game.turns[0].black).toBe(undefined);
});