import { SxProps, Box, IconButton } from "@mui/material";
import FlipIcon from '@mui/icons-material/Flip';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const BoardToolsEl: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            ...sx
        }}>
            <IconButton>
                <FlipIcon />
            </IconButton>
            <IconButton>
                <RestartAltIcon />
            </IconButton>
        </Box>
    )
}

export default BoardToolsEl;