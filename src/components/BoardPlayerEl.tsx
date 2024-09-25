import { SxProps, Box, IconButton } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';

const BoardPlayerEl: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    return (
        <Box sx={{
            gridArea: 'se',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            ...sx
        }}>
            <IconButton>
                <FirstPageIcon />
            </IconButton>
            <IconButton>
                <NavigateBeforeIcon />
            </IconButton>
            <IconButton>
                <NavigateNextIcon />
            </IconButton>
            <IconButton>
                <LastPageIcon />
            </IconButton>
        </Box>
    )
}

export default BoardPlayerEl;