import React from 'react';

interface SquareProps {
  isLight: boolean;
}

const Square: React.FC<SquareProps> = ({ isLight }) => {
  const backgroundColor = isLight ? '#f0d9b5' : '#b58863';

  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor,
      }}
    />
  );
};

export default Square;