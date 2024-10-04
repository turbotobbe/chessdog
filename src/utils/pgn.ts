// [Event "Let's Play"]
// [Site "Chess.com"]
// [Date "2024.09.11"]
// [Round "-"]
// [White "Phil0059"]
// [Black "PhonkCheck"]
// [Result "1-0"]
// [CurrentPosition "7k/6Q1/5K2/8/p7/P7/1P6/8 b - - 10 56"]
// [Timezone "UTC"]
// [ECO "C45"]
// [ECOUrl "https://www.chess.com/openings/Scotch-Game-Classical-Variation-5.Be3"]
// [UTCDate "2024.09.11"]
// [UTCTime "09:07:02"]
// [WhiteElo "1333"]
// [BlackElo "1177"]
// [TimeControl "1/86400"]
// [Termination "Phil0059 won by checkmate"]
// [StartTime "09:07:02"]
// [EndDate "2024.09.21"]
// [EndTime "12:48:11"]
// [Link "https://www.chess.com/game/daily/701520345"]

import { ChessGameState } from "@/models/chess";
import { squareIds, SquareId, PieceName } from "@/types/chess";

// 1. e4 {[%clk 23:59:50]} 1... e5 {[%clk 23:53:40]} 2. Nf3 {[%clk 22:42:35]} 2... Nc6 {[%clk 23:01:16]} 3. d4 {[%clk 23:41:22]} 3... exd4 {[%clk 14:49:21]} 4. Nxd4 {[%clk 14:00:58]} 4... Bc5 {[%clk 22:41:23]} 5. Be3 {[%clk 18:17:35]} 5... d6 {[%clk 2:06:15]} 6. Bc4 {[%clk 23:13:38]} 6... Nf6 {[%clk 23:23:00]} 7. Qd3 {[%clk 23:39:31]} 7... Nb4 {[%clk 18:22:02]} 8. Qb3 {[%clk 23:10:35]} 8... O-O {[%clk 23:49:27]} 9. Nd2 {[%clk 13:17:23]} 9... d5 {[%clk 23:45:10]} 10. exd5 {[%clk 18:00:30]} 10... Nfxd5 {[%clk 22:41:40]} 11. a3 {[%clk 22:41:20]} 11... Bxd4 {[%clk 23:37:20]} 12. Bxd4 {[%clk 21:47:23]} 12... Nc6 {[%clk 22:53:25]} 13. Bxg7 {[%clk 23:33:16]} 13... Re8+ {[%clk 23:57:34]} 14. Kd1 {[%clk 23:56:00]} 14... Kxg7 {[%clk 23:56:15]} 15. Bxd5 {[%clk 23:56:49]} 15... Bg4+ {[%clk 23:37:57]} 16. f3 {[%clk 23:53:34]} 16... Be6 {[%clk 23:51:18]} 17. Qc3+ {[%clk 23:50:49]} 17... Kf8 {[%clk 23:56:59]} 18. Bxc6 {[%clk 23:57:08]} 18... bxc6 {[%clk 23:58:37]} 19. Qh8+ {[%clk 23:57:32]} 19... Ke7 {[%clk 21:22:09]} 20. Qxh7 {[%clk 17:31:01]} 20... Qd4 {[%clk 23:08:01]} 21. c3 {[%clk 20:34:02]} 21... Rh8 {[%clk 19:41:46]} 22. Qxf7+ {[%clk 23:36:16]} 22... Bxf7 {[%clk 22:58:25]} 23. Re1+ {[%clk 23:20:37]} 23... Kf6 {[%clk 22:06:05]} 24. cxd4 {[%clk 23:56:51]} 24... Bd5 {[%clk 22:38:58]} 25. h3 {[%clk 14:04:41]} 25... Rh4 {[%clk 23:26:30]} 26. Ne4+ {[%clk 22:41:47]} 26... Kg6 {[%clk 11:36:18]} 27. Kd2 {[%clk 14:17:15]} 27... a5 {[%clk 23:56:19]} 28. Kc3 {[%clk 22:21:10]} 28... a4 {[%clk 20:50:18]} 29. Nc5 {[%clk 23:06:26]} 29... Kf5 {[%clk 17:24:04]} 30. Re7 {[%clk 23:20:23]} 30... Ra7 {[%clk 11:46:58]} 31. Rae1 {[%clk 23:41:11]} 31... Kf4 {[%clk 23:53:51]} 32. Rg7 {[%clk 23:50:58]} 32... Kf5 {[%clk 20:31:18]} 33. Ree7 {[%clk 22:31:14]} 33... Kf6 {[%clk 14:37:14]} 34. Rxc7 {[%clk 16:10:29]} 34... Rxc7 {[%clk 22:52:05]} 35. Rxc7 {[%clk 22:18:54]} 35... Rh8 {[%clk 13:47:59]} 36. Nd7+ {[%clk 23:42:15]} 36... Kg6 {[%clk 23:58:41]} 37. Ne5+ {[%clk 23:58:57]} 37... Kf6 {[%clk 23:59:31]} 38. Nxc6 {[%clk 23:59:47]} 38... Bxc6 {[%clk 21:32:48]} 39. Rxc6+ {[%clk 23:44:51]} 39... Kf5 {[%clk 23:59:21]} 40. d5 {[%clk 23:55:36]} 40... Ke5 {[%clk 23:57:13]} 41. Kc4 {[%clk 23:49:10]} 41... Rh4+ {[%clk 16:23:14]} 42. g4 {[%clk 23:49:18]} 42... Rxh3 {[%clk 23:07:34]} 43. d6 {[%clk 21:12:43]} 43... Rxf3 {[%clk 16:29:28]} 44. d7 {[%clk 22:06:00]} 44... Rf4+ {[%clk 23:52:49]} 45. Kb5 {[%clk 22:57:04]} 45... Rd4 {[%clk 15:33:12]} 46. Rc7 {[%clk 22:52:11]} 46... Kf6 {[%clk 23:58:44]} 47. g5+ {[%clk 23:56:09]} 47... Kxg5 {[%clk 23:59:32]} 48. Kc6 {[%clk 23:59:01]} 48... Rc4+ {[%clk 23:51:22]} 49. Kd5 {[%clk 23:59:11]} 49... Rxc7 {[%clk 23:57:49]} 50. d8=Q+ {[%clk 23:31:55]} 50... Kf5 {[%clk 22:22:44]} 51. Qxc7 {[%clk 23:38:32]} 51... Kf6 {[%clk 21:48:49]} 52. Qe5+ {[%clk 23:10:51]} 52... Kg6 {[%clk 23:59:27]} 53. Ke6 {[%clk 23:58:21]} 53... Kh6 {[%clk 23:49:52]} 54. Kf6 {[%clk 23:58:04]} 54... Kh7 {[%clk 23:46:51]} 55. Qg5 {[%clk 23:41:13]} 55... Kh8 {[%clk 23:47:08]} 56. Qg7# {[%clk 23:59:33]} 1-0

export interface PgnHeader {
    date: string;
    white: string;
    black: string;
    result: string;
}

export interface PgnMove {
    move: string;
    clk: string;
}

export interface PgnTurn {
    white: PgnMove;
    black: PgnMove;
}

export interface PgnGame {
    headers: PgnHeader;
    turns: PgnTurn[];
}

export function fixPgn(pgn: string ): string {
    let newPgn = pgn.replace(/(\d+)\.(\S+)\s+(\S+)/g, '$1. $2 $1... $3')
    // Replace last move number if it exists
    newPgn = newPgn.replace(/(\d+)\.\s*(\S+)\s*$/g, '$1. $2');
    console.log(pgn, 'XXXXX', newPgn)
    return newPgn;
}   

export function parsePgn(content: string): PgnGame {
    // console.log(content)
    const game: PgnGame = {
        headers: {
            date: '',
            white: '',
            black: '',
            result: ''
        },
        turns: []
    };

    // Split the content on empty lines
    const sections = content.split(/\n\s*\n/);
    const headerSection = sections[0].trim();

    const headerRegex = /\[(.*?)\s+"(.*?)"\]/g;
    let match;
    while ((match = headerRegex.exec(headerSection)) !== null) {
        const key = match[1].trim();
        const value = match[2];
        if (key === 'Date') {
            game.headers.date = value;
        } else if (key === 'White') {
            game.headers.white = value;
        } else if (key === 'Black') {
            game.headers.black = value;
        } else if (key === 'Result') {
            game.headers.result = value;
        }
    }

    const moveSection = sections[sections.length - 1].trim();

    // Split the moves on valid move numbers (1. or 1...)
    const turns = moveSection.split(/\d+\.{1,3} /).filter(Boolean);
    let isWhite = true;
    for (const turn of turns) {
        const move: PgnMove = {
            move: '',
            clk: ''
        };

        // extract the step and comment from the current step
        const [_, moveStr, clkStr] = turn.trim().match(/(.*)\s+\{\[%clk\s+(.+)\]\}/) || [];
        if (moveStr) {
            move.move = moveStr;
            move.clk = clkStr;
        } else {
            // extract the step
            const [_, moveStr] = turn.trim().match(/(.*)/) || [];
            if (moveStr.length) {
                move.move = moveStr;
                move.clk = '';
            } else {
                throw new Error('Invalid move');
            }
        }

        if (isWhite) {
            game.turns.push({ white: move, black: { move: '', clk: '' } });
        } else {
            game.turns[game.turns.length - 1].black = move;
        }
        isWhite = !isWhite;
    }

    return game;
}

export function parseMove(chessGameState: ChessGameState, move: string): {
    sourceSquareId: SquareId,
    targetSquareId: SquareId
    promotionPieceName: PieceName | null } {
    // Remove any check (+) or checkmate (#) symbols
    move = move.replace(/[+#]/, '');

    const activeColor = chessGameState.whitesTurn ? 'w' : 'b';

    // Castling king side
    if (move === 'O-O' || move === '0-0') {
        return chessGameState.whitesTurn ? { sourceSquareId: 'e1', targetSquareId: 'g1', promotionPieceName: null } : { sourceSquareId: 'e8', targetSquareId: 'g8', promotionPieceName: null };
    }

    // Castling queen side
    if (move === 'O-O-O' || move === '0-0-0') {
        return chessGameState.whitesTurn ? { sourceSquareId: 'e1', targetSquareId: 'c1', promotionPieceName: null } : { sourceSquareId: 'e8', targetSquareId: 'c8', promotionPieceName: null };
    }

    // Regular moves
    const pieceRegex = /^([KQRBN])?([a-h])?([1-8])?(x)?([a-h])([1-8])(=([QRBN]))?$/;
    const match = move.match(pieceRegex);

    if (match) {
        const [, piece, fromFile, fromRank, _capture, toFile, toRank, _, promotion] = match;
        // console.log(piece, fromFile, fromRank, capture, toFile, toRank, _, promotion)

        const targetSquareId = `${toFile}${toRank}` as SquareId;
        const pieceName = piece ? piece.toLowerCase() : 'p';

        // console.log(`Looking for ${activeColor}${pieceName} that can move to ${targetSquareId}`);

        if (fromFile && fromRank) {
            const sourceSquareId = `${fromFile}${fromRank}` as SquareId;
            return { sourceSquareId, targetSquareId, promotionPieceName: promotion ? promotion.toLowerCase() as PieceName : null };
        }

        const possibleSourceSquareIds = squareIds.filter((squareId: SquareId) => {
            const pieceState = chessGameState.getPieceAt(squareId);
            if (!pieceState) return false;
            if (pieceState.colorName !== activeColor) return false;
            if (pieceState.pieceName !== pieceName) return false;

            // console.log(`Checking ${squareId}: ${pieceState.colorName}${pieceState.pieceName}`, pieceState.validMoveSquareIds);
            return pieceState.validMoveSquareIds.includes(targetSquareId);
        });

        // console.log('Possible source squares:', possibleSourceSquareIds);

        if (possibleSourceSquareIds.length === 1) {
            return { sourceSquareId: possibleSourceSquareIds[0], targetSquareId, promotionPieceName: promotion ? promotion.toLowerCase() as PieceName : null };
        } else if (possibleSourceSquareIds.length > 1) {
            // If there are multiple possible source squares, use fromFile or fromRank to disambiguate
            const disambiguatedSquare = possibleSourceSquareIds.find(squareId =>
                (!fromFile || squareId[0] === fromFile) && (!fromRank || squareId[1] === fromRank)
            );
            if (disambiguatedSquare) {
                return { sourceSquareId: disambiguatedSquare, targetSquareId, promotionPieceName: promotion ? promotion.toLowerCase() as PieceName : null };
            }
        }
        console.log('Possible source squares:', possibleSourceSquareIds);
        console.log('Move:', move);
        console.log('Match:', match);
    }

    throw new Error(`Invalid move '${move} '${match}'`);
}