import AnalysisPaperEl from '@/components/AnalysisPaperEl';
import BoardPaperEl from '@/components/BoardPaperEl';
import { useChessGame } from '@/contexts/ChessGame';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useCallback, useEffect, useState } from 'react';
import { Endgame, Endgames } from '@/types/chess';
import { useNavigate, useParams } from 'react-router-dom';
import HumanPlayer from '@/players/HumanPlayer';
import { getValidRandomSetup } from '@/models/chess';
import rawEndgames from '@/data/endgames.json';
import { PgnGame } from '@/utils/pgn';
import { movesToTurns } from '@/utils/pgn';
import ErrorEl from '@/components/ErrorEl';
import RandomPlayer from '@/players/RandomPlayer';

const endgames: Endgames = rawEndgames as Endgames;

const BrowserEndgamesPage: React.FC = () => {
    const navigate = useNavigate();
    const { endgameParam } = useParams<{ endgameParam?: string }>();
    const theme = useTheme();
    const [data, setData] = useState<Endgame | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [state, setState] = useState<'explore' | 'practice' | null>(null);
    const {
        boardState,
        chessGameState,
        path,
        pathIndex,
        handleSetPathIndex,
        handleSetLineIndex,
        handleMovePiece,
        handleResetBoard,
        // handleLoadPgns,
        handleLoadBoard
    } = useChessGame();


    // Function to load setup or drill
    const load = useCallback(async () => {
        try {
            console.log("loading endgame", endgameParam);
            const response = await fetch(`/endgames/${endgameParam}.json`);
            const data: Endgame = await response.json();
            setData(data);
        } catch (error) {
            console.error("Error fetching endgame data:", error);
            handleResetBoard();
            setError(error as Error);
        }
    }, [endgameParam]);

    useEffect(() => {
        if (!endgameParam) {
            setData(null);
            return;
        }
        load();
    }, [endgameParam, load]);

    useEffect(() => {
        if (!data) {
            handleResetBoard();
            return;
        }
        handlePracticeEndgame();
    }, [data]);

    function handleSelectEndgame(endgame: string) {
        console.log("select endgame", endgame);
        navigate(`/endgames/${endgame}`);
    }

    function handleExploreEndgame() {
        console.log("explore endgame", endgameParam);
        if (data) {
            setState('explore');
            const turns = movesToTurns(data.moves)
            const pgnGame = new PgnGame({}, turns, undefined);
            handleLoadBoard(data.setup, [pgnGame]);
        } else {
            setState(null);
            handleResetBoard();
        }
    }

    function handlePracticeEndgame() {
        console.log("practice endgame", endgameParam);
        if (data) {
            setState('practice');
            const gameSetup = getValidRandomSetup(data.drill);
            handleLoadBoard(gameSetup, []);
        } else {
            setState(null);
            handleResetBoard();
        }
    }

    const endgame = endgames?.endgames.find(endgame => endgame.slug === endgameParam);
    const title = endgame?.name ?? "Endgames";

    if (error) {
        return <ErrorEl error={error} />;
    }

    console.log("endgames page rendering", endgameParam);

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
                    black={state === 'practice' && pathIndex === path.length - 1 ? new RandomPlayer('b') : new HumanPlayer('b')}
                    movePiece={handleMovePiece}
                />

                <AnalysisPaperEl
                    boardState={boardState}
                    path={path}
                    pathIndex={pathIndex}
                    practice={state === 'practice'}
                    setPathIndex={handleSetPathIndex}
                    setLineIndex={handleSetLineIndex}
                    actions={[
                        {
                            label: 'Explore',
                            onClick: () => handleExploreEndgame(),
                            disabled: !data,
                        },
                        {
                            label: 'Practice',
                            onClick: () => handlePracticeEndgame(),
                            disabled: !data,
                        }
                    ]}
                    title={title}
                    subtitle="Learn the endgame skills"
                />

                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        {endgames.endgames.map((endgame, index) => {
                            return (
                                <Grid key={index} size={4}>
                                    <Card>
                                        <CardHeader title={endgame.name} />
                                        <CardContent>
                                            <Typography variant="body1">{endgame.description}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                variant="contained" color="primary"
                                                onClick={() => handleSelectEndgame(endgame.slug)}
                                            >
                                                Explore
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
};

export default BrowserEndgamesPage;
