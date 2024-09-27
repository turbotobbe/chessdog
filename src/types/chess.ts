
export interface ChessComGame {
    url: string;
    pgn: string;
    time_control: string;
    end_time: number;
    time_class: string;
    white: {
        rating: number;
        result: string;
        username: string;
    };
    black: {
        rating: number;
        result: string;
        username: string;
    };
}

// types

export type ColorName = 'w' | 'b';
export type PieceName = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type FileName = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type RankName = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type SideName = 'kingside' | 'queenside';

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

// interfaces

export interface SquareInfo {
  id: SquareId;
  fileName: FileName;
  rankName: RankName;
  fileIndex: number;
  rankIndex: number;
}

export interface PieceInfo {
  id: PieceId;
  colorName: ColorName;
  pieceName: PieceName;
  number: number;
}

// constants

export const files: FileName[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks: RankName[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const kingside: SideName = 'kingside';
export const queenside: SideName = 'queenside';

export const whiteQueensideRook: PieceId = 'wr1';
export const whiteQueensideKnight: PieceId = 'wn1';
export const whiteQueensideBishop: PieceId = 'wb1';
export const whiteQueen: PieceId = 'wq1';
export const whiteKing: PieceId = 'wk1';
export const whiteKingsideBishop: PieceId = 'wb2';
export const whiteKingsideKnight: PieceId = 'wn2';
export const whiteKingsideRook: PieceId = 'wr2';

export const whitePawn1: PieceId = 'wp1';
export const whitePawn2: PieceId = 'wp2';
export const whitePawn3: PieceId = 'wp3';
export const whitePawn4: PieceId = 'wp4';
export const whitePawn5: PieceId = 'wp5';
export const whitePawn6: PieceId = 'wp6';
export const whitePawn7: PieceId = 'wp7';
export const whitePawn8: PieceId = 'wp8';

export const blackQueensideRook: PieceId = 'br1';
export const blackQueensideKnight: PieceId = 'bn1';
export const blackQueensideBishop: PieceId = 'bb1';
export const blackQueen: PieceId = 'bq1';
export const blackKing: PieceId = 'bk1';
export const blackKingsideBishop: PieceId = 'bb2';
export const blackKingsideKnight: PieceId = 'bn2';
export const blackKingsideRook: PieceId = 'br2';

export const blackPawn1: PieceId = 'bp1';
export const blackPawn2: PieceId = 'bp2';
export const blackPawn3: PieceId = 'bp3';
export const blackPawn4: PieceId = 'bp4';
export const blackPawn5: PieceId = 'bp5';
export const blackPawn6: PieceId = 'bp6';
export const blackPawn7: PieceId = 'bp7';
export const blackPawn8: PieceId = 'bp8';

export const pieceIds: PieceId[] = [
  whiteQueensideRook,
  whiteQueensideKnight,
  whiteQueensideBishop,
  whiteQueen,
  whiteKing,
  whiteKingsideBishop,
  whiteKingsideKnight,
  whiteKingsideRook,
  whitePawn1, whitePawn2, whitePawn3, whitePawn4, whitePawn5, whitePawn6, whitePawn7, whitePawn8,
  blackQueensideRook,
  blackQueensideKnight,
  blackQueensideBishop,
  blackQueen,
  blackKing,
  blackKingsideBishop,
  blackKingsideKnight,
  blackKingsideRook,
  blackPawn1, blackPawn2, blackPawn3, blackPawn4, blackPawn5, blackPawn6, blackPawn7, blackPawn8,
];

export const a1: SquareId = 'a1';
export const a2: SquareId = 'a2';
export const a3: SquareId = 'a3';
export const a4: SquareId = 'a4';
export const a5: SquareId = 'a5';
export const a6: SquareId = 'a6';
export const a7: SquareId = 'a7';
export const a8: SquareId = 'a8';

export const b1: SquareId = 'b1';
export const b2: SquareId = 'b2';
export const b3: SquareId = 'b3';
export const b4: SquareId = 'b4';
export const b5: SquareId = 'b5';
export const b6: SquareId = 'b6';
export const b7: SquareId = 'b7';
export const b8: SquareId = 'b8';

export const c1: SquareId = 'c1';
export const c2: SquareId = 'c2';
export const c3: SquareId = 'c3';
export const c4: SquareId = 'c4';
export const c5: SquareId = 'c5';
export const c6: SquareId = 'c6';
export const c7: SquareId = 'c7';
export const c8: SquareId = 'c8';

export const d1: SquareId = 'd1';
export const d2: SquareId = 'd2';
export const d3: SquareId = 'd3';
export const d4: SquareId = 'd4';
export const d5: SquareId = 'd5';
export const d6: SquareId = 'd6';
export const d7: SquareId = 'd7';
export const d8: SquareId = 'd8';

export const e1: SquareId = 'e1';
export const e2: SquareId = 'e2';
export const e3: SquareId = 'e3';
export const e4: SquareId = 'e4';
export const e5: SquareId = 'e5';
export const e6: SquareId = 'e6';
export const e7: SquareId = 'e7';
export const e8: SquareId = 'e8';

export const f1: SquareId = 'f1';
export const f2: SquareId = 'f2';
export const f3: SquareId = 'f3';
export const f4: SquareId = 'f4';
export const f5: SquareId = 'f5';
export const f6: SquareId = 'f6';
export const f7: SquareId = 'f7';
export const f8: SquareId = 'f8';

export const g1: SquareId = 'g1';
export const g2: SquareId = 'g2';
export const g3: SquareId = 'g3';
export const g4: SquareId = 'g4';
export const g5: SquareId = 'g5';
export const g6: SquareId = 'g6';
export const g7: SquareId = 'g7';
export const g8: SquareId = 'g8';

export const h1: SquareId = 'h1';
export const h2: SquareId = 'h2';
export const h3: SquareId = 'h3';
export const h4: SquareId = 'h4';
export const h5: SquareId = 'h5';
export const h6: SquareId = 'h6';
export const h7: SquareId = 'h7';
export const h8: SquareId = 'h8';


export const squareIds: SquareId[] = [
  a1, a2, a3, a4, a5, a6, a7, a8,
  b1, b2, b3, b4, b5, b6, b7, b8,
  c1, c2, c3, c4, c5, c6, c7, c8,
  d1, d2, d3, d4, d5, d6, d7, d8,
  e1, e2, e3, e4, e5, e6, e7, e8,
  f1, f2, f3, f4, f5, f6, f7, f8,
  g1, g2, g3, g4, g5, g6, g7, g8,
  h1, h2, h3, h4, h5, h6, h7, h8,
];

export const lightSquareIds: SquareId[] = [
  a2,a4,a6,a8,
  b1,b3,b5,b7,
  c2, c4, c6, c8,
  d1, d3, d5, d7,
  e2, e4, e6, e8,
  f1, f3, f5, f7,
  g2, g4, g6, g8,
  h1, h3, h5, h7,
];

export const darkSquareIds: SquareId[] = [
  a1, a3, a5, a7,
  b2, b4, b6, b8,
  c1, c3, c5, c7,
  d2, d4, d6, d8,
  e1, e3, e5, e7,
  f2, f4, f6, f8,
  g1, g3, g5, g7,
  h2, h4, h6, h8,
];

export const pieceFullNames: Record<PieceName, string> = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn'
};

export const castlingRookMoves: Record<ColorName, Record<SideName, { fromSquareId: SquareId, toSquareId: SquareId }>> = {
  'w': {
      kingside: { fromSquareId: h1, toSquareId: f1 },
      queenside: { fromSquareId: a1, toSquareId: d1 }
  },
  'b': {
      kingside: { fromSquareId: h8, toSquareId: f8 },
      queenside: { fromSquareId: a8, toSquareId: d8 }
  }
}