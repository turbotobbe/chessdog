import { SxProps, Box, IconButton } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';

type BoardNavigatorElProps = {
    path: number[],
    pathIndex: number,
    setPathIndex: (pathIndex: number) => void
    sx?: SxProps
}
const BoardNavigatorEl: React.FC<BoardNavigatorElProps> = ({
    path,
    pathIndex,
    setPathIndex,
    sx
}) => {

    const handleClickFirst = () => {
        setPathIndex(-1);
    }
    const handleClickLast = () => {
        setPathIndex(path.length - 1);
    }
    const handleClickPrev = () => {
        if (pathIndex - 1 >= -1) {
            setPathIndex(pathIndex - 1);
        }
    }
    const handleClickNext = () => {
        if (pathIndex + 1 < path.length) {
            setPathIndex(pathIndex + 1);
        }
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            ...sx
        }}>
            <IconButton onClick={handleClickFirst} disabled={pathIndex < 0}>
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleClickPrev} disabled={pathIndex < 0}>
                <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={handleClickNext} disabled={pathIndex >= path.length - 1}>
                <NavigateNextIcon />
            </IconButton>
            <IconButton onClick={handleClickLast} disabled={pathIndex >= path.length - 1}>
                <LastPageIcon />
            </IconButton>
        </Box>
    )
}

export default BoardNavigatorEl;