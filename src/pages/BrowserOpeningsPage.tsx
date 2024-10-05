import AnalysisPaperEl from '@/components/AnalysisPaperEl';
import BoardPaperEl from '@/components/BoardPaperEl';
import { useChessGame } from '@/contexts/ChessGame';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import rawOpenings from '../data/openings.json';
import { parsePgn, PgnGame } from '@/utils/pgn';
import { OpeningCategory } from '@/types/chess';
import { Link, useParams } from 'react-router-dom';

const openingCategories: OpeningCategory[] = rawOpenings as OpeningCategory[];

const BrowserOpeningsPage: React.FC = () => {
    const { category: categoryParam, opening: openingParam } = useParams<{ category?: string, opening?: string }>();
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

    useEffect(() => {
        if (location.hash === '#drill') {
            handlePracticeOpening();
        } else {
            // if (location.hash === '#learn') {
            handleExploreOpening();
        }
    }, [categoryParam, openingParam, location.hash]);

    function handlePracticeOpening() {
        // const category = openingCategories.find(openingCategory => openingCategory.slug === categoryParam);
        // const opening = category?.openings.find(opening => opening.slug === openingParam);
        // if (!opening) {
        //     handleResetBoard();
        //     return;
        // }
        // const pgnGames: PgnGame[] = opening.lines.map((line) => {
        //     return parsePgn(line.moves)
        // })
        // handleLoadPgns(pgnGames);
    }

    function handleExploreOpening() {
        const category = openingCategories.find(openingCategory => openingCategory.slug === categoryParam);
        const opening = category?.openings.find(opening => opening.slug === openingParam);
        if (!opening) {
            handleResetBoard();
            return;
        }
        const pgnGames: PgnGame[] = opening.lines.map((line) => {
            return parsePgn(line.moves)
        })
        // handleResetBoard();
        handleLoadPgns(pgnGames);
    }

    const category = openingCategories.find(openingCategory => openingCategory.slug === categoryParam);
    const opening = category?.openings.find(opening => opening.slug === openingParam);
    const title = opening?.name ?? "Openings";

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
                    restartBoard={handlePracticeOpening}
                    title={title}
                    subtitle="Learn the openings"
                />

                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        {openingCategories.map((category) => {
                            return category.openings.map((opening) => {
                                return (
                                    <Grid key={opening.slug} size={4}>
                                        <Card>
                                            <CardHeader title={opening.name} />
                                            <CardContent>
                                                <Typography variant="body1">yada yada</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    component={Link}
                                                    to={`/openings/${category.slug}/${opening.slug}`}
                                                    variant="contained" color="primary">
                                                    Explore
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    to={`/openings/${category.slug}/${opening.slug}#practice`}
                                                    variant="contained" color="secondary">
                                                    Practice
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })
                        })}
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
};

export default BrowserOpeningsPage;
