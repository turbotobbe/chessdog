import React from 'react';
import { Box } from '@mui/material';
import { PieceName } from '../models/BoardSetup';

interface SquareProps {
  isLight: boolean;
  piece?: PieceName;
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
          src={`/src/assets/${piece}.png`}
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