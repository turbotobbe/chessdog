import { Box } from '@mui/material';
import React from 'react';
import { useDrop } from 'react-dnd';

const DroppableSquare: React.FC<{ squareId: string; children: React.ReactNode }> = ({ squareId, children }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'piece',
        drop: (item: { id: string }) => {
            console.log(`Piece ${item.id} dropped on square ${squareId}`);
            // Handle the move logic here
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <Box
            ref={drop}
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: isOver ? 'rgba(255, 255, 0, 0.5)' : 'transparent'
            }}>
            {children}
        </Box>
    );
};

export default DroppableSquare;
