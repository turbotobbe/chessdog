import { BoardState } from "@/models/BoardState";
import { ChessGameState } from "@/models/chess";
import { ColorName, Move, Player } from "@/types/chess";

class OpeningPlayer implements Player {
    // private colorName: ColorName;
    public name: string;
    private boardState: BoardState;
    private path: number[];
    private pathIndex: number;

    constructor(colorName: ColorName, boardState: BoardState, path: number[], pathIndex: number) {
        this.boardState = boardState;
        this.path = path;
        this.pathIndex = pathIndex;
        // this.colorName = colorName;
        this.name = colorName === 'w' ? 'Mr. Opeing White' : 'Mr. Opening Black';
        // console.log('OpeningPlayer constructor', this.name, this.colorName);
    }

    move(_chessGameState: ChessGameState): Move | null {

        // Sleep for 100 ms
        const start = Date.now()
        while (Date.now() - start < 100) {
            // Wait for 100 ms
        }

        let nodes = this.boardState.nodes;
        for (let i = 0; i <= this.pathIndex; i++) {
            const lineIndex = this.path[i];
            nodes = nodes[lineIndex].nodes;
        }

        const randomIndex = Math.floor(Math.random() * nodes.length);

        return {
            sourceSquareId: nodes[randomIndex].sourceSquareId,
            targetSquareId: nodes[randomIndex].targetSquareId,
            promotionPieceName: 'q',
        };
    }
}

export default OpeningPlayer;