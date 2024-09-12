import React from 'react';
import { Box, Grid } from '@mui/material';
import SquareEl from './Square';
import { BoardState, files, ranksReverse, toSquareId } from '../models/BoardState';

const Chessboard: React.FC<{ board: BoardState }> = ({ board }) => {


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
          {ranksReverse.map((rank) =>
            files.map((file) => (
              <Grid item xs={1.5} key={toSquareId({file: file, rank: rank})} sx={{ height: '12.5%' }}>
                <SquareEl
                  squareId={toSquareId({file: file, rank: rank})}
                  pieceId={board.getPieceIdAtSquare(toSquareId({file: file, rank: rank})) || undefined}
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