import { ChessGameState } from "@/models/chess";
import { ColorName, Move, Player } from "@/types/chess";

class HumanPlayer implements Player {
    private colorName: ColorName;
    public name: string;

    constructor(colorName: ColorName) {
        this.colorName = colorName;
        this.name = colorName === 'w' ? 'Mr. Human White' : 'Mr. Human Black';
        console.log('HumanPlayer constructor', this.name, this.colorName);
    }

    move(_chessGameState: ChessGameState): Move | null {
        // let the human use the mouse to click the square
        return null;
    }
}

export default HumanPlayer;