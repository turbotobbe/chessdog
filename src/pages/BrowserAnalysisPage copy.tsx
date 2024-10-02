// import { Box, Typography, useTheme } from '@mui/material';
// import React, { useEffect, useState } from 'react';


// import { parsePgn, PgnGame } from '@/utils/pgn';
// import BoardPaperEl from '@/components/BoardPaperEl';
// import AnalysisPaperEl from '@/components/AnalysisPaperEl';
// import { BoardNodeState, BoardState, loadBoardState } from '@/models/BoardState';
// import { ChessGameState, nextChessGameState } from '@/models/chess';
// import { PieceName, SquareId } from '@/types/chess';

// // const loggedInUser = 'PhonkCheck'

// // const results = {
// //     'win': "Win",
// //     'checkmated': "Checkmated",
// //     'agreed': "Draw agreed",
// //     'repetition': "Draw by repetition",
// //     'timeout': "Timeout",
// //     'resigned': "Resigned",
// //     'stalemate': "Stalemate",
// //     'lose': "Lose",
// //     'insufficient': "Insufficient material",
// //     '50move': "Draw by 50-move rule",
// //     'abandoned': "Abandoned",
// //     'kingofthehill': "Opponent king reached the hill",
// //     'threecheck': "Checked for the 3rd time",
// //     'timevsinsufficient': "Draw by timeout vs insufficient material",
// //     'bughousepartnerlose': "Bughouse partner lost",
// // }
// // const timeClasses = ['daily', 'rapid', 'blitz', 'bullet'];
// // const timeClassTokens = ['☀️', '⏱️', '⚡', '🚅'];

// // Correctly categorized:
// // const winningResults = ['win'];
// // const losingResults = ['checkmated', 'resigned', 'timeout', 'abandoned', 'kingofthehill', 'threecheck'];
// // const drawResults = ['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'];

// // // Add this function outside of the component
// // const fetchChesscomUsernames = async (input: string) => {

// //     // take the first part of the input
// //     const fixedUsername = input.split(' ')[0].toLowerCase()

// //     if (fixedUsername.length < 3) return [];

// //     let matchedTitledPlayers: string[] = [];

// //     // Check for titled players whose usernames start with the input
// //     for (const title in titledPlayers) {
// //         if (Object.prototype.hasOwnProperty.call(titledPlayers, title)) {
// //             matchedTitledPlayers = matchedTitledPlayers.concat(
// //                 titledPlayers[title as keyof typeof titledPlayers].filter((username: string) =>
// //                     username.startsWith(fixedUsername)
// //                 )
// //             );
// //         }
// //     }

// //     try {
// //         const url = `https://api.chess.com/pub/player/${fixedUsername}`;
// //         console.log('fetching:', url);
// //         const response = await fetch(url);
// //         if (response.ok) {
// //             return Array.from(new Set([...matchedTitledPlayers, fixedUsername]));
// //         }
// //         return matchedTitledPlayers;
// //     } catch (error) {
// //         console.error('Error fetching Chess.com usernames:', error);
// //         return matchedTitledPlayers;
// //     }
// // };

// // const fetchChessArchivesFromChessCom = async (username: string | null) => {
// //     if (!username) return [];
// //     try {
// //         const fixedUsername = username.split(' ')[0].toLowerCase()
// //         const url = `https://api.chess.com/pub/player/${fixedUsername}/games/archives`;
// //         console.log('fetching:', url);
// //         const response = await fetch(url);
// //         if (response.ok) {
// //             const data = await response.json();
// //             console.log('fetched Archives:', data.archives);
// //             return data.archives;
// //         }
// //         return [];
// //     } catch (error) {
// //         console.error('Error fetching Chess.com archives:', error);
// //         return [];
// //     }
// // };

// // const fetchChessGamesFromChessCom = async (archive: string | null) => {
// //     try {
// //         if (archive) {
// //             const url = archive;
// //             console.log('fetching:', url);
// //             const response = await fetch(url);
// //             if (response.ok) {
// //                 const data = await response.json();
// //                 console.log('fetched (previous months) Games:', data.games.length);
// //                 return data.games;
// //             }
// //         }
// //         return [];
// //     }
// //     catch (error) {
// //         console.error('Error fetching Chess.com games:', error);
// //         return [];
// //     }
// // };

// // const AnalysisHeader: React.FC<{ sx?: SxProps }> = ({ sx }) => {
// //     return (
// //         <Box sx={{
// //             height: 'var(--player-info-height)',
// //             gridArea: 'head',
// //             display: 'flex',
// //             justifyContent: 'center',
// //             alignItems: 'center',
// //             ...sx
// //         }}>
// //             <Typography variant='h4'>Analysis</Typography>
// //         </Box>
// //     )
// // }
// // interface TabPanelProps {
// //     children?: React.ReactNode;
// //     index: number;
// //     value: number;
// // }

// // function CustomTabPanel(props: TabPanelProps) {
// //     const { children, value, index, ...other } = props;

// //     return (
// //         <Box
// //             className='analysis-tabpanel'
// //             role="tabpanel"
// //             hidden={value !== index}
// //             id={`simple-tabpanel-${index}`}
// //             aria-labelledby={`simple-tab-${index}`}
// //             sx={{ flexGrow: 1, display: value === index ? 'flex' : 'none', flexDirection: 'column' }} // Ensure the panel grows and is displayed as a flex container

// //             {...other}
// //         >
// //             {value === index && children}
// //         </Box>
// //     );
// // }
// // const AnalysisSource: React.FC<{ sx?: SxProps }> = ({ sx }) => {
// //     const [value, setValue] = React.useState(0);

// //     const handleChange = (event: React.SyntheticEvent, newValue: number) => {
// //         setValue(newValue);
// //     };
// //     return (
// //         <Box
// //             className='analysis-source'
// //             sx={{
// //                 gridArea: 'source',
// //                 display: 'flex',
// //                 flexDirection: 'column',
// //                 flexGrow: 1,
// //                 ...sx
// //             }}>
// //             <Box className='analysis-source-tabs' sx={{ borderBottom: 1, borderColor: 'divider' }}>
// //                 <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
// //                     <Tab label="PGN" />
// //                     <Tab label="Chess.com" />
// //                 </Tabs>
// //             </Box>
// //             <CustomTabPanel value={value} index={0}>
// //                 <PgnSource sx={{ flexGrow: 1 }} />
// //             </CustomTabPanel>
// //             <CustomTabPanel value={value} index={1}>
// //                 Item Two
// //             </CustomTabPanel>
// //             <CustomTabPanel value={value} index={2}>
// //                 Item Three
// //             </CustomTabPanel>
// //         </Box>
// //     )
// // }

// // const PgnSource: React.FC<{ sx?: SxProps }> = ({ sx }) => {
// //     return (
// //         <Box className='analysis-source-pgn'
// //             sx={{
// //                 display: 'flex',
// //                 flexDirection: 'column',
// //                 gap: 2,
// //                 height: '100%',
// //                 marginTop: 2,
// //                 ...sx
// //             }}>
// //             <TextField
// //                 className='analysis-source-pgn-url'
// //                 fullWidth
// //                 label="PGN URL"
// //                 variant="outlined"
// //                 placeholder="Enter PGN URL"
// //             />

// //             <TextField
// //                 className='analysis-source-pgn-text'
// //                 fullWidth
// //                 label="PGN Text"
// //                 variant="outlined"
// //                 multiline
// //                 placeholder="Write PGN here"
// //                 rows={20} // Set rows to a high value to ensure it grows
// //                 sx={{ flexGrow: 1 }} // Ensure the TextField grows to fill the available height
// //             />
// //         </Box>
// //     )
// // }
// // const AnalysisBody: React.FC<{ sx?: SxProps, setMoves: (moves: PgnMove[]) => void }> = ({ sx, setMoves }) => {
// //     return (
// //         <Box sx={{
// //             gridArea: 'body',
// //             display: 'flex',
// //             flexDirection: 'column',
// //             height: 'var(--chessboard-height)',
// //             ...sx
// //         }}>
// //             <AnalysisSourceComponent sx={{ gridArea: 'source' }} />
// //             {/* <AnalysisSource sx={{ gridArea: 'source' }} /> */}
// //         </Box>
// //     )
// // }
// // const AnalysisBody: React.FC<{ sx?: SxProps, setMoves: (moves: PgnTurn[]) => void }> = ({ sx, setMoves }) => {
// //     const [open, setOpen] = useState(false);
// //     const [options, setOptions] = useState<string[]>([]);
// //     const [loading, setLoading] = useState(false);
// //     const [inputValue, setInputValue] = useState('');

// //     const [username, setUsername] = useState<string | null>(null);
// //     const [archives, setArchives] = useState<string[]>([]);
// //     const [archiveIndex, setArchiveIndex] = useState(-1);
// //     const [games, setGames] = useState<ChessComGame[]>([]);
// //     const [selectedGame, setSelectedGame] = useState<ChessComGame | null>(null);

// //     const getOptionLabel = (option: string) => {
// //         return option === loggedInUser ? `${option} (You)` : option;
// //     };

// //     function handleRowSelect(game: ChessComGame): void {
// //         setSelectedGame(game);
// //     }

// //     useEffect(() => {
// //         let active = true;

// //         if (inputValue.length < 3) {
// //             setOptions([]);
// //             return undefined;
// //         }

// //         setLoading(true);
// //         fetchChesscomUsernames(inputValue).then((results) => {
// //             if (active) {
// //                 setOptions(results);
// //                 setLoading(false);
// //             }
// //         });

// //         return () => {
// //             active = false;
// //         };
// //     }, [inputValue]);

// //     const handleUsernameSelect = (_event: React.SyntheticEvent, value: string | null) => {
// //         console.log(`Selected username: ${value}`);
// //         setUsername(value);
// //     };

// //     useEffect(() => {
// //         if (username) {
// //             fetchChessArchivesFromChessCom(username)
// //                 .then((archives: string[]) => {
// //                     // Sort archives in descending order (latest first)
// //                     const sortedArchives = archives.sort((a, b) => b.localeCompare(a));
// //                     console.log('Archives', sortedArchives);
// //                     setArchives(sortedArchives);
// //                 })
// //         } else {
// //             setArchives([]);
// //         }
// //     }, [username])

// //     useEffect(() => {
// //         if (archives.length > 0) {
// //             setArchiveIndex(0);
// //         } else {
// //             setArchiveIndex(-1);
// //         }
// //     }, [archives])

// //     useEffect(() => {
// //         setMoves([]);
// //         setGames([]);
// //         setSelectedGame(null);
// //     }, [archiveIndex])

// //     useEffect(() => {
// //         if (archiveIndex >= 0 && archiveIndex < archives.length) {
// //             fetchChessGamesFromChessCom(archives[archiveIndex])
// //                 .then((games: ChessComGame[]) => {
// //                     // Sort games in descending order (latest first)
// //                     const sortedGames = games.sort((a, b) => b.end_time - a.end_time);
// //                     setGames(sortedGames);
// //                 })
// //         }
// //     }, [archiveIndex])

// //     useEffect(() => {
// //         if (selectedGame) {
// //             const pgnTextField = document.querySelector('textarea[placeholder="Write PGN here"]') as HTMLTextAreaElement;
// //             if (pgnTextField) {
// //                 pgnTextField.value = selectedGame.pgn;
// //                 const moves = parsePgn(selectedGame.pgn);
// //                 setMoves(moves.turns);
// //             }
// //         } else {
// //             setMoves([]);
// //         }
// //     }, [selectedGame])

// //     return (
// //         <Box sx={{
// //             gridArea: 'body',
// //             display: 'flex',
// //             flexDirection: 'column',
// //             height: 'var(--chessboard-height)', // Ensure the box takes full height
// //             ...sx
// //         }}>
// //             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, flexGrow: 1, overflow: 'hidden' }}>
// //                 <TextField
// //                     fullWidth
// //                     label="PGN URL"
// //                     variant="outlined"
// //                     placeholder="Enter PGN URL"
// //                 />

// //                 <TextField
// //                     fullWidth
// //                     label="PGN Text"
// //                     variant="outlined"
// //                     multiline
// //                     rows={4}
// //                     placeholder="Write PGN here"
// //                 />

// //                 <Autocomplete
// //                     open={open}
// //                     onOpen={() => setOpen(true)}
// //                     onClose={() => setOpen(false)}
// //                     inputValue={inputValue}
// //                     onInputChange={(_event, newInputValue) => {
// //                         setInputValue(newInputValue);
// //                     }}
// //                     onChange={handleUsernameSelect}
// //                     value={username}
// //                     options={[loggedInUser, ...options.filter(option => option !== loggedInUser)]}
// //                     loading={loading}
// //                     getOptionLabel={getOptionLabel}
// //                     renderOption={(props, option) => {
// //                         const { key, ...otherProps } = props;
// //                         return (
// //                             <React.Fragment key={option}>
// //                                 <li {...otherProps}>{getOptionLabel(option)}</li>
// //                             </React.Fragment>
// //                         );
// //                     }}
// //                     renderInput={(params) => (
// //                         <TextField
// //                             {...params}
// //                             fullWidth
// //                             label="Chess.com username"
// //                             variant="outlined"
// //                             placeholder="Enter username"
// //                             InputProps={{
// //                                 ...params.InputProps,
// //                                 endAdornment: (
// //                                     <>
// //                                         {loading ? <CircularProgress color="inherit" size={20} /> : null}
// //                                         {params.InputProps.endAdornment}
// //                                     </>
// //                                 ),
// //                             }}
// //                         />
// //                     )}
// //                 />

// //                 <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: 'auto' }}>
// //                     <Table stickyHeader size="small">
// //                         <TableHead>
// //                             <TableRow>
// //                                 <TableCell>Time</TableCell>
// //                                 <TableCell>Date</TableCell>
// //                                 <TableCell>Players</TableCell>
// //                                 <TableCell>Result</TableCell>
// //                             </TableRow>
// //                         </TableHead>
// //                         <TableBody>
// //                             {games.map((game, index) => {
// //                                 // Convert the end_time to a Date object, handling both milliseconds and seconds
// //                                 const endDate = new Date(game.end_time * (game.end_time.toString().length === 10 ? 1000 : 1));
// //                                 const ended = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(endDate);
// //                                 const timeClassIndex = timeClasses.indexOf(game.time_class);
// //                                 const timeClassToken = timeClassTokens[timeClassIndex];
// //                                 let whiteResult = 'U';
// //                                 if (winningResults.includes(game.white.result)) {
// //                                     whiteResult = '1';
// //                                 } else if (losingResults.includes(game.white.result)) {
// //                                     whiteResult = '0';
// //                                 } else if (drawResults.includes(game.white.result)) {
// //                                     whiteResult = '½';
// //                                 }
// //                                 let blackResult = 'U';
// //                                 if (winningResults.includes(game.black.result)) {
// //                                     blackResult = '1';
// //                                 } else if (losingResults.includes(game.black.result)) {
// //                                     blackResult = '0';
// //                                 } else if (drawResults.includes(game.black.result)) {
// //                                     blackResult = '½';
// //                                 }

// //                                 return (
// //                                     <TableRow
// //                                         hover
// //                                         key={index}
// //                                         onClick={() => handleRowSelect(game)}
// //                                         sx={{ cursor: 'pointer' }}
// //                                     >
// //                                         <TableCell>{timeClassToken}</TableCell>
// //                                         <TableCell>{ended}</TableCell>
// //                                         <TableCell sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                                             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
// //                                                 <Typography>{game.white.username}</Typography>
// //                                                 <Typography>{game.black.username}</Typography>
// //                                             </Box>
// //                                         </TableCell>
// //                                         <TableCell>
// //                                             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
// //                                                 <Typography title={game.white.result}>{whiteResult}</Typography>
// //                                                 <Typography title={game.black.result}>{blackResult}</Typography>
// //                                             </Box>
// //                                         </TableCell>
// //                                     </TableRow>
// //                                 )
// //                             })}
// //                         </TableBody>
// //                     </Table>
// //                 </TableContainer>
// //                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
// //                     <IconButton
// //                         disabled={archiveIndex <= 0}
// //                         onClick={() => setArchiveIndex(prev => Math.max(0, prev - 1))}>
// //                         <NavigateBeforeIcon />
// //                     </IconButton>
// //                     <Typography sx={{ mx: 2 }}>
// //                         {archiveIndex >= 0 && archives.length > 0 ?
// //                             new Date(archives[archiveIndex].split('/').slice(-2).join('-')).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
// //                             : '-'}
// //                     </Typography>
// //                     <IconButton
// //                         disabled={archiveIndex >= archives.length - 1}
// //                         onClick={() => setArchiveIndex(prev => Math.min(archives.length - 1, prev + 1))}>
// //                         <NavigateNextIcon />
// //                     </IconButton>
// //                 </Box>
// //             </Box>
// //         </Box>
// //     )
// // }

// // const AnalysisFooter: React.FC<{ sx?: SxProps }> = ({ sx }) => {
// //     return (
// //         <Box sx={{
// //             height: 'var(--player-info-height)',
// //             gridArea: 'foot',
// //             display: 'flex',
// //             justifyContent: 'center',
// //             alignItems: 'center',
// //             ...sx
// //         }}>
// //             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: 2 }}>
// //                 <Button
// //                     variant="contained"
// //                     color="primary"
// //                     startIcon={<DeleteIcon />}
// //                     sx={{ minWidth: '120px' }}
// //                 >
// //                     Start
// //                 </Button>
// //                 <Button
// //                     variant="contained"
// //                     color="secondary"
// //                     startIcon={<UploadFileIcon />}
// //                     sx={{ minWidth: '120px' }}
// //                 >
// //                     Load
// //                 </Button>
// //             </Box>
// //         </Box>
// //     )
// // }



// // const AnalysisComponent: React.FC<{ setMoves: (moves: PgnTurn[]) => void }> = ({ setMoves }) => {
// //     return (
// //         <Paper className='analysis-paper'
// //             elevation={1}
// //             sx={{
// //                 display: 'grid',
// //                 p: 'var(--chessboard-paper-padding)',
// //                 m: 'var(--chessboard-paper-margin)',
// //                 gap: 'var(--chessboard-paper-gap)',
// //                 // width: 'fit-content',
// //                 // aspectRatio: '9 / 16',
// //                 height: 'var(--chessboard-paper-height)',
// //                 gridTemplateColumns: 'auto',
// //                 gridTemplateRows: 'auto 1fr auto',
// //                 gridTemplateAreas: `
// //             "head"
// //             "body"
// //             "foot"
// //         `,
// //             }}
// //         >
// //             <AnalysisHeader sx={{ gridArea: 'head' }} />
// //             <AnalysisBody sx={{ gridArea: 'body' }} setMoves={setMoves} />
// //             <AnalysisFooter sx={{ gridArea: 'foot' }} />
// //         </Paper>
// //     )
// // }

// const BrowserAnalysisPage: React.FC = () => {
//     const theme = useTheme();
//     const [boardState, setBoardState] = useState<BoardState>(new BoardState());
//     const [chessGameState, setChessGameState] = useState<ChessGameState>(new ChessGameState());
//     const [path, setPath] = useState<number[]>([]);
//     const [pathIndex, setPathIndex] = useState<number>(-1);
//     const [pendingLineIndex, setPendingLineIndex] = useState<[number, number] | null>(null);

//     const handleSetPathIndex = (index: number) => {
//         console.log(`handle set path index ${index}`);
//         setPathIndex(index);
//     }

//     const handleSetLineIndex = (pathIndex: number, lineIndex: number) => {
//         console.log(`handle set line index path ${pathIndex} line ${lineIndex}`);
//         setLineIndex(pathIndex, lineIndex);
//     }

//     const handleMovePiece = (sourceSquareId: SquareId, targetSquareId: SquareId, promotionPieceName: PieceName | null) => {
//         console.log(`handle move piece ${sourceSquareId} ${targetSquareId}`);

//         if (path.length === 0) {
//             // empty board, add new line
//             const newChessGameState = nextChessGameState(boardState.chessGameState, {
//                 sourceSquareId: sourceSquareId,
//                 targetSquareId: targetSquareId,
//                 promotionPieceName: promotionPieceName
//             });
//             boardState.nodes.push(new BoardNodeState(newChessGameState, sourceSquareId, targetSquareId, newChessGameState.pgn));
//             setPath([0]);
//             setPathIndex(0);
//             setChessGameState(newChessGameState);
//             setPendingLineIndex([0, 0]);
//         } else if (pathIndex < 0) {
//             // root selected, find existing line or create new
//             const lineIndex = boardState.nodes.findIndex(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
//             if (lineIndex === -1) {
//                 // new line, create and select it
//                 const newChessGameState = nextChessGameState(boardState.chessGameState, {
//                     sourceSquareId: sourceSquareId,
//                     targetSquareId: targetSquareId,
//                     promotionPieceName: promotionPieceName
//                 });
//                 boardState.nodes.push(new BoardNodeState(newChessGameState, sourceSquareId, targetSquareId, newChessGameState.pgn));

//                 // set the new path and select the new node
//                 setPath([boardState.nodes.length - 1]);
//                 setPathIndex(0);
//                 setChessGameState(newChessGameState);
//                 setPendingLineIndex([0, boardState.nodes.length - 1]);
//             } else {
//                 // found existing line, select it
//                 setPendingLineIndex([0, lineIndex]);
//             }
//         } else {
//             // node selected, find existing line or create new
//             let node = boardState.nodes[path[0]];
//             for (let i = 1; i < pathIndex; i++) {
//                 node = node.nodes[path[i]];
//             }
//             const lineIndex = node.nodes.findIndex(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
//             if (lineIndex === -1) {
//                 // new line
//                 const newChessGameState = nextChessGameState(node.chessGameState, {
//                     sourceSquareId: sourceSquareId,
//                     targetSquareId: targetSquareId,
//                     promotionPieceName: promotionPieceName
//                 });
//                 node.nodes.push(new BoardNodeState(newChessGameState, sourceSquareId, targetSquareId, newChessGameState.pgn));
//                 let newPath = [...path.slice(0, pathIndex + 1), node.nodes.length - 1];
//                 setPath(newPath);
//                 setPathIndex(newPath.length - 1);
//                 setChessGameState(newChessGameState);
//                 setPendingLineIndex([pathIndex + 1, lineIndex]);
//             } else {
//                 // existing line
//                 setPendingLineIndex([pathIndex + 1, lineIndex]);
//             }
//         }
//     }

//     useEffect(() => {
//         const games: PgnGame[] = [
//             // parsePgn("1. e4 1... e5"),
//             // parsePgn("1. f4 1... f5"),
//             // parsePgn("1. e4"),
//             // parsePgn("1. e4 1... e5 2. d4 2... d5"),
//             // parsePgn("1. e4 1... e5 2. Nf3 2... Nc6 3. Bc4"),
//             // parsePgn("1. e4 1... e5 2. Nf3 2... Nf6 3. Nxe5"),
//             // parsePgn("1. d4 1... d5 2. Bf4 2... Bf5 3. Nc3 3... Nc6 4. Qd2 4... Qd7 5. O-O-O 5... O-O-O"),
//             // parsePgn("1. e4 1... d5 2. exd5 2... e5 3. e6"),
//             // parsePgn("1. e4 1... d5 2. exd5 2... c6 3. dxc6 3... Nf6 4. cxb7 4... Bd7 5. bxa8=Q"),
//             // parsePgn("1. e4 1... d5 2. exd5 2... c5 3. d6 3... Qa5 4. d7+ 4... Kd8 5. c3 5... Kc7 6. d8=Q+"),
//         ]
//         const boardState = loadBoardState(games);
//         setBoardState(boardState); // only here!

//         // set initial main line path ([0, 0, 0, 0, 0, 0, 0, 0]...)
//         const newPath = [];
//         let node = boardState.nodes[0];
//         while (node) {
//             newPath.push(0);
//             node = node.nodes[0];
//         }
//         setPath(newPath);
//         setPathIndex(-1);
//         setChessGameState(boardState.chessGameState);
//     }, []);

//     useEffect(() => {
//         console.log(`effect pathIndex ${pathIndex} path ${path}`);
//         if (pathIndex < 0) {
//             setChessGameState(boardState.chessGameState);
//         } else if (pathIndex < path.length) {
//             let node = boardState.nodes[path[0]];
//             for (let i = 1; i <= pathIndex; i++) {
//                 node = node.nodes[path[i]];
//             }
//             setChessGameState(node.chessGameState);
//         } else {
//             throw new Error(`pathIndex ${pathIndex} is out of bounds`);
//         }
//     }, [pathIndex, path]);

//     // Add this new useEffect
//     useEffect(() => {
//         if (pendingLineIndex !== null) {
//             setLineIndex(pendingLineIndex[0], pendingLineIndex[1]);
//             setPendingLineIndex(null);
//         }
//     }, [path, pathIndex, pendingLineIndex]);

//     const setLineIndex = (pathIndex: number, lineIndex: number) => {
//         console.log(`setLineIndex pathIndex ${pathIndex} lineIndex ${lineIndex} path ${path}`);
//         if (pathIndex < 0) {
//             throw new Error(`pathIndex ${pathIndex} is out of bounds`);
//         } else if (pathIndex >= path.length) {
//             throw new Error(`pathIndex ${pathIndex} is out of bounds`);
//         }

//         // reuse previous path up to pathIndex
//         let newPath = [...path.slice(0, pathIndex + 1)];

//         // set new line index
//         newPath[pathIndex] = lineIndex;

//         // traverse new path
//         let node = boardState.nodes[newPath[0]];
//         for (let i = 1; i < newPath.length; i++) {
//             node = node.nodes[newPath[i]];
//         }
//         let chessGameState = node.chessGameState;
//         console.log('newPath', newPath);

//         // traverse rest of main line
//         node = node.nodes[0];
//         while (node) {
//             newPath.push(0);
//             node = node.nodes[0];
//         }
//         console.log('newPath', newPath);

//         setPath(newPath);
//         setPathIndex(pathIndex);
//         setChessGameState(chessGameState);
//     }

//     return (
//         <Box
//             sx={{
//                 '--spacing': `${theme.spacing(1)}`,
//                 '--text-size': `calc(${theme.typography.body1.lineHeight} * ${theme.typography.body1.fontSize})`,

//                 '--chessboard-paper-margin': 'calc(var(--spacing) * 2)',
//                 '--chessboard-paper-padding': 'calc(var(--spacing) * 1)',
//                 '--chessboard-paper-gap': 'calc(var(--spacing) * 1)',

//                 '--chessboard-paper-margins': `calc(var(--chessboard-paper-margin) * 2)`,
//                 '--chessboard-paper-paddings': `calc(var(--chessboard-paper-padding) * 2)`,
//                 '--chessboard-paper-gaps': `calc(var(--chessboard-paper-gap) * 2)`,

//                 '--player-info-height': `calc(var(--text-size) * 2)`, // 2 lines of text

//                 '--chessboard-paper-height': `calc(100vh - var(--chessboard-paper-margins))`,
//                 '--chessboard-height': `calc(100vh - var(--chessboard-paper-margins) - var(--chessboard-paper-paddings) - var(--chessboard-paper-gaps) - 2 * var(--player-info-height))`,
//                 '--square-size': `calc(var(--chessboard-height) / 8)`,
//             }}
//         >
//             <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

//                 <BoardPaperEl chessGameState={chessGameState} white={{
//                     name: 'Mr.White'
//                 }} black={{
//                     name: 'Mr.Black'
//                 }}
//                     movePiece={handleMovePiece}
//                 />

//                 <AnalysisPaperEl
//                     boardState={boardState}
//                     path={path}
//                     pathIndex={pathIndex}
//                     setPathIndex={handleSetPathIndex}
//                     setLineIndex={handleSetLineIndex}
//                 />

//                 {Array.from({ length: 8 }, (_, index) => (
//                     <Typography variant='body1' key={index} p={2}>
//                         Chess is a game of strategy and skill that has captivated players for centuries. Its complex rules and infinite possibilities make it a challenging and rewarding pursuit. From the opening moves to the endgame, every decision can have far-reaching consequences. Players must think several steps ahead, anticipating their opponent's moves while planning their own. The beauty of chess lies in its balance of tactical maneuvers and long-term strategic planning.
//                     </Typography>
//                 ))}

//             </Box>
//         </Box>
//     )
// };

// export default BrowserAnalysisPage;
