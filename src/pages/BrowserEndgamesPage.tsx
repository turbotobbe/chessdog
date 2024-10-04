import AnalysisPaperEl from '@/components/AnalysisPaperEl';
import BoardPaperEl from '@/components/BoardPaperEl';
import { useChessGame } from '@/contexts/ChessGame';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import rawEndgames from '../data/endgames.json';
import { Endgame, GameSetup, squareIds } from '@/types/chess';
import { parsePgn } from '@/utils/pgn';
import { Link, useLocation, useParams } from 'react-router-dom';

const endgames: Endgame[] = rawEndgames as Endgame[];

const BrowserEndgamesPage: React.FC = () => {
    const { endgame: endgameParam } = useParams<{ endgame?: string }>();
    const location = useLocation();
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
        handleLoadBoard,
    } = useChessGame();

    useEffect(() => {
        if (location.hash === '#drill') {
            handleDrillEndgame();
        } else {
            // if (location.hash === '#learn') {
            handleLearnEndgame();
        }
    }, [endgameParam, location.hash]);

    function handleLearnEndgame() {
        const endgame = endgames.find(endgame => endgame.slug === endgameParam);
        if (!endgame) {
            handleResetBoard();
            return;
        };
        const pgnGames = parsePgn(endgame.pgn);
        handleLoadBoard(endgame.setup, [pgnGames]);
    }

    function handleDrillEndgame() {
        const endgame = endgames.find(endgame => endgame.slug === endgameParam);
        if (!endgame) {
            handleResetBoard();
            return;
        };

        // TODO: check valid setup
        const shuffledSquareIds = [...squareIds].sort(() => 0.5 - Math.random());
        const setup: GameSetup = {
            white: endgame.drill.white.map((piece, index) => ({ piece, square: shuffledSquareIds[index] })),
            black: endgame.drill.black.map((piece, index) => ({ piece, square: shuffledSquareIds[index + endgame.drill.white.length] }))
        };
        handleLoadBoard(setup, [])
    }

    const endgame = endgames.find(endgame => endgame.slug === endgameParam);
    const title = endgame?.name ?? "Endgames";

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
                    restartBoard={handleDrillEndgame}
                    title={title}
                    subtitle="Learn the endgame skills"
                />

                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        {endgames.map((endgame, index) => (
                            <Grid key={index} size={4}>
                                <Card>
                                    <CardHeader title={endgame.name} />
                                    <CardContent>
                                        <Typography variant="body1">{endgame.description}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            component={Link}
                                            to={`/endgames/${endgame.slug}`}
                                            variant="contained" color="primary">
                                            Learn
                                        </Button>
                                        <Button
                                            component={Link}
                                            to={`/endgames/${endgame.slug}#drill`}
                                            variant="contained" color="secondary">
                                            Drill
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
};

export default BrowserEndgamesPage;
