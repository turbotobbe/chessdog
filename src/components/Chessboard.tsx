import React from 'react';
import { Box, Grid } from '@mui/material';
import SquareEl from './Square';
import { BoardState, files, ranksReverse } from '../models/BoardState';

const Chessboard: React.FC<{ state: BoardState }> = ({ state }) => {


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
          {ranksReverse.map((rank, rankIndex) =>
            files.map((file, fileIndex) => (
              <Grid item xs={1.5} key={`${rankIndex}-${fileIndex}`} sx={{ height: '12.5%' }}>
                <SquareEl
                  square={{file: file, rank: rank}}
                  pieceId={state.getPieceIdAtSquare({file: file, rank: rank}) || undefined}
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