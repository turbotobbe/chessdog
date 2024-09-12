export type PieceName = 'wk' | 'wq' | 'wr' | 'wb' | 'wn' | 'wp' | 'bk' | 'bq' | 'br' | 'bb' | 'bn' | 'bp';

export class BoardSetup {
  private board: (PieceName | null)[][];

  constructor() {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
  }

  setPiece(row: number, col: number, piece: PieceName | null): void {
    if (row < 0 || row > 7 || col < 0 || col > 7) {
      throw new Error('Invalid position');
    }
    this.board[row][col] = piece;
  }

  getPiece(row: number, col: number): PieceName | undefined {
    if (row < 0 || row > 7 || col < 0 || col > 7) {
      throw new Error('Invalid position');
    }
    return this.board[row][col] ?? undefined;
  }

  clearBoard(): void {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
  }

  setBoard(board: (PieceName | null)[][]): void {
    this.board = board;
  }

  getBoard(): (PieceName | undefined)[][] {
    return this.board.map(row => row.map(piece => piece ?? undefined));
  }

}