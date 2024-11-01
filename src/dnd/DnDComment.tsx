import React from 'react';
import { Box } from '@mui/material';
import { gridZIndexes } from './DnDTypes';

export type DnDCommentProps = {
    message: string;
    bottom?: boolean;
    sx?: React.CSSProperties,
}

const DnDComment: React.FC<DnDCommentProps> = ({
    message,
    bottom = false,
    sx,
}) => {

    return (
        <Box
            className="dnd-comment"
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: gridZIndexes.comment,
                display: 'flex',
                alignItems: bottom ? 'flex-end' : 'flex-start',
                justifyContent: 'center',
                paddingBottom: '40px',
                paddingTop: '40px',
                pointerEvents: 'none',
                ...sx,
            }}
        >
            <Box 
                className="dnd-comment-message" 
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    maxWidth: '80%',
                    textAlign: 'center',
                    pointerEvents: 'none',
                }}
            >
                {message}
            </Box>
        </Box>
    )
};

export default DnDComment;
