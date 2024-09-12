import React from 'react';
import { Box, Grid } from '@mui/material';
import Square from './Square';
import { PieceName } from '../models/BoardSetup';

const Chessboard: React.FC = () => {
  const initialBoard: (PieceName | null)[][] = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Box sx={{ 
        height: '100%', 
        maxHeight: '100%',
        maxWidth: '100%',
        aspectRatio: '1 / 1'
      }}>
        <Grid container>
          {initialBoard.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <Grid item xs={1.5} key={`${rowIndex}-${colIndex}`} sx={{ height: '12.5%' }}>
                <Square
                  isLight={(rowIndex + colIndex) % 2 === 0}
                  piece={piece as PieceName}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Chessboard;