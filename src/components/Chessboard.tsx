import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import SquareEl from './Square';
import { BoardState, SquareId } from '../models/BoardState';

const Chessboard: React.FC<{ boardState: BoardState }> = ({ boardState }) => {
  const [selectedSquare, setSelectedSquare] = useState<SquareId | null>(null);

  useEffect(() => {
    console.log('Selected square:', selectedSquare);
  }, [selectedSquare]);

  const handleBoardClick = () => {
    console.log('Board clicked');
  };

  const boardSquares: SquareId[][] = [
    ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
    ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
    ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
    ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
    ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
    ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
    ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
    ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
  ];

  return (
    <Box 
      onClick={handleBoardClick}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{
        height: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
        aspectRatio: '1 / 1'
      }}>
        <Grid container>
          {boardSquares.map((row) =>
            row.map((squareId) => (
              <Grid item xs={1.5} key={squareId} sx={{ height: '12.5%' }}>
                <SquareEl
                  squareId={squareId}
                  pieceState={boardState.getPiece(squareId) || undefined}
                  isSelected={selectedSquare === squareId}
                  isValidMove={selectedSquare !== null && boardState.getPiece(selectedSquare)?.getValidMoves().includes(squareId) || false}
                  onClick={() => setSelectedSquare(squareId)}
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