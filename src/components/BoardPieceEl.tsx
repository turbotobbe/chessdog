import { useDrag } from "react-dnd";
import { ColorName, PieceName, SquareId } from "../types/chess";

import { asImageAlt, asImageSrc } from "@/utils/images";

type BoardPieceElProps = {
    squareId: SquareId,
    colorName: ColorName,
    pieceName: PieceName,
    canDrag: boolean,
}
const BoardPieceEl: React.FC<BoardPieceElProps> = ({
    squareId,
    colorName,
    pieceName,
    canDrag
}) => {
    // const [position, setPosition] = useState({ top: 0, left: 0 });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "piece",
        item: { squareId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }), [squareId])

    return (
        <img 
            ref={canDrag ? drag : null} 
            className={`piece ${isDragging ? 'dragging' : ''}`} 
            src={asImageSrc(colorName, pieceName)} 
            alt={asImageAlt(colorName, pieceName)} 
        />
    );
}

export default BoardPieceEl;