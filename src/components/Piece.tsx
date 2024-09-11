import React from 'react';
import KingSVG from '../assets/king.svg';
import QueenSVG from '../assets/queen.svg';
import BishopSVG from '../assets/bishop.svg';
import KnightSVG from '../assets/knight.svg';
import RookSVG from '../assets/rook.svg';
import PawnSVG from '../assets/pawn.svg';
import './Piece.css';

type PieceType = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn';
type PieceColor = 'white' | 'black';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

const pieceComponents: Record<PieceType, string> = {
  king: KingSVG,
  queen: QueenSVG,
  bishop: BishopSVG,
  knight: KnightSVG,
  rook: RookSVG,
  pawn: PawnSVG,
};

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const pieceSrc = pieceComponents[type];

  return (
    <div className={`piece ${color}`}>
      <img src={pieceSrc} alt={`${color} ${type}`} className={`piece-image ${color}`} />
    </div>
  );
};

export default Piece;