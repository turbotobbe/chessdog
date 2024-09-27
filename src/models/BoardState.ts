import { toPieceInfo, toSquareInfo } from "@/utils/board";
import { SquareId, PieceId, PieceInfo, files, pieceIds, ranks } from "@/types/chess";

export class PieceState {
  public pieceInfo: PieceInfo;
  public validMoveSquareIds: SquareId[] = [];

  constructor(pieceId: PieceId) {
    this.pieceInfo = toPieceInfo(pieceId);
  }

  clone(): PieceState {
    const piece = new PieceState(this.pieceInfo.id);
    piece.validMoveSquareIds = [...this.validMoveSquareIds];
    return piece;
  }
}

export class BoardState {

  public whitesTurn: boolean = true;
  public whiteKingSquareId: SquareId | null = null;
  public blackKingSquareId: SquareId | null = null;
  public hasMoved: PieceId[] = [];

  public whiteKingInCheck: boolean = false;
  public blackKingInCheck: boolean = false;

  private inactivePieceIds: PieceId[] = [...pieceIds];
  private board: (PieceState | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
  private lastMove: { sourceSquareId: SquareId, targetSquareId: SquareId } | null = null;

  constructor() {
    // Remove this console.log statement
    // console.log('----------');
    // console.log(this.inactivePieceIds);
    // console.log('----------');
  }

  addMovedPiece(pieceId: PieceId): void {
    if (!this.hasMoved.includes(pieceId)) {
      this.hasMoved.push(pieceId);
    }
  }

  hasPieceMoved(pieceId: PieceId): boolean {
    return this.hasMoved.includes(pieceId);
  }

  updateKingSquareIds(pieceState: PieceState | null, squareId: SquareId): void {
    if (pieceState?.pieceInfo.pieceName === 'k') {
      if (pieceState.pieceInfo.colorName === 'w') {
        this.whiteKingSquareId = squareId;
      } else {
        this.blackKingSquareId = squareId;
      }
    }
  }
  capturePiece(pieceId: PieceId): void {

    // find and remove the piece from the board
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const piece = this.board[rankIndex][fileIndex];
        if (piece?.pieceInfo.id === pieceId) {
          this.board[rankIndex][fileIndex] = null;
          this.inactivePieceIds.push(pieceId);
          return;
        }
      }
    }
    throw new Error(`Piece ${pieceId} not found on board!`);
  }

  movePiece(sourceSquareId: SquareId, targetSquareId: SquareId): void {
    const sourcePieceState = this.getPiece(sourceSquareId);
    if (!sourcePieceState) {
      throw new Error(`Piece ${sourceSquareId} not found on board!`);
    }
    this.putPiece(targetSquareId, sourcePieceState);
    this.putPiece(sourceSquareId, null);
    this.addMovedPiece(sourcePieceState.pieceInfo.id);
    this.updateKingSquareIds(sourcePieceState, targetSquareId);
  }
  
  putPiece(squareId: SquareId, pieceState: PieceState | null): void {
    const square = toSquareInfo(squareId);
    const fileIndex = files.indexOf(square.fileName);
    const rankIndex = ranks.indexOf(square.rankName);
    this.board[rankIndex][fileIndex] = pieceState;
    this.inactivePieceIds = this.inactivePieceIds.filter(id => id !== pieceState?.pieceInfo.id);
    this.updateKingSquareIds(pieceState, squareId);
  }

  getLastMove(): { sourceSquareId: SquareId, targetSquareId: SquareId } | null {
    return this.lastMove;
  }

  setLastMove(sourceSquareId: SquareId, targetSquareId: SquareId): void {
    this.lastMove = { sourceSquareId, targetSquareId };
  }

  initialize(squareIdToPieceId: [SquareId, PieceId][]): void {
    for (const [squareId, pieceId] of squareIdToPieceId) {
      // Remove this console.log statement
      // console.log(squareId, pieceId, this.inactivePieceIds);
      const pieceIndex = this.inactivePieceIds.indexOf(pieceId);
      if (pieceIndex === -1) {
        console.error(`Piece ${pieceId} not found in inactivePieceIds:`, this.inactivePieceIds);
        throw new Error(`Piece ${pieceId} not found`);
      }
      // activate the piece
      this.inactivePieceIds.splice(pieceIndex, 1);

      // set piece on board
      const square = toSquareInfo(squareId as SquareId);
      const fileIndex = files.indexOf(square.fileName);
      const rankIndex = ranks.indexOf(square.rankName);
      const pieceState  = new PieceState(pieceId);
      this.board[rankIndex][fileIndex] = pieceState;

      this.updateKingSquareIds(pieceState, squareId);
    }
  }

  getPiece(squareId: SquareId): PieceState | null {
    const square = toSquareInfo(squareId);
    const fileIndex = files.indexOf(square.fileName);
    const rankIndex = ranks.indexOf(square.rankName);
    return this.board[rankIndex][fileIndex];
  }

  clone(): BoardState {
    const state = new BoardState();
    state.inactivePieceIds = [...this.inactivePieceIds];
    state.board = this.board.map(row => row.map(piece => piece?.clone() ?? null));
    state.whitesTurn = this.whitesTurn;
    state.hasMoved = [...this.hasMoved];
    state.lastMove = this.lastMove ? { ...this.lastMove } : null;
    state.whiteKingSquareId = this.whiteKingSquareId;
    state.blackKingSquareId = this.blackKingSquareId;
    state.whiteKingInCheck = this.whiteKingInCheck;
    state.blackKingInCheck = this.blackKingInCheck;
    return state;
  }

}