import React from 'react';
import Square from './Square';
import './Chessboard.css';

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
    <div className="chessboard-container">
      <div className="chessboard">
        {renderSquares()}
      </div>
    </div>
  );
};

export default Chessboard;