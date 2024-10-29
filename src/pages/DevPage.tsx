import React from 'react';

import ManIcon from '@mui/icons-material/Man';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styled from '@emotion/styled';
import { Box, Typography, useMediaQuery, IconButton, Button, Paper, SxProps, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Divider, Tooltip } from '@mui/material';
import { asImageAlt, asImageSrc } from '@/utils/images';
import { ColorName } from '@/types/chess';
import { PieceName } from '@/types/chess';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import FaceIcon from '@mui/icons-material/Face';
import FlipIcon from '@mui/icons-material/Flip';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { red, yellow, grey } from '@mui/material/colors';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

const DevBox = styled(Box)({
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
});

// const appbar = {
//     xs: 56,
//     sm: 64,
// };

const NavigatorBar: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    // const theme = useTheme();
    // const isLandscape = useMediaQuery('(orientation: landscape)');
    // const appBarHeight = theme.breakpoints.up('sm') ? appbar.sm : appbar.xs;

    return (
        <DevBox className="navigation-bar" sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 1,
            ...sx,
        }}>
            <Button variant="contained"><FirstPageIcon /></Button>
            <Button variant="contained"><ChevronLeftIcon /></Button>
            <Button variant="contained"><ManIcon /></Button>
            <Button variant="contained"><ChevronRightIcon /></Button>
            <Button variant="contained"><LastPageIcon /></Button>
        </DevBox>
    );
};

const CapturedPieces: React.FC<{ colorName: ColorName, pieceName: PieceName, count: number }> = ({ colorName, pieceName, count }) => {
    return <DevBox className="captured-pieces-icons" sx={{ display: 'flex', flexDirection: 'row', height: '24px', marginRight: '-6px' }}>
        <DevBox className="captured-pieces-icons" sx={{ display: 'flex', flexDirection: 'row', '& img:not(:first-of-type)': { marginLeft: '-18px' } }}>
            {Array.from({ length: count }).map((_, i) => (
                <img key={i} src={asImageSrc(colorName, pieceName)} alt={asImageAlt(colorName, pieceName)} style={{ width: '100%', height: '100%' }} />
            ))}
        </DevBox>
    </DevBox>;
};

const PlayerContainer: React.FC<{ color: 'white' | 'black', type: 'human' | 'robot', sx?: SxProps }> = ({ color, type, sx }) => {

    return (
        <DevBox
            className={`player-container ${color}`}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 0,
                ...sx,
            }}
        >
            {type === 'human' ? <FaceIcon /> : <PrecisionManufacturingIcon />}
            <DevBox className="player-name" sx={{ flexShrink: 0 }}>
                <Typography variant="body1" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: .5,
                }}>{type === 'human' ? 'You' : 'Robot'} ({color})</Typography>
            </DevBox>
            <DevBox className="captured-pieces" sx={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 0,
                flexShrink: 1,
                minWidth: 0,
                width: 'auto',  // Add this
                marginLeft: 1,
                marginRight: 1,
                overflow: 'hidden', // Add this to ensure clean cut
            }}>
                <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="q" count={1} />
                <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="r" count={2} />
                <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="b" count={2} />
                <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="n" count={2} />
                <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="p" count={8} />
            </DevBox>
            <DevBox className="player-score" sx={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
            }}>
                <Typography variant="body1" sx={{}}>+1</Typography>
            </DevBox>

            {/* <DevBox className="player-time" sx={{ marginLeft: 1, backgroundColor: 'grey' }}>
                <Typography variant="body1" sx={{ padding: .5, paddingLeft: 1, paddingRight: 1 }}>9:23</Typography>
            </DevBox> */}
        </DevBox>
    );
};

const SheetHeaderContainer: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    // const theme = useTheme();

    return (
        <DevBox
            className="sheet-header-container"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx,
            }}
        >
            <ImageSearchIcon />
            <DevBox className="sheet-header-name" sx={{ flexGrow: 1 }}>
                <Typography variant="body1" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>Sheet Header</Typography>
            </DevBox>
            <DevBox className="sheet-header-time">
                <Button size="small" variant="contained" startIcon={<PlaylistRemoveIcon />}>
                    Reload
                </Button>
            </DevBox>
        </DevBox>
    );
};

const SheetContainer: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    // const theme = useTheme();
    // const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isLandscape = useMediaQuery('(orientation: landscape)');
    return (
        <DevBox
            className="sheet-container"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 1,
                height: '100%',
                width: isLandscape ? 'auto' : '100%',
                ...sx,
            }}
        >
            <SheetHeaderContainer sx={{ gridArea: 'head' }} />
            <DevBox className="sheet-body" sx={{
                flexGrow: 1,
                height: '100%',
                width: isLandscape ? 'auto' : '100%',
                minHeight: 0, // Add this
                display: 'flex', // Add this
                flexDirection: 'column', // Add this
                overflow: 'hidden' // Add this
            }}>

                <TableContainer

                    sx={{
                        maxHeight: '100%',
                        overflow: 'auto',
                        flex: 1, // Add this
                    }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Move</TableCell>
                                <TableCell>White</TableCell>
                                <TableCell>Black</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>e4</TableCell>
                                    <TableCell>e5</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>



            </DevBox>
            <NavigatorBar sx={{ gridArea: 'foot' }} />
        </DevBox>
    );
};

const BoardContainer: React.FC<{}> = ({ }) => {
    return (
        <DevBox
            className="board-container"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 1,
            }}
        >
            <PlayerContainer color="black" type='robot' />
            <DevBox className="board" sx={{
                flexGrow: 1,
                width: 'var(--board-size)',
                height: 'var(--board-size)',
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gridTemplateRows: 'repeat(8, 1fr)',
                aspectRatio: '1',
                backgroundImage: `url('/assets/chessboard.png')`,
                // background-image: url('../assets/chessboard.png');

                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                {Array.from({ length: 8 }).map((_, row) => (
                    Array.from({ length: 8 }).map((_, col) => (
                        <Box key={row * 8 + col} className="cell" sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: (row + col) % 2 === 0 ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                        }}
                        ></Box>
                    ))
                ))}

            </DevBox>
            <PlayerContainer color="white" type='human' />
        </DevBox>
    );
};

const DevPage: React.FC = () => {
    const isLandscape = useMediaQuery('(orientation: landscape)');

    return (
        <Box
            className="dev-page"
        >
            <Paper className="board-paper">
                <BoardContainer />
            </Paper>
            <Paper className="controls-paper">
                <DevBox className="controls-body" sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: isLandscape ? 'column' : 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%',
                    height: '100%',
                }}>
                    <Tooltip title="Flip the board">
                        <IconButton size="small">
                            <FlipIcon />
                        </IconButton>
                    </Tooltip>
                    <Divider orientation={isLandscape ? 'horizontal' : 'vertical'} flexItem />
                    <Tooltip title="Hide evaluation">
                        <IconButton size="small">
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: isLandscape ? 'row' : 'column', justifyContent: 'center', alignItems: 'flex-end', width: '16px', backgroundColor: grey[800] }}>
                        <Box sx={{ height: isLandscape ? '33%' : '100%', backgroundColor: 'white', width: isLandscape ? '100%' : '33%' }}>&nbsp;</Box>
                    </Box>
                    <Divider orientation={isLandscape ? 'horizontal' : 'vertical'} flexItem />
                    <Tooltip title="Toggle arrow color">
                        <IconButton size="small">
                            <CallMissedIcon sx={{ color: yellow[700] }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Toggle square color">
                        <IconButton size="small">
                            <CropSquareIcon sx={{ color: red[500] }} />
                        </IconButton>
                    </Tooltip>
                </DevBox>
            </Paper>
            <Paper className="sheet-paper">
                <SheetContainer />
            </Paper>
        </Box>
    );
};

export default DevPage;
