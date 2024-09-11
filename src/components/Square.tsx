import React from 'react';
import './Square.css';
import { PieceName } from '../models/BoardSetup';

interface SquareProps {
  isLight: boolean;
  piece?: PieceName;
}

const Square: React.FC<SquareProps> = ({ isLight, piece }) => {

  return (
    <div className={`square ${isLight ? 'light' : 'dark'}`}>
      {piece && <div className={`piece ${piece}`}/>}
    </div>
  );
};

export default Square;