import { Box, SxProps, Typography } from "@mui/material";


const AnalysisHeaderEl: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    return (
        <Box sx={{
            height: 'var(--player-info-height)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...sx
        }}>
            <Typography variant='h4'>Analysis</Typography>
        </Box>
    )
}

export default AnalysisHeaderEl;