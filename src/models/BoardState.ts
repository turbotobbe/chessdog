import { SquareId } from "@/types/chess";
import { parseMove, PgnGame } from "@/utils/pgn";
import { ChessGameState, getDefaultChessGameState, nextChessGameState } from "./chess";

export class BoardState {
  public nodes: BoardNodeState[] = [];
  public index: number = -1;
  public chessGameState: ChessGameState = getDefaultChessGameState();
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

}

export function loadBoardState(pgnGames: PgnGame[]): BoardState {

  const boardState: BoardState = new BoardState();

  for (const game of pgnGames) {

    // setup new chess game state
    let chessGameState = boardState.chessGameState;
    let nodes = boardState.nodes;

    // go through each turn in the game
    for (const turn of game.turns) {

      // parse the move
      const {sourceSquareId, targetSquareId, promotionPieceName} = parseMove(chessGameState, turn.white.move);

      // update the chess game state
      chessGameState = nextChessGameState(chessGameState, {sourceSquareId, targetSquareId, promotionPieceName});

      // find the node in the board state
      let node = nodes.find(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
      console.log(sourceSquareId, node?.sourceSquareId, targetSquareId, node?.targetSquareId);
      if (node === undefined) {
        // create a new node if it doesn't exist
        node = new BoardNodeState(chessGameState.clone(), sourceSquareId, targetSquareId, turn.white.move);
        nodes.push(node);
      } else {
        console.log("node already exists", node.sourceSquareId, node.targetSquareId, node.pgn);
      }
      node.count++;
      node.index = 0;
      nodes = node.nodes;
      
      // if there is a black move, update the chess game state
      if (turn.black && turn.black.move.length>0) {

        // parse the move
        const {sourceSquareId, targetSquareId, promotionPieceName} = parseMove(chessGameState, turn.black.move);

        // update the chess game state
        chessGameState = nextChessGameState(chessGameState, {sourceSquareId, targetSquareId, promotionPieceName});

        // find the node in the board state
        let node = nodes.find(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
        if (!node) {
          // create a new node if it doesn't exist
          node = new BoardNodeState(chessGameState.clone(), sourceSquareId, targetSquareId, turn.black.move);
          nodes.push(node);
        } else {
          console.log("node already exists", node.sourceSquareId, node.targetSquareId, node.pgn);
        }
        node.count++;
        node.index = 0;
        nodes = node.nodes;
      }
    }
    boardState.index = 0;
  }
  return boardState;
}