import { toPieceInfo, toSquareInfo } from "@/utils/board";

export type ColorName = 'w' | 'b';
export type PieceName = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type FileName = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type RankName = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type PieceId =
  'wk1' | 'wq1' | 'wr1' | 'wr2' | 'wn1' | 'wn2' | 'wb1' | 'wb2' | 'wp1' | 'wp2' | 'wp3' | 'wp4' | 'wp5' | 'wp6' | 'wp7' | 'wp8' |
  'bk1' | 'bq1' | 'br1' | 'br2' | 'bn1' | 'bn2' | 'bb1' | 'bb2' | 'bp1' | 'bp2' | 'bp3' | 'bp4' | 'bp5' | 'bp6' | 'bp7' | 'bp8';

export type SquareId =
  'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' |
  'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8' |
  'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' |
  'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' | 'd7' | 'd8' |
  'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7' | 'e8' |
  'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' |
  'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6' | 'g7' | 'g8' |
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8';

export type SquareInfo = {
  id: SquareId;
  fileName: FileName;
  rankName: RankName;
}

export type PieceInfo = {
  id: PieceId;
  colorName: ColorName;
  pieceName: PieceName;
  number: number;
}

export const files: FileName[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks: RankName[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const pieceIds: PieceId[] = [
  'wk1', 'wq1', 'wr1', 'wr2', 'wn1', 'wn2', 'wb1', 'wb2', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8',
  'bk1', 'bq1', 'br1', 'br2', 'bn1', 'bn2', 'bb1', 'bb2', 'bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8',
];

export const squareIds: SquareId[] = [
  'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
  'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
  'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
  'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
  'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8',
  'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
  'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
];

export const lightSquareIds: SquareId[] = [
  'a2', 'a4', 'a6', 'a8',
  'b1', 'b3', 'b5', 'b7',
  'c2', 'c4', 'c6', 'c8',
  'd1', 'd3', 'd5', 'd7',
  'e2', 'e4', 'e6', 'e8',
  'f1', 'f3', 'f5', 'f7',
  'g2', 'g4', 'g6', 'g8',
  'h1', 'h3', 'h5', 'h7',
];

export const darkSquareIds: SquareId[] = [
  'a1', 'a3', 'a5', 'a7',
  'b2', 'b4', 'b6', 'b8',
  'c1', 'c3', 'c5', 'c7',
  'd2', 'd4', 'd6', 'd8',
  'e1', 'e3', 'e5', 'e7',
  'f2', 'f4', 'f6', 'f8',
  'g1', 'g3', 'g5', 'g7',
  'h2', 'h4', 'h6', 'h8',
];

export const pieceFullNames: Record<PieceName, string> = {
  'k': 'king',
  'q': 'queen',
  'r': 'rook',
  'b': 'bishop',
  'n': 'knight',
  'p': 'pawn'
};

export class PieceState {
  pieceInfo: PieceInfo;
  validMoveSquareIds: SquareId[] = [];
  captureMoveSquareIds: SquareId[] = [];
  constructor(pieceId: PieceId) {
    this.pieceInfo = toPieceInfo(pieceId);
  }

  setValidMoves(moveToSquareIds: SquareId[]): void {
    this.validMoveSquareIds = [...moveToSquareIds];
  }

  getValidMoves(): SquareId[] {
    return [...this.validMoveSquareIds];
  }

  setCaptureMoves(captureMoveSquareIds: SquareId[]): void {
    this.captureMoveSquareIds = [...captureMoveSquareIds];
  }

  getCaptureMoves(): SquareId[] {
    return [...this.captureMoveSquareIds];
  }

  clone(): PieceState {
    const piece = new PieceState(this.pieceInfo.id);
    piece.validMoveSquareIds = [...this.validMoveSquareIds];
    piece.captureMoveSquareIds = [...this.captureMoveSquareIds];
    return piece;
  }
}

export class BoardState {

  private whitesTurn: boolean = true;

  private pieceIds: PieceId[] = [...pieceIds];
  private board: (PieceState | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
  private lastMove: { sourceSquareId: SquareId, targetSquareId: SquareId } | null = null;

  constructor() {

  }

  setIsWhitesTurn(whitesTurn: boolean): void {
    this.whitesTurn = whitesTurn;
  }

  isWhitesTurn(): boolean {
    return this.whitesTurn;
  }

  pushPieceId(pieceId: PieceId): void {
    this.pieceIds.push(pieceId);
  }

  putPiece(squareId: SquareId, pieceState: PieceState | null): void {
    const square = toSquareInfo(squareId);
    const fileIndex = files.indexOf(square.fileName);
    const rankIndex = ranks.indexOf(square.rankName);
    this.board[rankIndex][fileIndex] = pieceState;
  }

  getLastMove(): { sourceSquareId: SquareId, targetSquareId: SquareId } | null {
    return this.lastMove;
  }

  setLastMove(sourceSquareId: SquareId, targetSquareId: SquareId): void {
    this.lastMove = { sourceSquareId, targetSquareId };
  }

  setPiece(squareId: SquareId, pieceId: PieceId): void {

    // get pieces from unused pieces
    const pieceIndex = this.pieceIds.indexOf(pieceId);
    if (pieceIndex === -1) {
      throw new Error(`Piece ${pieceId} not found`);
    }
    this.pieceIds.splice(pieceIndex, 1);

    // set piece on board
    const square = toSquareInfo(squareId);
    const fileIndex = files.indexOf(square.fileName);
    const rankIndex = ranks.indexOf(square.rankName);
    this.board[rankIndex][fileIndex] = new PieceState(pieceId);
  }

  getPiece(squareId: SquareId): PieceState | null {
    const square = toSquareInfo(squareId);
    const fileIndex = files.indexOf(square.fileName);
    const rankIndex = ranks.indexOf(square.rankName);
    return this.board[rankIndex][fileIndex];
  }

  clearBoard(): void {
    this.pieceIds = { ...pieceIds };
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
  }

  clone(): BoardState {
    const state = new BoardState();
    state.pieceIds = [...this.pieceIds];
    state.board = this.board.map(row => row.map(piece => piece?.clone() ?? null));
    state.whitesTurn = this.isWhitesTurn();
    return state;
  }

}