import { Box, IconButton, SxProps, Tooltip } from "@mui/material";
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import { GridColorName, gridColorNames } from "@/dnd/DnDTypes";
import CheckBoxOutlineBlankTwoToneIcon from '@mui/icons-material/CheckBoxOutlineBlankTwoTone';
import ShuffleTwoToneIcon from '@mui/icons-material/ShuffleTwoTone';
type BoardActionsProps = {
    asWhite: boolean
    markColorName: GridColorName
    arrowColorName: GridColorName
    onToggleAsWhite: (asWhite: boolean) => void
    onMarkColorChange: (markColorName: GridColorName) => void
    onArrowColorChange: (arrowColorName: GridColorName) => void
    sx?: SxProps
}

const OutlinedRoundButton = ({ color, onClick, children }: {
    onClick: () => void,
    color: string,
    children: React.ReactNode,
    sx?: SxProps
}) => {
    return (
        <IconButton
            size="small"
            className={`color-icon-${color}`}
            sx={{
                marginTop: 0.5,
                marginBottom: 0.5,
                backgroundColor: `var(--chess-highlight-${color})`,
                '&:hover': {
                    backgroundColor: `var(--chess-highlight-${color})`,
                    filter: 'brightness(1.2)',
                },
            }}
            onClick={onClick}
        >
            {children}
        </IconButton>
    );
};

export const BoardActions: React.FC<BoardActionsProps> = ({
    asWhite,
    markColorName,
    arrowColorName,
    onToggleAsWhite,
    onMarkColorChange,
    onArrowColorChange,
    sx
}) => {

    const handleMarkColorChange = () => {
        const nextMarkColorName = gridColorNames[(gridColorNames.indexOf(markColorName) + 1) % gridColorNames.length];
        onMarkColorChange(nextMarkColorName);
    }

    const handleArrowColorChange = () => {
        const nextArrowColorName = gridColorNames[(gridColorNames.indexOf(arrowColorName) + 1) % gridColorNames.length];
        onArrowColorChange(nextArrowColorName);
    }

    // export type GridColorName = "red" | "blue" | "yellow" | "green" | "orange";


    return (
        <Box
            className='board-actions'
            sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                ...sx
            }}>
            {/* <Tooltip title={asWhite ? "Flip to black's perspective" : "Flip to white's perspective"}>

                <IconButton onClick={() => onToggleAsWhite(!asWhite)}>
                    <FlipCameraAndroidIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={`Toggle through available mark colors. Next is ${gridColorNames[(gridColorNames.indexOf(markColorName) + 1) % gridColorNames.length]}`}>
                <IconButton onClick={handleMarkColorChange} >
                    <CheckBoxOutlineBlankTwoToneIcon className={`color-icon-${markColorName}`} />
                </IconButton>
            </Tooltip> */}

            {/* <Tooltip title={`Toggle through available arrow colors. Next is ${gridColorNames[(gridColorNames.indexOf(arrowColorName) + 1) % gridColorNames.length]}`}> */}

            <OutlinedRoundButton
                color={markColorName}
                onClick={handleMarkColorChange}
            >
                <Tooltip title={"Toggle through available mark colors."}>
                    <CheckBoxOutlineBlankTwoToneIcon fontSize="inherit" />
                </Tooltip>
            </OutlinedRoundButton>

            <Tooltip title={asWhite ? "Flip to black's perspective" : "Flip to white's perspective"}>
                <IconButton onClick={() => onToggleAsWhite(!asWhite)} size="small">
                    <FlipCameraAndroidIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>

            <OutlinedRoundButton
                color={arrowColorName}
                onClick={handleArrowColorChange}
            >
                <Tooltip title={"Toggle through available arrow colors."}>
                    <ShuffleTwoToneIcon fontSize="inherit" />
                </Tooltip>
            </OutlinedRoundButton>

        </Box>
    )
}
