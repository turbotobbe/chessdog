import { Box, Typography } from "@mui/material";

import wp from '../assets/wp.png';
import wr from '../assets/wr.png';
import wn from '../assets/wn.png';
import wb from '../assets/wb.png';
import wq from '../assets/wq.png';
// import wk from '../assets/wk.png';
import bp from '../assets/bp.png';
import br from '../assets/br.png';
import bn from '../assets/bn.png';
import bb from '../assets/bb.png';
import bq from '../assets/bq.png';
// import bk from '../assets/bk.png';

type PieceCollectionElProps = {
    pieces: { src: string; alt: string }[]
}

const PieceCollectionEl: React.FC<PieceCollectionElProps> = ({
    pieces,
}) => (
    <Box
        className={`piece-collection`}
        sx={{
            display: 'flex',
            height: '100%',
            position: 'relative',
            width: `${15 + (pieces.length * 8)}px`, // Adjust width based on number of pieces
        }}>
        {pieces.map((piece, index) => (
            <img
                key={index}
                src={piece.src}
                alt={piece.alt}
                style={{
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    position: 'absolute',
                    top: 0,
                    left: `${index * 8}px`
                }}
            />
        ))}
    </Box>
);

type CapturesElProps = {
    color: string,
    pieces: { src: string; alt: string }[],
    value: number
}

const CapturesEl: React.FC<CapturesElProps> = ({
    pieces,
    value
}) => (
    <Box
        className="captures"
        sx={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
        }}>
        {[[wp, bp], [wn, bn], [wb, bb], [wr, br], [wq, bq]].map(([w, b], index) => {
            const filteredPieces = pieces.filter((piece: { src: string; alt: string }) => piece.src === w || piece.src === b);
            if (filteredPieces.length > 0) {
                return <PieceCollectionEl
                 key={index} pieces={filteredPieces} />
            }
        })}
        {value > 0 && <Typography
            className={`captures-value`}
            variant="body1"
            ml={1}>+{value}</Typography>}

    </Box>
)

export default CapturesEl;