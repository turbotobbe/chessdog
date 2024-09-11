import React from 'react';
import Square from './Square';

const Chessboard: React.FC = () => {
  const renderSquares = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        squares.push(<Square key={`${row}-${col}`} isLight={isLight} />);
      }
    }
    return squares;
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 50px)',
        gridTemplateRows: 'repeat(8, 50px)',
        width: '400px',
        height: '400px',
      }}
    >
      {renderSquares()}
    </div>
  );
};

export default Chessboard;