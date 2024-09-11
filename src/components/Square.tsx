import React from 'react';
import './Square.css';

interface SquareProps {
  isLight: boolean;
}

const Square: React.FC<SquareProps> = ({ isLight }) => {
  return <div className={`square ${isLight ? 'light' : 'dark'}`} />;
};

export default Square;