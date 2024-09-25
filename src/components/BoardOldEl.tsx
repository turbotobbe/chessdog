import { Box, SxProps } from "@mui/material";

const Board: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    return (
        <Box className='chessboard'
            sx={{
                display: 'grid',
                width: 'fit-content',
                height: 'fit-content',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gridTemplateRows: 'repeat(8, 1fr)',
                aspectRatio: '1 / 1',
                borderRadius: '4px',
                overflow: 'hidden',
                ...sx
            }}>
            {Array.from({ length: 64 }, (_, index) => (
                <Box className='chessboard-square'
                    key={index}
                    sx={{
                        aspectRatio: '1 / 1',
                        width: 'var(--square-size)',
                        height: 'var(--square-size)',
                        backgroundColor: (index + Math.floor(index / 8)) % 2 === 0 ? 'var(--board-brown-light)' : 'var(--board-brown-dark)'
                    }}
                />
            ))}
        </Box>
    )
}

export default Board;