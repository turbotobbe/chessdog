import { useDrag } from "react-dnd";
import { SquareId, pieceFullNames } from "../types/chess";
import wk from '../assets/wk.png';
import wq from '../assets/wq.png';
import wr from '../assets/wr.png';
import wb from '../assets/wb.png';
import wn from '../assets/wn.png';
import wp from '../assets/wp.png';
import bk from '../assets/bk.png';
import bq from '../assets/bq.png';
import br from '../assets/br.png';
import bb from '../assets/bb.png';
import bn from '../assets/bn.png';
import bp from '../assets/bp.png';
import { ChessPieceState } from "@/models/chess";

const pieceImages = {
    'p': { 'w': wp, 'b': bp },
    'n': { 'w': wn, 'b': bn },
    'b': { 'w': wb, 'b': bb },
    'r': { 'w': wr, 'b': br },
    'q': { 'w': wq, 'b': bq },
    'k': { 'w': wk, 'b': bk }
};

type BoardPieceElProps = {
    squareId: SquareId,
    pieceState: ChessPieceState,
    canDrag: boolean,
}
const BoardPieceEl: React.FC<BoardPieceElProps> = ({ squareId, pieceState, canDrag }) => {
    // const [position, setPosition] = useState({ top: 0, left: 0 });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "piece",
        item: { squareId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }), [squareId])

    const pieceImage = pieceImages[pieceState.pieceName]?.[pieceState.colorName];
    if (!pieceImage) return null;

    const altText = `${pieceState.colorName === 'w' ? 'white' : 'black'} ${pieceFullNames[pieceState.pieceName]}`;
    return (
        <img 
            ref={canDrag ? drag : null} 
            className={`piece ${isDragging ? 'dragging' : ''}`} 
            src={pieceImage} 
            alt={altText} 
        />
    );
}

export default BoardPieceEl;