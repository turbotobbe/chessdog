import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

import wk from '../assets/wk.png';
import wq from '../assets/wq.png';
import wr from '../assets/wr.png';
import wb from '../assets/wb.png';
import wn from '../assets/wn.png';
import wp from '../assets/wp.png';

import bk from '../assets/bk.png';
import bq from '../assets/bq.png';
import br from '../assets/br.png';
import bb from '../assets/bb.png';
import bn from '../assets/bn.png';
import bp from '../assets/bp.png';
import { PieceInfo } from '@/models/BoardState';
import { Box } from '@mui/material';

function getPieceImage(piece: PieceInfo) {
    
    switch (piece.pieceName) {
        case 'k':
            return piece.colorName === 'w' ? wk : bk;
        case 'q':
            return piece.colorName === 'w' ? wq : bq;
        case 'r':
            return piece.colorName === 'w' ? wr : br;
        case 'b':
            return piece.colorName === 'w' ? wb : bb;
        case 'n':
            return piece.colorName === 'w' ? wn : bn;
        case 'p':
            return piece.colorName === 'w' ? wp : bp;
    }
}

const DraggablePiece: React.FC<{ pieceInfo: PieceInfo }> = ({ pieceInfo }) => {

    const [{ isDragging }, drag] = useDrag({
    type: 'piece',
    item: { type: 'piece', id: pieceInfo.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Box
     ref={drag}
     sx={{
        opacity: isDragging ? 0.25 : 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
    }}
>
      <img src={getPieceImage(pieceInfo)} alt={`${pieceInfo.colorName}${pieceInfo.pieceName}`} style={{ width: '100%', height: '100%' }} />
      
    </Box>
  );
};

export default DraggablePiece;
