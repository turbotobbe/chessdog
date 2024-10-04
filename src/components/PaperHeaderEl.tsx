import { Box, SxProps, Typography } from "@mui/material";


const PaperHeaderEl: React.FC<{ sx?: SxProps, title: string }> = ({ sx, title }) => {
    return (
        <Box sx={{
            height: 'var(--player-info-height)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...sx
        }}>
            <Typography variant='h4'>{title}</Typography>
        </Box>
    )
}

export default PaperHeaderEl;