import React from 'react';
import { Box } from '@mui/material';
import { lightSquareIds, PieceInfo, PieceState, SquareId } from '../models/BoardState';

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
  pieceState?: PieceState;
}

const selectImage = (pieceInfo: PieceInfo) => {
  switch (pieceInfo.pieceName) {
    case 'b':
      return pieceInfo.colorName === 'b' ? bb : wb;
    case 'k':
      return pieceInfo.colorName === 'b' ? bk : wk;
    case 'n':
      return pieceInfo.colorName === 'b' ? bn : wn;
    case 'p':
      return pieceInfo.colorName === 'b' ? bp : wp;
    case 'q':
      return pieceInfo.colorName === 'b' ? bq : wq;
    case 'r':
      return pieceInfo.colorName === 'b' ? br : wr;
    default:
      return undefined;
  } 
}

const SquareEl: React.FC<SquareElProps> = ({ squareId, pieceState }) => {

  const isLightSquare = lightSquareIds.includes(squareId);

  return (
    <Box
      className={`square-${squareId}`}
      sx={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        backgroundColor: isLightSquare ? '#F0D9B5' : '#B58863',
      }}
    >
      {pieceState && (
        <Box
          className={`piece-${pieceState.pieceInfo.id}`}
          component="img"
          src={selectImage(pieceState.pieceInfo) || undefined}
          alt={pieceState.pieceInfo.id}
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