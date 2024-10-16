import { useDrag } from "react-dnd";
import { ColorName, PieceName, SquareId } from "../types/chess";

import { asImageAlt, asImageSrc } from "@/utils/images";
import { Box } from "@mui/material";

type BoardPieceElProps = {
    squareId: SquareId,
    colorName: ColorName,
    pieceName: PieceName,
    canDrag: boolean,
    overlay?: string,
}
const BoardPieceEl: React.FC<BoardPieceElProps> = ({
    squareId,
    colorName,
    pieceName,
    // canDrag,
    overlay
}) => {
    // const [position, setPosition] = useState({ top: 0, left: 0 });
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: "piece",
        item: { squareId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }), [squareId])

    const overlayClass = overlay ? `overlay ${overlay}` : '';
    // console.log("isDragging", squareId, isDragging)
    return (
        <>
            {isDragging && <Box
                ref={preview}>
                <img
                    style={{
                        width: 'var(--square-size)',
                        height: 'var(--square-size)',
                    }}
                    src={asImageSrc(colorName, pieceName)}
                    alt={asImageAlt(colorName, pieceName)}
                />
            </Box>}
            <Box
                ref={drag}
                className={`loc ${squareId} piece ${isDragging ? 'dragging' : ''} ${overlayClass}`} >
                <img
                    className="piece"
                    src={asImageSrc(colorName, pieceName)}
                    alt={asImageAlt(colorName, pieceName)}
                />
            </Box>
        </>
    );
}

export default BoardPieceEl;