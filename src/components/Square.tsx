import React from 'react';
import { Box } from '@mui/material';
import { files, PieceId, ranks, Square } from '../models/BoardState';

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
  square: Square;
  pieceId?: PieceId;
}

const selectImage = (piece: PieceId) => {
  switch (piece) {
    case 'bb1':
    case 'bb2':
      return bb;
    case 'bk':
      return bk;
    case 'bn1':
    case 'bn2':
      return bn;
    case 'bp1':
    case 'bp2':
    case 'bp3':
    case 'bp4':
    case 'bp5':
    case 'bp6':
    case 'bp7':
    case 'bp8':
      return bp;
    case 'bq':
      return bq;
    case 'br1':
    case 'br2':
      return br;
    case 'wb1':
    case 'wb2':
      return wb;
    case 'wk':
      return wk;
    case 'wn1':
    case 'wn2':
      return wn;
    case 'wp1':
    case 'wp2':
    case 'wp3':
    case 'wp4':
    case 'wp5':
    case 'wp6':
    case 'wp7':
    case 'wp8':
      return wp;
    case 'wq':
      return wq;
    case 'wr1':
    case 'wr2':
      return wr;
    default:
      return null;
  }
}

const SquareEl: React.FC<SquareElProps> = ({ square, pieceId }) => {
  const rankIndex = ranks.indexOf(square.rank);
  const fileIndex = files.indexOf(square.file);
  const isLight = (rankIndex + fileIndex) % 2 !== 0;

  return (
    <Box
      className={`square-${square.file}${square.rank}`}
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