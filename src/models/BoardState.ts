export type PieceName = 'wk' | 'wq' | 'wr' | 'wb' | 'wn' | 'wp' | 'bk' | 'bq' | 'br' | 'bb' | 'bn' | 'bp';
export type RankName = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type FileName = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Square = {
  file: FileName;
  rank: RankName;
}
export const ranks: RankName[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const ranksReverse: RankName[] = ['8', '7', '6', '5', '4', '3', '2', '1'];
export const files: FileName[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


export class BoardState {
  private board: (PieceName | null)[][];

  constructor() {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
  }

  setPiece(square: Square, piece: PieceName | null): void {
    const col = files.indexOf(square.file)
    const row = ranks.indexOf(square.rank)
    this.board[row][col] = piece;
  }

  getPiece(square: Square): PieceName | null {
    const col = files.indexOf(square.file)
    const row = ranks.indexOf(square.rank)
    return this.board[row][col];
  }

  clearBoard(): void {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
  }

  clone(): BoardState {
    const newState = new BoardState();
    for (let rank of ranks) {
        for (let file of files) {
            const piece = this.getPiece({rank, file});
            if (piece) {
                newState.setPiece({rank, file}, piece);
            }
        }
    }
    return newState;
}

}