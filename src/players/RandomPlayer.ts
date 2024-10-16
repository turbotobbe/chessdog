import { ChessGameState, ChessPieceState } from "@/models/chess";
import { ColorName, Move, Player, SquareId, squareIds } from "@/types/chess";

class RandomPlayer implements Player {
    private colorName: ColorName;
    public name: string;

    constructor(colorName: ColorName) {
        this.colorName = colorName;
        this.name = colorName === 'w' ? 'Mr. Random White' : 'Mr. Random Black';
    }

    move(chessGameState: ChessGameState): Move | null {

        // Sleep for 100 ms
        const start = Date.now()
        while (Date.now() - start < 100) {
            // Wait for 100 ms
        }

        let availables: { squareId: SquareId, piece: ChessPieceState }[] = [];
        squareIds.forEach(squareId => {
            const chessPieceState = chessGameState.getPieceAt(squareId);
            if (chessPieceState) {
                if (chessPieceState.colorName === this.colorName) {
                    availables.push({ squareId, piece: chessPieceState });
                }
            }
        });
        availables.sort(() => Math.random() - 0.5);

        for (const available of availables) {
            const piece = available.piece;
            if (piece.validMoveSquareIds.length > 0) {
                const randomTargetSquareId = piece.validMoveSquareIds[Math.floor(Math.random() * piece.validMoveSquareIds.length)];
                return {
                    sourceSquareId: available.squareId,
                    targetSquareId: randomTargetSquareId,
                    promotionPieceName: 'q',
                };
            }
        }
        return null;
    }
}

export default RandomPlayer;