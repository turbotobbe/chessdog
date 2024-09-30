import { Box, Typography } from "@mui/material";

import { PieceId, PieceInfo } from "@/types/chess";

import { asPieceInfo } from "@/models/chess";
import { asImageSrc, asImageAlt } from "@/utils/images";

type PieceCollectionElProps = {
    pieceInfos: PieceInfo[]
}

const PieceCollectionEl: React.FC<PieceCollectionElProps> = ({
    pieceInfos: pieces,
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
                src={asImageSrc(piece.colorName, piece.pieceName)}
                alt={asImageAlt(piece.colorName, piece.pieceName)}
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
    pieceIds: PieceId[],
    pieceValue: number
}

const CapturesEl: React.FC<CapturesElProps> = ({
    pieceIds,
    pieceValue
}) => (
    <Box
        className="captures"
        sx={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
        }}>
        {['p', 'n', 'b', 'r', 'q'].map((pieceName, index) => {
            const filteredPieces = pieceIds.map(asPieceInfo).filter((pieceInfo) => pieceInfo.pieceName === pieceName);
            if (filteredPieces.length > 0) {
                return <PieceCollectionEl
                    key={index} pieceInfos={filteredPieces} />
            }
        })}
        {pieceValue > 0 && <Typography
            className={`captures-value`}
            variant="body1"
            ml={1}>+{pieceValue}</Typography>}

    </Box>
)

export default CapturesEl;