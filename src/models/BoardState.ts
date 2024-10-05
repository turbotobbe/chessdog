import { SquareId } from "@/types/chess";
import { parseMove, PgnGame } from "@/utils/pgn";
import { ChessGameState, nextChessGameState } from "./chess";

export class BoardState {
  public nodes: BoardNodeState[] = [];
  public index: number = -1;
  public chessGameState: ChessGameState;

  constructor(chessGameState: ChessGameState) {
    this.chessGameState = chessGameState;
  }

  clone(): BoardState {
    const clone = new BoardState(this.chessGameState.clone());
    clone.nodes = this.nodes.map(node => node.clone());
    clone.index = this.index;
    return clone;
  }
}

export class BoardNodeState {
  public sourceSquareId: SquareId;
  public targetSquareId: SquareId;
  public pgn: string;
  public nodes: BoardNodeState[];
  public index: number;
  public count: number;
  public chessGameState: ChessGameState;

  constructor(chessGameState: ChessGameState, sourceSquareId: SquareId, targetSquareId: SquareId, pgn: string) {
    this.chessGameState = chessGameState;
    this.sourceSquareId = sourceSquareId;
    this.targetSquareId = targetSquareId;
    this.pgn = pgn;
    this.nodes = [];
    this.index = -1;
    this.count = 0;
  }

  clone(): BoardNodeState {
    const clone = new BoardNodeState(this.chessGameState.clone(), this.sourceSquareId, this.targetSquareId, this.pgn);
    clone.nodes = this.nodes.map(node => node.clone());
    clone.index = this.index;
    clone.count = this.count;
    return clone;
  }
}

export function loadBoardState(boardState: BoardState, pgnGames: PgnGame[]): BoardState {

  const newBoardState: BoardState = boardState.clone();

  for (const game of pgnGames) {
    console.log('game', game);
    // setup new chess game state
    let chessGameState = boardState.chessGameState.clone();
    let nodes = newBoardState.nodes;

    // go through each turn in the game
    for (const turn of game.turns) {

      // parse the move
      const { sourceSquareId, targetSquareId, promotionPieceName } = parseMove(chessGameState, turn.white.move);

      // update the chess game state
      chessGameState = nextChessGameState(chessGameState, { sourceSquareId, targetSquareId, promotionPieceName });

      // find the node in the board state
      let node = nodes.find(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
      // console.log(sourceSquareId, node?.sourceSquareId, targetSquareId, node?.targetSquareId);
      if (node === undefined) {
        // create a new node if it doesn't exist
        node = new BoardNodeState(chessGameState.clone(), sourceSquareId, targetSquareId, turn.white.move);
        nodes.push(node);
        // } else {
        // console.log("node already exists", node.sourceSquareId, node.targetSquareId, node.pgn);
      }
      node.count++;
      node.index = 0;
      nodes = node.nodes;

      // if there is a black move, update the chess game state
      if (turn.black && turn.black.move.length > 0) {

        // parse the move
        const { sourceSquareId, targetSquareId, promotionPieceName } = parseMove(chessGameState, turn.black.move);

        // update the chess game state
        chessGameState = nextChessGameState(chessGameState, { sourceSquareId, targetSquareId, promotionPieceName });

        // find the node in the board state
        let node = nodes.find(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
        if (!node) {
          // create a new node if it doesn't exist
          node = new BoardNodeState(chessGameState.clone(), sourceSquareId, targetSquareId, turn.black.move);
          nodes.push(node);
          // } else {
          //   console.log("node already exists", node.sourceSquareId, node.targetSquareId, node.pgn);
        }
        node.count++;
        node.index = 0;
        nodes = node.nodes;
      }
    }
    newBoardState.index = 0;
  }
  return newBoardState;
}