import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useChessBoard } from '@/contexts/ChessBoardContext';
import { defaultChessBoardController } from '@/controllers/DefaultChessBoardController';
import { GridColorName } from '@/dnd/DnDTypes';
import { BoardPaper } from '@/elements/BoardPaper';
import { ControlsPaper } from '@/elements/ControlsPaper';
import { SheetPaper } from '@/elements/SheetPaper';
import { setupChessBoardState } from '@/contexts/ChessBoardState';

// const DevBox = styled(Box)({
//     // backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 6,
// });

// // const appbar = {
// //     xs: 56,
// //     sm: 64,
// // };

// const NavigatorBar: React.FC<{ sx?: SxProps }> = ({ sx }) => {
//     // const theme = useTheme();
//     // const isLandscape = useMediaQuery('(orientation: landscape)');
//     // const appBarHeight = theme.breakpoints.up('sm') ? appbar.sm : appbar.xs;

//     return (
//         <DevBox className="navigation-bar" sx={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'center',
//             gap: 1,
//             ...sx,
//         }}>
//             <Button variant="contained"><FirstPageIcon /></Button>
//             <Button variant="contained"><ChevronLeftIcon /></Button>
//             <Button variant="contained"><ManIcon /></Button>
//             <Button variant="contained"><ChevronRightIcon /></Button>
//             <Button variant="contained"><LastPageIcon /></Button>
//         </DevBox>
//     );
// };

// const CapturedPieces: React.FC<{ colorName: ColorName, pieceName: PieceName, count: number }> = ({ colorName, pieceName, count }) => {
//     return <DevBox className="captured-pieces-icons" sx={{ display: 'flex', flexDirection: 'row', height: '24px', marginRight: '-6px' }}>
//         <DevBox className="captured-pieces-icons" sx={{ display: 'flex', flexDirection: 'row', '& img:not(:first-of-type)': { marginLeft: '-18px' } }}>
//             {Array.from({ length: count }).map((_, i) => (
//                 <img key={i} src={asImageSrc(colorName, pieceName)} alt={asImageAlt(colorName, pieceName)} style={{ width: '100%', height: '100%' }} />
//             ))}
//         </DevBox>
//     </DevBox>;
// };

// const PlayerContainer: React.FC<{ color: 'white' | 'black', type: 'human' | 'robot', sx?: SxProps }> = ({ color, type, sx }) => {

//     return (
//         <DevBox
//             className={`player-container ${color}`}
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 minWidth: 0,
//                 ...sx,
//             }}
//         >
//             {type === 'human' ? <FaceIcon /> : <PrecisionManufacturingIcon />}
//             <DevBox className="player-name" sx={{ flexShrink: 0 }}>
//                 <Typography variant="body1" sx={{
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                     whiteSpace: 'nowrap',
//                     padding: .5,
//                 }}>{type === 'human' ? 'You' : 'Robot'} ({color})</Typography>
//             </DevBox>
//             <DevBox className="captured-pieces" sx={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 flexGrow: 0,
//                 flexShrink: 1,
//                 minWidth: 0,
//                 width: 'auto',  // Add this
//                 marginLeft: 1,
//                 marginRight: 1,
//                 overflow: 'hidden', // Add this to ensure clean cut
//             }}>
//                 <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="q" count={1} />
//                 <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="r" count={2} />
//                 <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="b" count={2} />
//                 <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="n" count={2} />
//                 <CapturedPieces colorName={color === 'white' ? 'b' : 'w'} pieceName="p" count={8} />
//             </DevBox>
//             <DevBox className="player-score" sx={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 flexGrow: 1,
//             }}>
//                 <Typography variant="body1" sx={{}}>+1</Typography>
//             </DevBox>

//             {/* <DevBox className="player-time" sx={{ marginLeft: 1, backgroundColor: 'grey' }}>
//                 <Typography variant="body1" sx={{ padding: .5, paddingLeft: 1, paddingRight: 1 }}>9:23</Typography>
//             </DevBox> */}
//         </DevBox>
//     );
// };

// const SheetHeaderContainer: React.FC<{ sx?: SxProps }> = ({ sx }) => {
//     // const theme = useTheme();

//     return (
//         <DevBox
//             className="sheet-header-container"
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 ...sx,
//             }}
//         >
//             <ImageSearchIcon />
//             <DevBox className="sheet-header-name" sx={{ flexGrow: 1 }}>
//                 <Typography variant="body1" sx={{
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                     whiteSpace: 'nowrap',
//                 }}>Sheet Header</Typography>
//             </DevBox>
//             <DevBox className="sheet-header-time">
//                 <Button size="small" variant="contained" startIcon={<PlaylistRemoveIcon />}>
//                     Reload
//                 </Button>
//             </DevBox>
//         </DevBox>
//     );
// };

// const SheetContainer: React.FC<{ sx?: SxProps }> = ({ sx }) => {
//     // const theme = useTheme();
//     // const isXs = useMediaQuery(theme.breakpoints.only('xs'));
//     const isLandscape = useMediaQuery('(orientation: landscape)');
//     return (
//         <DevBox
//             className="sheet-container"
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 1,
//                 p: 1,
//                 height: '100%',
//                 width: isLandscape ? 'auto' : '100%',
//                 ...sx,
//             }}
//         >
//             <SheetHeaderContainer sx={{ gridArea: 'head' }} />
//             <DevBox className="sheet-body" sx={{
//                 flexGrow: 1,
//                 height: '100%',
//                 width: isLandscape ? 'auto' : '100%',
//                 minHeight: 0, // Add this
//                 display: 'flex', // Add this
//                 flexDirection: 'column', // Add this
//                 overflow: 'hidden' // Add this
//             }}>

//                 <TableContainer

//                     sx={{
//                         maxHeight: '100%',
//                         overflow: 'auto',
//                         flex: 1, // Add this
//                     }}>
//                     <Table stickyHeader size="small">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Move</TableCell>
//                                 <TableCell>White</TableCell>
//                                 <TableCell>Black</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {Array.from({ length: 20 }).map((_, i) => (
//                                 <TableRow key={i}>
//                                     <TableCell>{i + 1}</TableCell>
//                                     <TableCell>e4</TableCell>
//                                     <TableCell>e5</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>



//             </DevBox>
//             <NavigatorBar sx={{ gridArea: 'foot' }} />
//         </DevBox>
//     );
// };

// const BoardContainer: React.FC<{}> = ({ }) => {
//     return (
//         <DevBox
//             className="board-container"
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 1,
//                 p: 1,
//             }}
//         >
//             <PlayerContainer color="black" type='robot' />
//             <DevBox className="board" sx={{
//                 flexGrow: 1,
//                 width: 'var(--board-size)',
//                 height: 'var(--board-size)',
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(8, 1fr)',
//                 gridTemplateRows: 'repeat(8, 1fr)',
//                 aspectRatio: '1',
//                 backgroundImage: `url('/assets/chessboard.png')`,
//                 // background-image: url('../assets/chessboard.png');

//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//             }}>
//                 {Array.from({ length: 8 }).map((_, row) => (
//                     Array.from({ length: 8 }).map((_, col) => (
//                         <Box key={row * 8 + col} className="cell" sx={{
//                             width: '100%',
//                             height: '100%',
//                             backgroundColor: (row + col) % 2 === 0 ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
//                         }}
//                         ></Box>
//                     ))
//                 ))}

//             </DevBox>
//             <PlayerContainer color="white" type='human' />
//         </DevBox>
//     );
// };

const DevPage: React.FC = () => {
    const { addController } = useChessBoard();
    const [chessBoardKey, setChessBoardKey] = useState<string | null>(null);
    const [asWhite, setAsWhite] = useState<boolean>(true);
    const [arrowColorName, setArrowColorName] = useState<GridColorName>('orange');
    const [markColorName, setMarkColorName] = useState<GridColorName>('red');

    const state = setupChessBoardState({
        'e1': 'wk1',
        'e8': 'bk1',
        'b2': 'bp1',
        'c2': 'bp2',
        'd2': 'bp3',
        'e2': 'bp4',
        'e7': 'wp4',
        'd7': 'wp5',
    });


    const chessBoards = [{
        key: "Explore",
        controller: defaultChessBoardController(true, true, state.clone())
    }, {
        key: "Play",
        controller: defaultChessBoardController(true, false, state.clone())
    }];

    useEffect(() => {
        chessBoards.forEach((chessBoard) => {
            addController(chessBoard.key, chessBoard.controller);
        });
        setChessBoardKey(chessBoards[0].key);
    }, []);

    if (!chessBoardKey) {
        return null;
    }

    return (
        <Box className="dev-page">
            <BoardPaper
                chessBoardKey={chessBoardKey}
                asWhite={asWhite}
                arrowColorName={arrowColorName}
                markColorName={markColorName}
            />
            <ControlsPaper
                chessBoardKey={chessBoardKey}
                asWhite={asWhite}
                setAsWhite={setAsWhite}
                arrowColorName={arrowColorName}
                setArrowColorName={setArrowColorName}
                markColorName={markColorName}
                setMarkColorName={setMarkColorName}
            />
            <SheetPaper
                chessBoardKey={chessBoardKey}
                chessBoardKeys={chessBoards.map((chessBoard) => chessBoard.key)}
                onSelectChessBoardKey={setChessBoardKey}
            />
        </Box>
    )
};

export default DevPage;
