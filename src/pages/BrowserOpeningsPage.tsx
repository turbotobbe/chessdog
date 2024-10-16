import AnalysisPaperEl from '@/components/AnalysisPaperEl';
import BoardPaperEl from '@/components/BoardPaperEl';
import { useChessGame } from '@/contexts/ChessGame';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import rawOpenings from '../data/openings.json';
import { parsePgn, PgnGame } from '@/utils/pgn';
import { OpeningCategory } from '@/types/chess';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HumanPlayer from '@/players/HumanPlayer';

const openingCategories: OpeningCategory[] = rawOpenings as OpeningCategory[];

const BrowserOpeningsPage: React.FC = () => {
    const navigate = useNavigate();
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
        if (location.hash === '#practice') {
            handlePracticeOpening();
        } else {
            handleExploreOpening();
        }
    }, [categoryParam, openingParam, location.hash]);

    function handlePracticeOpening() {
        handleResetBoard();
    }

    function handleSelectOpening(category: string, opening: string) {
        navigate(`/openings/${category}/${opening}`);
    }

    function handleExploreOpening() {
        const category = openingCategories.find(openingCategory => openingCategory.slug === categoryParam);
        const opening = category?.openings.find(opening => opening.slug === openingParam);
        if (!opening) {
            handleResetBoard();
            return;
        }
        const pgnGames: PgnGame[] = opening.lines.map((line) => {
            return parsePgn(line.moves, line.name)
        })
        console.log(pgnGames)
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
                    white={new HumanPlayer('w')}
                    black={new HumanPlayer('b')}
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
                <Paper elevation={1} sx={{p:1}}>
                    <TableContainer>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>ECO</TableCell>
                                    <TableCell>White</TableCell>
                                    <TableCell>Black</TableCell>
                                    <TableCell>Lines</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {openingCategories.map((category) => {
                                    return category.openings.map((opening) => {
                                        const isSelected = category.slug === categoryParam && opening.slug === openingParam;
                                        const numWhite = opening.lines.filter(line => line.color === 'white').length;
                                        const numBlack = opening.lines.filter(line => line.color === 'black').length;
                                        return (
                                            <TableRow
                                                key={opening.slug}
                                                hover={true}
                                                selected={isSelected}
                                                onClick={()=>handleSelectOpening(category.slug, opening.slug)}
                                                >
                                                <TableCell>{category.name}</TableCell>
                                                <TableCell>{opening.name}</TableCell>
                                                <TableCell>{opening.range}</TableCell>
                                                <TableCell>{numWhite>0 ? numWhite : ''}</TableCell>
                                                <TableCell>{numBlack>0 ? numBlack : ''}</TableCell>
                                                <TableCell>{opening.lines.length}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                {/* 
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        {openingCategories.map((category) => {
                            return category.openings.map((opening) => {
                                const hasWhite = opening.lines.filter(line=>line.color==='white').length > 0;
                                const hasBlack = opening.lines.filter(line=>line.color==='black').length > 0;
                                console.log(opening.name, hasWhite, hasBlack)
                                return (
                                    <Grid key={opening.slug} size={4}>
                                        <Card>
                                            <CardHeader title={opening.name} />
                                            <CardContent>
                                                <Typography variant="body2">
                                                    ECO {opening.range},
                                                    {opening.lines.length} lines
                                                {hasWhite && <span>white</span>}
                                                {hasBlack && <span>black</span>}
                                                </Typography>
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
                </Box> */}
            </Box>
        </Box>
    )
};

export default BrowserOpeningsPage;
