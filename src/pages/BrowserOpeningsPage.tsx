import AnalysisPaperEl from '@/components/AnalysisPaperEl';
import BoardPaperEl from '@/components/BoardPaperEl';
import { useChessGame } from '@/contexts/ChessGame';
import { Box, Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import React from 'react';
import rawOpenings from '../data/openings.json';
import { fixPgn, parsePgn, PgnGame } from '@/utils/pgn';
import { OpeningCategory } from '@/types/chess';

const openingCategories: OpeningCategory[] = rawOpenings as OpeningCategory[];

const BrowserOpeningsPage: React.FC = () => {
    const theme = useTheme();
    const {
        boardState,
        chessGameState,
        path,
        pathIndex,
        handleSetPathIndex,
        handleSetLineIndex,
        handleMovePiece,
        handleResetBoard,
        handleLoadPgns
    } = useChessGame();

    function handleExploreOpening(openingCategoryRange: string, openingRange: string) {
        console.log(openingRange);
        const openingCategory = openingCategories.find(openingCategory => openingCategoryRange === openingCategory.range);
        if (!openingCategory) {
            console.error(`Opening Category not found: ${openingCategoryRange}`);
            return;
        }
        const opening = openingCategory.openings.find(opening => openingRange === opening.range);
        if (!opening) {
            console.error(`Opening not found: ${openingRange}`);
            return;
        }
        const pgnGames: PgnGame[] = opening.lines.map((line) => {
            return parsePgn(line.moves)
        })
        // handleResetBoard();
        handleLoadPgns(pgnGames);
    }

    return (
        <Box
            sx={{
                '--spacing': `${theme.spacing(1)}`,
                '--text-size': `calc(${theme.typography.body1.lineHeight} * ${theme.typography.body1.fontSize})`,

                '--chessboard-paper-margin': 'calc(var(--spacing) * 2)',
                '--chessboard-paper-padding': 'calc(var(--spacing) * 1)',
                '--chessboard-paper-gap': 'calc(var(--spacing) * 1)',

                '--chessboard-paper-margins': `calc(var(--chessboard-paper-margin) * 2)`,
                '--chessboard-paper-paddings': `calc(var(--chessboard-paper-padding) * 2)`,
                '--chessboard-paper-gaps': `calc(var(--chessboard-paper-gap) * 2)`,

                '--player-info-height': `calc(var(--text-size) * 2)`, // 2 lines of text

                '--chessboard-paper-height': `calc(100vh - var(--chessboard-paper-margins))`,
                '--chessboard-height': `calc(100vh - var(--chessboard-paper-margins) - var(--chessboard-paper-paddings) - var(--chessboard-paper-gaps) - 2 * var(--player-info-height))`,
                '--square-size': `calc(var(--chessboard-height) / 8)`,
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 1,
                m: 2
            }}
            >

                <BoardPaperEl
                    chessGameState={chessGameState}
                    white={{ name: 'Mr.White' }}
                    black={{ name: 'Mr.Black' }}
                    movePiece={handleMovePiece}
                />

                <AnalysisPaperEl
                    boardState={boardState}
                    path={path}
                    pathIndex={pathIndex}
                    setPathIndex={handleSetPathIndex}
                    setLineIndex={handleSetLineIndex}
                    resetBoard={handleResetBoard}
                />

                <Card>
                    <CardHeader title="Openings" />
                    <CardContent>
                        {openingCategories.map((openingCategory, index) => (
                            <Box key={index}>
                                <Typography variant="h6">{openingCategory.name}</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Opening</TableCell>
                                                <TableCell>ECO range</TableCell>
                                                <TableCell>Lines</TableCell>
                                                <TableCell>Explore</TableCell>
                                                <TableCell>Practice</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {openingCategory.openings.map((opening, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{opening.name}</TableCell>
                                                    <TableCell>{opening.range}</TableCell>
                                                    <TableCell>{opening.lines.length}</TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="primary" onClick={() => handleExploreOpening(openingCategory.range, opening.range)}>Explore</Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="secondary">Practice</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
};

export default BrowserOpeningsPage;
