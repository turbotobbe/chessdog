import AnalysisPaperEl from '@/components/AnalysisPaperEl';
import BoardPaperEl from '@/components/BoardPaperEl';
import { useChessGame } from '@/contexts/ChessGame';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

const BrowserAnalysisPage: React.FC = () => {
    const theme = useTheme();
    const {
        boardState,
        chessGameState,
        path,
        pathIndex,
        handleSetPathIndex,
        handleSetLineIndex,
        handleMovePiece
    } = useChessGame();

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
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

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
                />

                {Array.from({ length: 8 }, (_, index) => (
                    <Typography variant='body1' key={index} p={2}>
                        Chess is a game of strategy and skill that has captivated players for centuries. Its complex rules and infinite possibilities make it a challenging and rewarding pursuit. From the opening moves to the endgame, every decision can have far-reaching consequences. Players must think several steps ahead, anticipating their opponent's moves while planning their own. The beauty of chess lies in its balance of tactical maneuvers and long-term strategic planning.
                    </Typography>
                ))}

            </Box>
        </Box>
    )
};

export default BrowserAnalysisPage;
