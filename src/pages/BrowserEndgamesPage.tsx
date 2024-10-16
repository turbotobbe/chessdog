import AnalysisPaperEl from '@/components/AnalysisPaperEl';
import BoardPaperEl from '@/components/BoardPaperEl';
import { useChessGame } from '@/contexts/ChessGame';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { Endgame } from '@/types/chess';
import { movesToTurns, PgnGame } from '@/utils/pgn';
import { Link, useLocation, useParams } from 'react-router-dom';
import RandomPlayer from '@/players/RandomPlayer';
import HumanPlayer from '@/players/HumanPlayer';
import { getValidRandomSetup } from '@/models/chess';

import bishopAndKnightJson from '@/data/endgames/bishop-and-knight.json';
import kingAndPawnJson from '@/data/endgames/king-and-pawn.json';
import kingAndQueenJson from '@/data/endgames/king-and-queen.json';
import kingAndRookJson from '@/data/endgames/king-and-rook.json';
import queenVsBishopJson from '@/data/endgames/queen-vs-bishop.json';
import queenVsKnightJson from '@/data/endgames/queen-vs-knight.json';
import queenVsRookJson from '@/data/endgames/queen-vs-rook.json';
import rookVsKnightJson from '@/data/endgames/rook-vs-knight.json';
import twoBishopsJson from '@/data/endgames/two-bishops.json';

type EndgameSlugs =
    "bishop-and-knight" |
    "king-and-pawn" |
    "king-and-queen" |
    "king-and-rook" |
    "queen-vs-bishop" |
    "queen-vs-knight" |
    "queen-vs-rook" |
    "rook-vs-knight" |
    "two-bishops";

const endgameRecord: Record<EndgameSlugs, Endgame> = {
    "bishop-and-knight": bishopAndKnightJson as Endgame,
    "king-and-pawn": kingAndPawnJson as Endgame,
    "king-and-queen": kingAndQueenJson as Endgame,
    "king-and-rook": kingAndRookJson as Endgame,
    "queen-vs-bishop": queenVsBishopJson as Endgame,
    "queen-vs-knight": queenVsKnightJson as Endgame,
    "queen-vs-rook": queenVsRookJson as Endgame,
    "rook-vs-knight": rookVsKnightJson as Endgame,
    "two-bishops": twoBishopsJson as Endgame,
};

const endgameSlugs: EndgameSlugs[] = [
    "king-and-queen",
    "king-and-rook",
    "king-and-pawn",
    "queen-vs-rook",
    "queen-vs-bishop",
    "queen-vs-knight",
    "rook-vs-knight",
    "two-bishops",
];

const BrowserEndgamesPage: React.FC = () => {
    const { endgame: endgameParam } = useParams<{ endgame?: string }>();
    const location = useLocation();
    const theme = useTheme();
    const [drillKey, setDrillKey] = useState<number>(0);
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
        if (!endgameParam) {
            handleResetBoard();
            return;
        }
        try {
            const endgame = endgameRecord[endgameParam as EndgameSlugs];
            if (location.hash === '#drill') {
                const gameSetup = getValidRandomSetup(endgame.drill);
                handleLoadBoard(gameSetup, [])
            } else {
                const turns = movesToTurns(endgame.moves)
                const pgnGame = new PgnGame({}, turns, undefined);
                handleLoadBoard(endgame.setup, [pgnGame]);
            }
            return;
        } catch (error) {
            console.error(error);
            handleResetBoard();
        }
    }, [endgameParam, location.hash, drillKey]);

    useEffect(() => {
        if (location.hash === '#drill') {
            setDrillKey(prev => prev + 1);
        }
    }, [path, pathIndex]);

    const handleDrillClick = () => {
        setDrillKey(prev => prev + 1);
    };

    let endgame: Endgame | null = null;
    try {
        endgame = endgameRecord[endgameParam as EndgameSlugs];
    } catch (error) {
        return;
    }
    const title = endgame?.name ?? "Endgames";
    const isDrill = location.hash === '#drill';
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
                    black={isDrill ? new RandomPlayer('b') : new HumanPlayer('b')}
                    movePiece={handleMovePiece}
                />

                <AnalysisPaperEl
                    boardState={boardState}
                    path={path}
                    pathIndex={pathIndex}
                    setPathIndex={handleSetPathIndex}
                    setLineIndex={handleSetLineIndex}
                    resetBoard={handleResetBoard}
                    // restartBoard={handleRestartBoard}
                    title={title}
                    subtitle="Learn the endgame skills"
                />

                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        {endgameSlugs.map((endgameSlug, index) => {
                            const endgame = endgameRecord[endgameSlug];
                            return (
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
                                                variant="contained" color="secondary"
                                                onClick={handleDrillClick}
                                            >
                                                Drill
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
