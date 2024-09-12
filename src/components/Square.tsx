import React from 'react';
import { Box } from '@mui/material';
import { PieceName } from '../models/BoardState';

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

interface SquareProps {
  isLight: boolean;
  piece?: PieceName;
}

const selectImage = (piece: PieceName) => {
  switch (piece) {
    case 'bb':
      return bb;
    case 'bk':
      return bk;
    case 'bn':
      return bn;
    case 'bp':
      return bp;
    case 'bq':
      return bq;
    case 'br':
      return br;
    case 'wb':
      return wb;
    case 'wk':
      return wk;
    case 'wn':
      return wn;
    case 'wp':
      return wp;
    case 'wq':
      return wq;
    case 'wr':
      return wr;
    default:
      return null;
  }
}

const Square: React.FC<SquareProps> = ({ isLight, piece }) => {
  return (
    <Box
      sx={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        backgroundColor: isLight ? '#F0D9B5' : '#B58863',
      }}
    >
      {piece && (
        <Box
          component="img"
          src={selectImage(piece) || undefined}
          alt={piece}
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

export default Square;