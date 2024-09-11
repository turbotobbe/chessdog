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

  setDefaultSetup(): void {
    this.clearBoard();
    this.setPiece(0,0,'wr');
    this.setPiece(0,7,'wr');
    this.setPiece(7,0,'br');
    this.setPiece(7,7,'br');
    this.setPiece(0,1,'wn');
    this.setPiece(0,6,'wn');
    this.setPiece(7,1,'bn');
    this.setPiece(7,6,'bn');
    this.setPiece(0,2,'wb');
    this.setPiece(0,5,'wb');
    this.setPiece(7,2,'bb');
    this.setPiece(7,5,'bb');
    this.setPiece(0,3,'wq');
    this.setPiece(0,4,'wk');
    this.setPiece(7,3,'bq');
    this.setPiece(7,4,'bk');
    for (let col = 0; col < 8; col++) {
      this.setPiece(1, col, 'wp');
      this.setPiece(6, col, 'bp');
    }
  }

  setQueenEndGameSetup(): void {
    this.clearBoard();
    // store all coordinates of the board in an array
    const coordinates = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        coordinates.push([row, col]);
      }
    }
    // shuffle the coordinates
    coordinates.sort(() => Math.random() - 0.5);
    console.log(coordinates);
    
    // get first coordinate
    const [row, col] = coordinates[0];
    this.setPiece(row, col, 'wk');
    coordinates.splice(0, 1);

    // get second coordinate
    const [row2, col2] = coordinates[0];
    this.setPiece(row2, col2, 'wq');
    coordinates.splice(0, 1);

    let done = false;
    while (!done) {
        // get third coordinate
        const [row3, col3] = coordinates[0];
        coordinates.splice(0, 1);

        // check if the piece is in the same row, column, or diagonal as the queen
        if (row3 === row || col3 === col || Math.abs(row3 - row) === Math.abs(col3 - col)) {
            continue;
        }

        // check if the piece is adjecent to the king
        if (Math.abs(row3 - row) <= 1 && Math.abs(col3 - col) <= 1) {
            continue;
        }

        this.setPiece(row3, col3, 'bk');
        done = true;
    }
    
  }

  clearBoard(): void {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
  }

  getBoard(): (PieceName | undefined)[][] {
    return this.board.map(row => row.map(piece => piece ?? undefined));
  }

}