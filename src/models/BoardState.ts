export type ColorName = 'w' | 'b';
export type PieceName = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type RankName = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type FileName = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type PieceId = 
'wk' | 'wq' | 'wr1' | 'wr2' | 'wn1' | 'wn2' | 'wb1' | 'wb2' | 'wp1' | 'wp2' | 'wp3' | 'wp4' | 'wp5' | 'wp6' | 'wp7' | 'wp8' |
'bk' | 'bq' | 'br1' | 'br2' | 'bn1' | 'bn2' | 'bb1' | 'bb2' | 'bp1' | 'bp2' | 'bp3' | 'bp4' | 'bp5' | 'bp6' | 'bp7' | 'bp8';

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
  file: FileName;
  rank: RankName;
}

export type PieceInfo = {
  color: ColorName;
  piece: PieceName;
  number: number;
}

export type Piece = {
  squareId: SquareId | null;
  moveToSquareIds: SquareId[];
}

export const ranks: RankName[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const ranksReverse: RankName[] = ['8', '7', '6', '5', '4', '3', '2', '1'];
export const files: FileName[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const pieceIds: PieceId[] = [
  'wk', 'wq', 'wr1', 'wr2', 'wn1', 'wn2', 'wb1', 'wb2', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8',
  'bk', 'bq', 'br1', 'br2', 'bn1', 'bn2', 'bb1', 'bb2', 'bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8',
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

export function toPieceInfo(pieceId: PieceId): PieceInfo {
  return {
    color: pieceId.charAt(0) as ColorName,
    piece: pieceId.charAt(1) as PieceName,
    number: pieceId.length === 3 ? parseInt(pieceId.charAt(2), 10) : 0
  };
}

export function toPieceId(pieceInfo: PieceInfo): PieceId {
  return `${pieceInfo.color}${pieceInfo.piece}${pieceInfo.number > 0 ? pieceInfo.number.toString() : ''}` as PieceId;
}

export function toSquareInfo(squareId: SquareId): SquareInfo {
  return {
    file: squareId.charAt(0) as FileName,
    rank: squareId.charAt(1) as RankName
  };
}

export function toSquareId(squareInfo: SquareInfo): SquareId {
  return `${squareInfo.file}${squareInfo.rank}` as SquareId;
}

export class BoardState {

  private pieces: Map<PieceId, Piece> = new Map();
  private squares: Map<SquareId, PieceId | null> = new Map();

  constructor() {
    for (let pieceId of pieceIds) {
      this.pieces.set(pieceId, { squareId: null, moveToSquareIds: [] });
    }

    for (let squareId of squareIds) {
      this.squares.set(squareId, null);
    }
  }

  setPiece(pieceId: PieceId, squareId: SquareId): void {
    this.pieces.set(pieceId, { squareId: squareId, moveToSquareIds: [] });
    if (squareId) {
      this.squares.set(squareId, pieceId);
    }
  }

  getPiece(pieceId: PieceId): Piece | undefined {
    return this.pieces.get(pieceId);
  }

  getPieceIdAtSquare(squareId: SquareId): PieceId | null | undefined {
    return this.squares.get(squareId);
  }
  
  clearBoard(): void {
    for (let pieceId of pieceIds) {
      this.pieces.set(pieceId, { squareId: null, moveToSquareIds: [] });
    }
    for (let squareId of squareIds) {
      this.squares.set(squareId, null);
    }
  }

  clone(): BoardState {
    const newState = new BoardState();
    for (let [pieceId, piece] of this.pieces) {
      newState.pieces.set(pieceId, { squareId: piece.squareId, moveToSquareIds: [...piece.moveToSquareIds] });
    }
    for (let [square, pieceId] of this.squares) {
      newState.squares.set(square, pieceId);
    }
    return newState;
  }

}