import { SquareId } from '@/models/BoardState';
import { Box } from '@mui/material';
import React from 'react';
import { useDrop } from 'react-dnd';

const DroppableSquare: React.FC<{
    squareId: SquareId;
    isLastMove: boolean;
    isValidMove: boolean;
    isCaptureMove: boolean;
    handleDrop: (squareId: SquareId, pieceId: string) => void;
    children: React.ReactNode
}> = ({ squareId, isLastMove, isValidMove, isCaptureMove, handleDrop, children }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'piece',
        drop: (item: { id: string }) => {
            handleDrop(squareId, item.id);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const classNames = ['square','droppable-square']
    if (isCaptureMove) {
        classNames.push('capture-move')
    }
    if (isValidMove) {
        classNames.push('valid-move')
    }
    return (
        <Box
            className={classNames.join(' ')}
            ref={drop}
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: isLastMove ? 'rgba(255, 255, 0, 0.5)' : 'transparent',
                border: isOver ? '4px solid var(--board-yellow-light)' : 'none',
            }}>
            {children}
        </Box>
    );
};

export default DroppableSquare;
