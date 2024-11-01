import { ChessGameState } from "@/models/chess";
import { PgnMove } from "@/utils/pgn";

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
// 'wp1q' | 'wp1r' | 'wp1b' | 'wp1n' | 'bp1q' | 'bp1r' | 'bp1b' | 'bp1n' |

// 'wp2q' | 'wp2r' | 'wp2b' | 'wp2n' | 'bp2q' | 'bp2r' | 'bp2b' | 'bp2n' |
// 'wp3q' | 'wp3r' | 'wp3b' | 'wp3n' | 'bp3q' | 'bp3r' | 'bp3b' | 'bp3n' |
// 'wp4q' | 'wp4r' | 'wp4b' | 'wp4n' | 'bp4q' | 'bp4r' | 'bp4b' | 'bp4n' |
// 'wp5q' | 'wp5r' | 'wp5b' | 'wp5n' | 'bp5q' | 'bp5r' | 'bp5b' | 'bp5n' |
// 'wp6q' | 'wp6r' | 'wp6b' | 'wp6n' | 'bp6q' | 'bp6r' | 'bp6b' | 'bp6n' |
// 'wp7q' | 'wp7r' | 'wp7b' | 'wp7n' | 'bp7q' | 'bp7r' | 'bp7b' | 'bp7n' |
// 'wp8q' | 'wp8r' | 'wp8b' | 'wp8n' | 'bp8q' | 'bp8r' | 'bp8b' | 'bp8n';

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
  promotionPieceName?: PieceName;
}

export interface Move {
  sourceSquareId: SquareId;
  targetSquareId: SquareId;
  promotionPieceName?: PieceName;
}

export interface Player {
  name: string;
  move(chessGameState: ChessGameState): Move | null;
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
export const whitePieceIds: PieceId[] = [
  'wk1', 'wq1',
  'wr1', 'wr2',
  'wn1', 'wn2',
  'wb1', 'wb2',
  'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8',
];

export const blackPieceIds: PieceId[] = [
  'bk1', 'bq1',
  'br1', 'br2',
  'bn1', 'bn2',
  'bb1', 'bb2',
  'bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8',
];

export const possibleTargetSquareIds: Partial<Record<PieceId, SquareId[]>> = {

  'wp1': [
    'a8', 'a7', 'a6', 'a5', 'a4', 'a3', 'a2',
    'b8', 'b7', 'b6', 'b5', 'b4', 'b3',
    'c8', 'c7', 'c6', 'c5', 'c4',
    'd8', 'd7', 'd6', 'd5',
    'e8', 'e7', 'e6',
    'f8', 'f7',
    'g8'
  ],
  'wp2': [
    'a8', 'a7', 'a6', 'a5', 'a4', 'a3',
    'b8', 'b7', 'b6', 'b5', 'b4', 'b3', 'b2',
    'c8', 'c7', 'c6', 'c5', 'c4', 'c3',
    'd8', 'd7', 'd6', 'd5', 'd4',
    'e8', 'e7', 'e6', 'e5',
    'f8', 'f7', 'f6',
    'g8', 'g7',
    'h8'
  ],
  'wp3': [
    'a8', 'a7', 'a6', 'a5', 'a4',
    'b8', 'b7', 'b6', 'b5', 'b4', 'b3',
    'c8', 'c7', 'c6', 'c5', 'c4', 'c3', 'c2',
    'd8', 'd7', 'd6', 'd5', 'd4', 'd3',
    'e8', 'e7', 'e6', 'e5', 'e4',
    'f8', 'f7', 'f6', 'f5',
    'g8', 'g7', 'g6',
    'h8', 'h7'
  ],
  'wp4': [
    'a8', 'a7', 'a6', 'a5',
    'b8', 'b7', 'b6', 'b5', 'b4',
    'c8', 'c7', 'c6', 'c5', 'c4', 'c3',
    'd8', 'd7', 'd6', 'd5', 'd4', 'd3', 'd2',
    'e8', 'e7', 'e6', 'e5', 'e4', 'e3',
    'f8', 'f7', 'f6', 'f5', 'f4',
    'g8', 'g7', 'g6', 'g5',
    'h8', 'h7', 'h6'
  ],
  'wp5': [
    'a8', 'a7', 'a6',
    'b8', 'b7', 'b6', 'b5',
    'c8', 'c7', 'c6', 'c5', 'c4',
    'd8', 'd7', 'd6', 'd5', 'd4', 'd3',
    'e8', 'e7', 'e6', 'e5', 'e4', 'e3', 'e2',
    'f8', 'f7', 'f6', 'f5', 'f4', 'f3',
    'g8', 'g7', 'g6', 'g5', 'g4',
    'h8', 'h7', 'h6', 'h5'
  ],
  'wp6': [
    'a8', 'a7',
    'b8', 'b7', 'b6',
    'c8', 'c7', 'c6', 'c5',
    'd8', 'd7', 'd6', 'd5', 'd4',
    'e8', 'e7', 'e6', 'e5', 'e4', 'e3',
    'f8', 'f7', 'f6', 'f5', 'f4', 'f3', 'f2',
    'g8', 'g7', 'g6', 'g5', 'g4', 'g3',
    'h8', 'h7', 'h6', 'h5', 'h4'
  ],
  'wp7': [
    'a8',
    'b8', 'b7',
    'c8', 'c7', 'c6',
    'd8', 'd7', 'd6', 'd5',
    'e8', 'e7', 'e6', 'e5', 'e4',
    'f8', 'f7', 'f6', 'f5', 'f4', 'f3',
    'g8', 'g7', 'g6', 'g5', 'g4', 'g3', 'g2',
    'h8', 'h7', 'h6', 'h5', 'h4', 'h3'
  ],
  'wp8': [
    'b8',
    'c8', 'c7',
    'd8', 'd7', 'd6',
    'e8', 'e7', 'e6', 'e5',
    'f8', 'f7', 'f6', 'f5', 'f4',
    'g8', 'g7', 'g6', 'g5', 'g4', 'g3',
    'h8', 'h7', 'h6', 'h5', 'h4', 'h3', 'h2'
  ],
  'bp1': [
    'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7',
    'b1', 'b2', 'b3', 'b4', 'b5', 'b6',
    'c1', 'c2', 'c3', 'c4', 'c5',
    'd1', 'd2', 'd3', 'd4',
    'e1', 'e2', 'e3',
    'f1', 'f2',
    'g1'
  ],
  'bp2': [
    'a1', 'a2', 'a3', 'a4', 'a5', 'a6',
    'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6',
    'd1', 'd2', 'd3', 'd4', 'd5',
    'e1', 'e2', 'e3', 'e4',
    'f1', 'f2', 'f3',
    'g1', 'g2',
    'h1'
  ],
  'bp3': [
    'a1', 'a2', 'a3', 'a4', 'a5',
    'b1', 'b2', 'b3', 'b4', 'b5', 'b6',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7',
    'd1', 'd2', 'd3', 'd4', 'd5', 'd6',
    'e1', 'e2', 'e3', 'e4', 'e5',
    'f1', 'f2', 'f3', 'f4',
    'g1', 'g2', 'g3',
    'h1', 'h2'
  ],
  'bp4': [
    'a1', 'a2', 'a3', 'a4',
    'b1', 'b2', 'b3', 'b4', 'b5',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6',
    'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7',
    'e1', 'e2', 'e3', 'e4', 'e5', 'e6',
    'f1', 'f2', 'f3', 'f4', 'f5',
    'g1', 'g2', 'g3', 'g4',
    'h1', 'h2', 'h3'
  ],
  'bp5': [
    'a1', 'a2', 'a3',
    'b1', 'b2', 'b3', 'b4',
    'c1', 'c2', 'c3', 'c4', 'c5',
    'd1', 'd2', 'd3', 'd4', 'd5', 'd6',
    'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6',
    'g1', 'g2', 'g3', 'g4', 'g5',
    'h1', 'h2', 'h3', 'h4'
  ],
  'bp6': [
    'a1', 'a2',
    'b1', 'b2', 'b3',
    'c1', 'c2', 'c3', 'c4',
    'd1', 'd2', 'd3', 'd4', 'd5',
    'e1', 'e2', 'e3', 'e4', 'e5', 'e6',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7',
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6',
    'h1', 'h2', 'h3', 'h4', 'h5'
  ],
  'bp7': [
    'a1',
    'b1', 'b2',
    'c1', 'c2', 'c3',
    'd1', 'd2', 'd3', 'd4',
    'e1', 'e2', 'e3', 'e4', 'e5',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6',
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ],
  'bp8': [
    'b1',
    'c1', 'c2',
    'd1', 'd2', 'd3',
    'e1', 'e2', 'e3', 'e4',
    'f1', 'f2', 'f3', 'f4', 'f5',
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'
  ],
  'wb1': [
    'a1', 'a3', 'a5', 'a7',
    'b2', 'b4', 'b6', 'b8',
    'c1', 'c3', 'c5', 'c7',
    'd2', 'd4', 'd6', 'd8',
    'e1', 'e3', 'e5', 'e7',
    'f2', 'f4', 'f6', 'f8',
    'g1', 'g3', 'g5', 'g7',
    'h2', 'h4', 'h6', 'h8'
  ],
  'wb2': [
    'a2', 'a4', 'a6', 'a8',
    'b1', 'b3', 'b5', 'b7',
    'c2', 'c4', 'c6', 'c8',
    'd1', 'd3', 'd5', 'd7',
    'e2', 'e4', 'e6', 'e8',
    'f1', 'f3', 'f5', 'f7',
    'g2', 'g4', 'g6', 'g8',
    'h1', 'h3', 'h5', 'h7'
  ],
  'bb1': [
    'a2', 'a4', 'a6', 'a8',
    'b1', 'b3', 'b5', 'b7',
    'c2', 'c4', 'c6', 'c8',
    'd1', 'd3', 'd5', 'd7',
    'e2', 'e4', 'e6', 'e8',
    'f1', 'f3', 'f5', 'f7',
    'g2', 'g4', 'g6', 'g8',
    'h1', 'h3', 'h5', 'h7'
  ],
  'bb2': [
    'a1', 'a3', 'a5', 'a7',
    'b2', 'b4', 'b6', 'b8',
    'c1', 'c3', 'c5', 'c7',
    'd2', 'd4', 'd6', 'd8',
    'e1', 'e3', 'e5', 'e7',
    'f2', 'f4', 'f6', 'f8',
    'g1', 'g3', 'g5', 'g7',
    'h2', 'h4', 'h6', 'h8'
  ],
};

export const castlingSquareIds = {
  white: {
    kingSquareId: 'e1' as SquareId,
    queenSide: {
      rookSquareId: 'a1' as SquareId,
      castleSquareId: 'c1' as SquareId,
      middleSquareId: 'd1' as SquareId,
      middleSquares: ['b1' as SquareId, 'c1' as SquareId, 'd1' as SquareId],
      targetSquares: ['c1' as SquareId, 'd1' as SquareId, 'e1' as SquareId],
    },
    kingSide: {
      rookSquareId: 'h1' as SquareId,
      castleSquareId: 'g1' as SquareId,
      middleSquareId: 'f1' as SquareId,
      middleSquares: ['f1' as SquareId, 'g1' as SquareId],
      targetSquares: ['e1' as SquareId, 'f1' as SquareId, 'g1' as SquareId],
    },
  },
  black: {
    kingSquareId: 'e8' as SquareId,
    queenSide: {
      rookSquareId: 'a8' as SquareId,
      castleSquareId: 'c8' as SquareId,
      middleSquareId: 'd8' as SquareId,
      middleSquares: ['b8' as SquareId, 'c8' as SquareId, 'd8' as SquareId],
      targetSquares: ['c8' as SquareId, 'd8' as SquareId, 'e8' as SquareId],
    },
    kingSide: {
      rookSquareId: 'h8' as SquareId,
      castleSquareId: 'g8' as SquareId,
      middleSquareId: 'f8' as SquareId,
      middleSquares: ['f8' as SquareId, 'g8' as SquareId],
      targetSquares: ['e8' as SquareId, 'f8' as SquareId, 'g8' as SquareId],
    },
  },
}

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
  a2, a4, a6, a8,
  b1, b3, b5, b7,
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

export const fullColorNames: Record<ColorName, string> = {
  w: 'white',
  b: 'black'
};

export const fullPieceNames: Record<PieceName, string> = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn'
};

export const pieceValues: Record<PieceName, number> = {
  k: 0,
  q: 9,
  r: 5,
  b: 3,
  n: 3,
  p: 1
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

export const DnDType = {
  PIECE: "piece"
}

export type Endgames = {
  endgames: {
    slug: string;
    name: string;
    description: string;
  }[];
}

export type OpeningCategory = {
  slug: string;
  name: string;
  range: string;
  openings: {
    slug: string;
    name: string;
    range: string;
  }[];
}

export type Opening = {
  slug: string;
  name: string;
  range: string;
  lines: Line[];
}

export type Line = {
  eco: string;
  name: string;
  color: string;
  moves: string;
  count: number;
}

export type Position = {
  pieceId: PieceId;
  squareId: SquareId;
}

export type GameSetup = {
  [squareId in SquareId]?: PieceId;
};

export type Endgame = {
  slug: string;
  name: string;
  setup: GameSetup;
  moves: PgnMove[];
  drill: PieceId[];
}