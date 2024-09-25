import { SquareId, PieceInfo, pieceFullNames } from "@/models/BoardState";
import { useDrag } from "react-dnd";

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
    pieceInfo: PieceInfo,
    canDrag: boolean,
}
const BoardPieceEl: React.FC<BoardPieceElProps> = ({ squareId, pieceInfo, canDrag }) => {
    // const [position, setPosition] = useState({ top: 0, left: 0 });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "piece",
        item: { squareId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }), [squareId])

    const pieceImage = pieceImages[pieceInfo.pieceName]?.[pieceInfo.colorName];
    if (!pieceImage) return null;

    const altText = `${pieceInfo.colorName === 'w' ? 'white' : 'black'} ${pieceFullNames[pieceInfo.pieceName]}`;
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