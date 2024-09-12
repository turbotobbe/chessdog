export type ColorName = 'w' | 'b';
export type PieceName = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type RankName = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type FileName = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type PieceId = 
'wk' | 'wq' | 'wr1' | 'wr2' | 'wn1' | 'wn2' | 'wb1' | 'wb2' | 'wp1' | 'wp2' | 'wp3' | 'wp4' | 'wp5' | 'wp6' | 'wp7' | 'wp8' |
'bk' | 'bq' | 'br1' | 'br2' | 'bn1' | 'bn2' | 'bb1' | 'bb2' | 'bp1' | 'bp2' | 'bp3' | 'bp4' | 'bp5' | 'bp6' | 'bp7' | 'bp8';

export type Square = {
  file: FileName;
  rank: RankName;
}

export type Piece = {
  square: Square | null;
  moves: Square[];
}

export const ranks: RankName[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const ranksReverse: RankName[] = ['8', '7', '6', '5', '4', '3', '2', '1'];
export const files: FileName[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const pieceIds: PieceId[] = [
  'wk', 'wq', 'wr1', 'wr2', 'wn1', 'wn2', 'wb1', 'wb2', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8',
  'bk', 'bq', 'br1', 'br2', 'bn1', 'bn2', 'bb1', 'bb2', 'bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'
];


export class BoardState {

  private pieces: Map<PieceId, Piece> = new Map();

  constructor() {
    for (let pieceId of pieceIds) {
      this.pieces.set(pieceId, { square: null, moves: [] });
    }
  }

  setPiece(pieceId: PieceId, square: Square | null): void {
    this.pieces.set(pieceId, { square, moves: [] });
  }

  getPiece(pieceId: PieceId): Piece | undefined {
    return this.pieces.get(pieceId);
  }

  getPieceIdAtSquare(square: Square): PieceId | null {
    for (let [pieceId, piece] of this.pieces) {
      if (piece.square && 
          piece.square.file === square.file && 
          piece.square.rank === square.rank) {
        return pieceId;
      }
    }
    return null;
  }
  
  clearBoard(): void {
    for (let pieceId of pieceIds) {
      this.pieces.set(pieceId, { square: null, moves: [] });
    }
  }

  clone(): BoardState {
    const newState = new BoardState();
    for (let [pieceId, piece] of this.pieces) {
      newState.setPiece(pieceId, piece.square);
    }
    return newState;
  }

}