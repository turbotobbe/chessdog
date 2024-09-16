import React from 'react';
import { Box, Grid } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggablePiece from './DraggablePiece';
import DroppableSquare from './DroppableSquare';

const Chessboard2: React.FC<{ boardState: any }> = ({ boardState }) => {

  // Simple 8x8 chessboard setup
  const boardSquares = [
    ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
    ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
    ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
    ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
    ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
    ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
    ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
    ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
  ];

  function renderSquare(squareId: string) {
    const pieceState = boardState.getPiece(squareId);

    return (
      <DroppableSquare squareId={squareId}>
        {/* Render the piece if it's present */}
        {pieceState && <DraggablePiece pieceInfo={pieceState.pieceInfo} />}
      </DroppableSquare>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        className='chessboard-container'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          className='chessboard'
          sx={{
            width: '100%',
            height: '100%',
            aspectRatio: '1 / 1',
            position: 'relative'
          }}
        >
          <Grid container sx={{ width: '100%', height: '100%' }}>
            {boardSquares.map((row, rowIndex) => (
              row.map((squareId, colIndex) => (
                <Grid
                  item
                  key={squareId}
                  className={`square square-${squareId}`}
                  xs={1.5}
                  sx={{
                    height: '12.5%',
                    backgroundColor: (rowIndex + colIndex) % 2 === 0 ? 'var(--board-brown-light)' : 'var(--board-brown-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {renderSquare(squareId)}
                </Grid>
              ))
            ))}
          </Grid>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default Chessboard2;
