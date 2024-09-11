import React from 'react';
import Square from './Square';
import './Chessboard.css';
import { BoardSetup } from '../models/BoardSetup';

interface ChessboardProps {
  boardSetup: BoardSetup;
}

const Chessboard: React.FC<ChessboardProps> = ({ boardSetup }) => {

  const renderSquares = () => {
    const squares = [];
    for (let row = 7; row >= 0; row--) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 !== 0;  // Change this line
        const piece = boardSetup.getPiece(row, col);
        squares.push(
          <Square 
            key={`${row}-${col}`} 
            isLight={isLight} 
            piece={piece}
          />
        );
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