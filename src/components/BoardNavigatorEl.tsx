import { SxProps, Box, IconButton, Divider } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import DeleteIcon from '@mui/icons-material/Delete';
type BoardNavigatorElProps = {
    path: number[],
    pathIndex: number,
    setPathIndex: (pathIndex: number) => void
    resetBoard: () => void
    sx?: SxProps
}
const BoardNavigatorEl: React.FC<BoardNavigatorElProps> = ({
    path,
    pathIndex,
    setPathIndex,
    resetBoard,
    sx
}) => {

    const handleClickFirst = () => {
        setPathIndex(-1);
    }
    const handleClickLast = () => {
        setPathIndex(path.length - 1);
    }
    const handleClickPrev = () => {
        setPathIndex(pathIndex - 1);
    }
    const handleClickNext = () => {
        setPathIndex(pathIndex + 1);
    }
    const handleClickReset = () => {
        resetBoard()
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            ...sx
        }}>
            <IconButton onClick={handleClickFirst} disabled={path.length === 0 || pathIndex < 0}>
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleClickPrev} disabled={path.length === 0 || pathIndex < 0}>
                <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={handleClickNext} disabled={path.length === 0 || pathIndex >= path.length - 1}>
                <NavigateNextIcon />
            </IconButton>
            <IconButton onClick={handleClickLast} disabled={path.length === 0 || pathIndex >= path.length - 1}>
                <LastPageIcon />
            </IconButton>
            <Divider />
            <IconButton onClick={handleClickReset} disabled={path.length === 0}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}

export default BoardNavigatorEl;