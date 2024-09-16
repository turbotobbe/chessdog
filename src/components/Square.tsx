import React from 'react';
import { Box } from '@mui/material';
import { lightSquareIds, PieceInfo, PieceState, SquareId } from '../models/BoardState';
import './Square.css';
import bb from '@/assets/bb.png';
import bk from '@/assets/bk.png';
import bn from '@/assets/bn.png';
import bp from '@/assets/bp.png';
import bq from '@/assets/bq.png';
import br from '@/assets/br.png';
import wb from '@/assets/wb.png';
import wk from '@/assets/wk.png';
import wn from '@/assets/wn.png';
import wp from '@/assets/wp.png';
import wq from '@/assets/wq.png';
import wr from '@/assets/wr.png';

interface SquareElProps {
  squareId: SquareId;
  isSelected: boolean;
  isHovered: boolean;
  isValidMove: boolean;
  onMouseUp: (event: React.MouseEvent) => void;
  onMouseDown: (event: React.MouseEvent) => void;
  onDragStart: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  pieceState?: PieceState;
}

const selectImage = (pieceInfo: PieceInfo) => {
  switch (pieceInfo.pieceName) {
    case 'b':
      return pieceInfo.colorName === 'b' ? bb : wb;
    case 'k':
      return pieceInfo.colorName === 'b' ? bk : wk;
    case 'n':
      return pieceInfo.colorName === 'b' ? bn : wn;
    case 'p':
      return pieceInfo.colorName === 'b' ? bp : wp;
    case 'q':
      return pieceInfo.colorName === 'b' ? bq : wq;
    case 'r':
      return pieceInfo.colorName === 'b' ? br : wr;
    default:
      return undefined;
  }
}

const SquareEl: React.FC<SquareElProps> = ({
  squareId,
  isSelected,
  isHovered,
  isValidMove,
  onMouseUp,
  onMouseDown,
  onDragStart,
  onDragOver,
  onDrop,
  pieceState,
}) => {
  const isLightSquare = lightSquareIds.includes(squareId);

  return (
    <Box
      className={`square ${isLightSquare ? 'light' : 'dark'} square-${squareId} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isValidMove ? 'valid-move' : ''}`}
      sx={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        cursor: 'default',
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDrop={(e) => onDrop(e)}
    >
      {pieceState && (
        <Box
          className={`piece piece-${pieceState.pieceInfo.id}`}
          component="img"
          src={selectImage(pieceState.pieceInfo) || undefined}
          alt={pieceState.pieceInfo.id}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            cursor: 'grab',
            userSelect: 'none',
          }}
          draggable
          onMouseUp={(e) => {
            e.stopPropagation();
            onMouseUp(e);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onMouseDown(e);
          }}
          onDragStart={(e) => {
            e.currentTarget.classList.add('dragging');

            const pieceImage = new Image();
            pieceImage.src = selectImage(pieceState.pieceInfo) || '';

            // Ensure the image is fully loaded before using it
            pieceImage.onload = () => {
              e.dataTransfer.setDragImage(pieceImage, 0, 0);
            };
            onDragStart(e);
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('dragging');
          }}
        />
      )}
    </Box>
  );
};

export default SquareEl;