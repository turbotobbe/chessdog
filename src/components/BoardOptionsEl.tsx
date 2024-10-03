import { SxProps, Box, IconButton } from "@mui/material";
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
type BoardOptionsElProps = {
    isAsWhite: boolean
    asWhite: (isAsWhite: boolean) => void
    sx?: SxProps
}
const BoardOptionsEl: React.FC<BoardOptionsElProps> = ({
    isAsWhite,
    asWhite,
    sx
}) => {

    const handleClickAsWhite = () => {
        asWhite(!isAsWhite)
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            ...sx
        }}>
            <IconButton onClick={handleClickAsWhite}>
                <FlipCameraAndroidIcon />
            </IconButton>
        </Box>
    )
}

export default BoardOptionsEl;