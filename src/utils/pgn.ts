import { ChessBoardState } from "@/contexts/ChessBoardState";
import { asPieceInfo } from "@/models/chess";
import { Move, PieceName, SquareId, squareIds } from "@/types/chess";


export type PgnResult = '1-0' | '0-1' | '1/2-1/2' | '*';

export const pgnResults: PgnResult[] = ['1-0', '0-1', '1/2-1/2', '*'];

export class PgnGame {
    public headers: Record<string, string>;
    public turns: PgnTurn[];
    public result: PgnResult | undefined;

    constructor(headers: Record<string, string>, turns: PgnTurn[], result: PgnResult | undefined) {
        this.headers = headers;
        this.turns = turns;
        this.result = result;
    }
}

export class PgnTurn {
    public index: number;
    public white: PgnMove;
    public black?: PgnMove;

    constructor(index: number, white: PgnMove, black?: PgnMove) {
        this.index = index;
        this.white = white;
        this.black = black;
    }
}

export class PgnMove {
    public isWhite: boolean;
    public index: number;
    public pgn: string;
    public comments?: string[];
    public clock?: string;
    public marks?: SquareId[];
    public arrows?: PgnArrow[];

    constructor(isWhite: boolean, moveNumber: number) {
        this.isWhite = isWhite;
        this.index = moveNumber;
        this.pgn = '';
        this.comments = undefined;
        this.clock = undefined;
        this.marks = undefined;
        this.arrows = undefined;
    }
}

export interface PgnArrow {
    fromSquareId: SquareId;
    toSquareId: SquareId;
}

export function expandPgnFormat(pgn: string): string {
    let newPgn = pgn.replace(/(\d+)\.(\S+)\s+(\S+)/g, '$1. $2 $1... $3')
    // Replace last move number if it exists
    newPgn = newPgn.replace(/(\d+)\.\s*(\S+)\s*$/g, '$1. $2');
    return newPgn;
}

export function moveToString(move: PgnMove): string {
    let result = `${move.index}${move.isWhite ? '.' : '...'} ${move.pgn}`;
    if (move.comments && move.comments.length > 0) {
        const comments = move.comments.map(comment => `{${comment}}`).join(' ');
        result += ` ${comments}`;
    }
    if (move.marks && move.marks.length > 0) {
        const marks = move.marks.join(' ');
        result += ` {[%marks ${marks}]}`;
    }
    if (move.arrows && move.arrows.length > 0) {
        const arrows = move.arrows.map(({ fromSquareId, toSquareId }) => `{[%arrow ${fromSquareId} ${toSquareId}]}`).join(' ');
        result += ` ${arrows}`;
    }
    if (move.clock) {
        result += ` {[%clk ${move.clock}]}`;
    }
    return result;
}

export function movesToString(moves: PgnMove[]): string {
    return moves.map(moveToString).join(' ');
}

export function tokenize(inputString: string): string[] {
    const result: string[] = [];
    let current = '';
    let braceCount = 0;

    for (const char of inputString) {
        if (char === '{' && braceCount === 0) {
            if (current.trim()) {
                result.push(...current.trim().split(/\s+/));
            }
            current = '{';
            braceCount++;
        } else if (char === '{' && braceCount > 0) {
            current += char;
            braceCount++;
        } else if (char === '}') {
            current += char;
            braceCount--;
            if (braceCount === 0) {
                result.push(current.trim());
                current = '';
            }
        } else if (braceCount > 0) {
            current += char;
        } else if (/\s/.test(char) && current.trim()) {
            result.push(...current.trim().split(/\s+/));
            current = '';
        } else {
            current += char;
        }
    }

    if (current.trim()) {
        result.push(...current.trim().split(/\s+/));
    }

    return result;
}
enum LineState {
    ExpectingHeader,
    ExpectingPgn,
    ExpectingNothing
}

export function parsePgn(content: string, name?: string): PgnGame {
    let turns: PgnTurn[] = [];
    const headers: Record<string, string> = {};
    let result: PgnResult | undefined;
    let state = LineState.ExpectingHeader;

    let lines = content.split('\n').map(line => line.trim()); // make nice lines
    lines = lines.filter(line => line.length > 0); // remove empty lines
    lines = lines.filter(line => !line.startsWith('%')); // remove comments
    for (const line of lines) {
        switch (state) {
            case LineState.ExpectingHeader:
                if (line.startsWith('[') && line.endsWith(']')) {
                    const [key] = line.slice(1, -1).split(' ', 1);
                    let value = line.slice(1, -1).replace(key, '').trim();
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    }
                    headers[key] = value;
                } else {
                    state = LineState.ExpectingPgn;
                    lines.unshift(line);
                }
                break;
            case LineState.ExpectingPgn:
                const tokens = tokenize(line);
                const { moves, result: result_ } = tokensToMoves(tokens);
                result = result_;
                turns = movesToTurns(moves);
                state = LineState.ExpectingNothing;
                break;
            case LineState.ExpectingNothing:
                throw new Error(`Unexpected line: ${line}`);
        }
    }
    if (name && turns.length > 0) {
        if (turns[turns.length - 1]?.black) {
            turns[turns.length - 1].black!.comments = [name];
        } else {
            turns[turns.length - 1].white!.comments = [name];
        }
    }
    return new PgnGame(headers, turns, result);
}

enum TokenState {
    ExpectingWhiteLineNumber,
    ExpectingBlackLineNumber,
    ExpectingWhiteMove,
    ExpectingBlackMove,
    ExpectingWhiteComments,
    ExpectingBlackComments,
    ExpectingWhiteGameResult,
    ExpectingBlackGameResult,
    ExpectingNothing
}


export function tokensToMoves(tokens: string[]): { moves: PgnMove[], result: PgnResult | undefined } {
    const moves: PgnMove[] = [];
    let result: PgnResult | undefined;
    let currentMove: PgnMove | null = null;
    let state: TokenState = TokenState.ExpectingWhiteLineNumber;

    for (const token of tokens) {
        switch (state) {

            case TokenState.ExpectingWhiteLineNumber:
                if (currentMove) {
                    moves.push(currentMove);
                }
                if (/^\d+\.$/.test(token)) {
                    currentMove = new PgnMove(true, parseInt(token.slice(0, -1), 10));
                    state = TokenState.ExpectingWhiteMove;
                } else {
                    throw new Error(`Expected white line number, got: ${token}`);
                }
                break;

            case TokenState.ExpectingBlackLineNumber:
                if (currentMove) {
                    moves.push(currentMove);
                }
                if (/^\d+\.{3}$/.test(token)) {
                    currentMove = new PgnMove(false, parseInt(token.slice(0, -3), 10));
                    state = TokenState.ExpectingBlackMove;
                } else {
                    throw new Error(`Expected black line number, got: ${token}`);
                }
                break;

            case TokenState.ExpectingWhiteMove:
                if (currentMove) {
                    if (
                        /^[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](=[QRBN])?[+#]?$/.test(token) ||
                        /^O-O(-O)?[+#]?$/.test(token)) {
                        currentMove.pgn = token;
                    } else {
                        throw new Error(`Invalid move: ${token}`);
                    }
                } else {
                    throw new Error(`Unexpected missing current move: ${token}`);
                }
                state = TokenState.ExpectingWhiteComments;
                break;

            case TokenState.ExpectingBlackMove:
                if (currentMove) {
                    if (
                        /^[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](=[QRBN])?[+#]?$/.test(token) ||
                        /^O-O(-O)?[+#]?$/.test(token)) {
                        currentMove.pgn = token;
                    } else {
                        throw new Error(`Invalid move: ${token}`);
                    }
                } else {
                    throw new Error(`Unexpected missing current move: ${token}`);
                }
                state = TokenState.ExpectingBlackComments;
                break;

            case TokenState.ExpectingWhiteComments:
                if (currentMove) {
                    if (token.startsWith('{[%clk') && token.endsWith(']}')) {
                        const clk = token.slice(6, -2).trim();
                        currentMove.clock = clk;
                    } else if (token.startsWith('{[%marks') && token.endsWith(']}')) {
                        let squareIds = token.slice(8, -2).trim().split(' ');
                        squareIds = squareIds.filter(squareId => squareId.trim().length > 0);
                        if (!currentMove.marks) {
                            currentMove.marks = [];
                        }
                        currentMove.marks.push(...squareIds.map(squareId => squareId.trim() as SquareId));
                    } else if (token.startsWith('{[%arrow') && token.endsWith(']}')) {
                        let squareIds = token.slice(8, -2).trim().split(' ');
                        squareIds = squareIds.filter(squareId => squareId.trim().length > 0);
                        if (squareIds.length !== 2) {
                            throw new Error(`Invalid arrow: ${squareIds}, token: ${token}`);
                        }
                        if (!currentMove.arrows) {
                            currentMove.arrows = [];
                        }
                        const fromSquareId = squareIds[0] as SquareId;
                        const toSquareId = squareIds[1] as SquareId;
                        currentMove.arrows.push({ fromSquareId, toSquareId });
                    } else if (token.startsWith('{') && token.endsWith('}')) {
                        if (!currentMove.comments) {
                            currentMove.comments = [];
                        }
                        currentMove.comments.push(token.slice(1, -1).trim());
                    } else {
                        state = TokenState.ExpectingWhiteGameResult;
                        // Reprocess this token as it should be a line number
                        tokens.unshift(token);
                    }
                } else {
                    throw new Error(`Unexpected missing current move: ${token}`);
                }
                break;

            case TokenState.ExpectingBlackComments:
                if (currentMove) {
                    if (token.startsWith('{[%clk') && token.endsWith(']}')) {
                        const clk = token.slice(6, -2).trim();
                        currentMove.clock = clk;
                    } else if (token.startsWith('{[%marks') && token.endsWith(']}')) {
                        let squareIds = token.slice(8, -2).trim().split(' ');
                        squareIds = squareIds.filter(squareId => squareId.trim().length > 0);
                        if (!currentMove.marks) {
                            currentMove.marks = [];
                        }
                        currentMove.marks.push(...squareIds.map(squareId => squareId.trim() as SquareId));
                    } else if (token.startsWith('{[%arrow') && token.endsWith(']}')) {
                        let squareIds = token.slice(8, -2).trim().split(' ');
                        squareIds = squareIds.filter(squareId => squareId.trim().length > 0);
                        if (squareIds.length !== 2) {
                            throw new Error(`Invalid arrow: ${squareIds}, token: ${token}`);
                        }
                        if (!currentMove.arrows) {
                            currentMove.arrows = [];
                        }
                        const fromSquareId = squareIds[0] as SquareId;
                        const toSquareId = squareIds[1] as SquareId;
                        currentMove.arrows.push({ fromSquareId, toSquareId });
                    } else if (token.startsWith('{') && token.endsWith('}')) {
                        if (!currentMove.comments) {
                            currentMove.comments = [];
                        }
                        currentMove.comments.push(token.slice(1, -1).trim());
                    } else {
                        state = TokenState.ExpectingBlackGameResult;
                        // Reprocess this token as it should be a line number
                        tokens.unshift(token);
                    }
                } else {
                    throw new Error(`Unexpected missing current move: ${token}`);
                }
                break;
            case TokenState.ExpectingWhiteGameResult:
                if (['1-0', '0-1', '1/2-1/2', '*'].includes(token)) {
                    if (currentMove) {
                        moves.push(currentMove);
                        currentMove = null;
                    }
                    result = token as PgnResult;
                    state = TokenState.ExpectingNothing;
                } else {
                    // switch expectation to black line number
                    state = TokenState.ExpectingBlackLineNumber;
                    tokens.unshift(token);
                }
                break;
            case TokenState.ExpectingBlackGameResult:
                if (['1-0', '0-1', '1/2-1/2', '*'].includes(token)) {
                    if (currentMove) {
                        moves.push(currentMove);
                        currentMove = null;
                    }
                    result = token as PgnResult;
                    state = TokenState.ExpectingNothing;
                } else {
                    // switch expectation to white line number
                    state = TokenState.ExpectingWhiteLineNumber;
                    tokens.unshift(token);
                }
                break;

            case TokenState.ExpectingNothing:
                throw new Error(`Unexpected token: ${token}`);
                break;
        }
    }

    if (currentMove) {
        moves.push(currentMove);
    }

    return { moves, result }
}

enum MoveState {
    ExpectingWhiteMove,
    ExpectingBlackMove,
}

export function movesToTurns(moves: PgnMove[]): PgnTurn[] {
    const turns: PgnTurn[] = [];
    let currentTurn: PgnTurn | null = null;
    let state: MoveState = MoveState.ExpectingWhiteMove;
    for (const move of moves) {
        switch (state) {
            case MoveState.ExpectingWhiteMove:
                if (currentTurn) {
                    turns.push(currentTurn);
                }
                currentTurn = new PgnTurn(move.index, move);
                state = MoveState.ExpectingBlackMove;
                break;
            case MoveState.ExpectingBlackMove:
                if (currentTurn) {
                    currentTurn.black = move;
                    turns.push(currentTurn);
                    currentTurn = null;
                }
                state = MoveState.ExpectingWhiteMove;
                break;
        }
    }
    if (currentTurn) {
        turns.push(currentTurn);
    }
    return turns;
}


// export function parseMove(chessGameState: ChessGameState, move: string): Move {
//     // Remove any check (+) or checkmate (#) symbols
//     move = move.replace(/[+#]/, '');

//     const activeColor = chessGameState.whitesTurn ? 'w' : 'b';

//     // Castling king side
//     if (move === 'O-O' || move === '0-0') {
//         return chessGameState.whitesTurn ? { sourceSquareId: 'e1', targetSquareId: 'g1' } : { sourceSquareId: 'e8', targetSquareId: 'g8' };
//     }

//     // Castling queen side
//     if (move === 'O-O-O' || move === '0-0-0') {
//         return chessGameState.whitesTurn ? { sourceSquareId: 'e1', targetSquareId: 'c1' } : { sourceSquareId: 'e8', targetSquareId: 'c8' };
//     }

//     // Regular moves
//     const pieceRegex = /^([KQRBN])?([a-h])?([1-8])?(x)?([a-h])([1-8])(=([QRBN]))?$/;
//     const match = move.match(pieceRegex);

//     if (match) {
//         const [, piece, fromFile, fromRank, _capture, toFile, toRank, _, promotion] = match;
//         // console.log(piece, fromFile, fromRank, capture, toFile, toRank, _, promotion)

//         const targetSquareId = `${toFile}${toRank}` as SquareId;
//         const pieceName = piece ? piece.toLowerCase() : 'p';

//         // console.log(`Looking for ${activeColor}${pieceName} that can move to ${targetSquareId}`);

//         if (fromFile && fromRank) {
//             const sourceSquareId = `${fromFile}${fromRank}` as SquareId;
//             return { sourceSquareId, targetSquareId, promotionPieceName: promotion ? (promotion.toLowerCase() as PieceName) : undefined };
//         }

//         const possibleSourceSquareIds = squareIds.filter((squareId: SquareId) => {
//             const pieceState = chessGameState.getPieceAt(squareId);
//             if (!pieceState) return false;
//             if (pieceState.colorName !== activeColor) return false;
//             if (pieceState.pieceName !== pieceName) return false;

//             // console.log(`Checking ${squareId}: ${pieceState.colorName}${pieceState.pieceName}`, pieceState.validMoveSquareIds);
//             return pieceState.validMoveSquareIds.includes(targetSquareId);
//         });

//         // console.log('Possible source squares:', possibleSourceSquareIds);

//         if (possibleSourceSquareIds.length === 1) {
//             return { sourceSquareId: possibleSourceSquareIds[0], targetSquareId, promotionPieceName: promotion ? promotion.toLowerCase() as PieceName : undefined };
//         } else if (possibleSourceSquareIds.length > 1) {
//             // If there are multiple possible source squares, use fromFile or fromRank to disambiguate
//             const disambiguatedSquare = possibleSourceSquareIds.find(squareId =>
//                 (!fromFile || squareId[0] === fromFile) && (!fromRank || squareId[1] === fromRank)
//             );
//             if (disambiguatedSquare) {
//                 return { sourceSquareId: disambiguatedSquare, targetSquareId, promotionPieceName: promotion ? promotion.toLowerCase() as PieceName : undefined };
//             }
//         }
//         console.log('Possible source squares:', possibleSourceSquareIds);
//         console.log('Move:', move);
//         console.log('Match:', match);
//     }

//     throw new Error(`Invalid move '${move} '${match}'`);
// }

export function parseMove(chessBoardState: ChessBoardState, move: string): Move {
    // Remove any check (+) or checkmate (#) symbols
    move = move.replace(/[+#]/, '');

    const activeColor = chessBoardState.whitesTurn ? 'w' : 'b';

    // Castling king side
    if (move === 'O-O' || move === '0-0') {
        return chessBoardState.whitesTurn ? { sourceSquareId: 'e1', targetSquareId: 'g1' } : { sourceSquareId: 'e8', targetSquareId: 'g8' };
    }

    // Castling queen side
    if (move === 'O-O-O' || move === '0-0-0') {
        return chessBoardState.whitesTurn ? { sourceSquareId: 'e1', targetSquareId: 'c1' } : { sourceSquareId: 'e8', targetSquareId: 'c8' };
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
            return { sourceSquareId, targetSquareId, promotionPieceName: promotion ? (promotion.toLowerCase() as PieceName) : undefined };
        }

        const possibleSourceSquareIds = squareIds.filter((squareId: SquareId) => {
            const pieceId = chessBoardState.squares[squareId]
            if (!pieceId) return false;
            const pieceInfo = asPieceInfo(pieceId);
            if (pieceInfo.colorName !== activeColor) return false;
            if (pieceInfo.pieceName !== pieceName) return false;

            const validMoves = chessBoardState.whitesTurn ? chessBoardState.validWhiteMoves[pieceId] : chessBoardState.validBlackMoves[pieceId];
            if (!validMoves) return false;
            // console.log(`Checking ${squareId}: ${pieceState.colorName}${pieceState.pieceName}`, pieceState.validMoveSquareIds);
            return validMoves.includes(targetSquareId);
        });

        // console.log('Possible source squares:', possibleSourceSquareIds);

        if (possibleSourceSquareIds.length === 1) {
            return { sourceSquareId: possibleSourceSquareIds[0], targetSquareId, promotionPieceName: promotion ? promotion.toLowerCase() as PieceName : undefined };
        } else if (possibleSourceSquareIds.length > 1) {
            // If there are multiple possible source squares, use fromFile or fromRank to disambiguate
            const disambiguatedSquare = possibleSourceSquareIds.find(squareId =>
                (!fromFile || squareId[0] === fromFile) && (!fromRank || squareId[1] === fromRank)
            );
            if (disambiguatedSquare) {
                return { sourceSquareId: disambiguatedSquare, targetSquareId, promotionPieceName: promotion ? promotion.toLowerCase() as PieceName : undefined };
            }
        }
        console.log('Possible source squares:', possibleSourceSquareIds);
        console.log('Move:', move);
        console.log('Match:', match);
    }

    throw new Error(`Invalid move '${move} '${match}'`);
}