import React from 'react';
import { Box } from '@mui/material';
import { files, PieceId, ranks, SquareId, toPieceInfo, toSquareInfo } from '../models/BoardState';

import bb from '@/assets/bb.png';
import bk from '@/assets/bk.png';
import bn from '@/assets/bn.png';
import bp from '@/assets/bp.png';
import bq from '@/assets/bq.png';
import br from '@/assets/br.png';
import wb from '@/assets/wb.png';
import wk from '@/assets/wk.png';
import wn from '@/assets/wn.png';
import wp from '@/assets/wp.png';
import wq from '@/assets/wq.png';
import wr from '@/assets/wr.png';

interface SquareElProps {
  squareId: SquareId;
  pieceId?: PieceId;
}

const selectImage = (piece: PieceId) => {
  const pieceInfo = toPieceInfo(piece);
  switch (pieceInfo.piece) {
    case 'b':
      return pieceInfo.color === 'b' ? bb : wb;
    case 'k':
      return pieceInfo.color === 'b' ? bk : wk;
    case 'n':
      return pieceInfo.color === 'b' ? bn : wn;
    case 'p':
      return pieceInfo.color === 'b' ? bp : wp;
    case 'q':
      return pieceInfo.color === 'b' ? bq : wq;
    case 'r':
      return pieceInfo.color === 'b' ? br : wr;
    default:
      return undefined;
  } 
}

const SquareEl: React.FC<SquareElProps> = ({ squareId, pieceId }) => {
  const square = toSquareInfo(squareId);
  const rankIndex = ranks.indexOf(square.rank);
  const fileIndex = files.indexOf(square.file);
  const isLight = (rankIndex + fileIndex) % 2 !== 0;

  return (
    <Box
      className={`square-${squareId}`}
      sx={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        backgroundColor: isLight ? '#F0D9B5' : '#B58863',
      }}
    >
      {pieceId && (
        <Box
          className={`piece-${pieceId}`}
          component="img"
          src={selectImage(pieceId) || undefined}
          alt={pieceId}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      )}
    </Box>
  );
};

export default SquareEl;