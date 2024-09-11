import React from 'react';
import Chessboard from './Chessboard';
import './Analysis.css';

const Analysis: React.FC = () => {
  return (
    <div className="analysis-container">
      <Chessboard />
    </div>
  );
};

export default Analysis;