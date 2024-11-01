import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useChessBoard } from '@/contexts/ChessBoardContext';
import { defaultChessBoardController } from '@/controllers/DefaultChessBoardController';
import { BoardPaper } from '@/elements/BoardPaper';
import { SheetPaper } from '@/elements/SheetPaper';
import { ControlsPaper } from '@/elements/ControlsPaper';
import { GridColorName } from '@/dnd/DnDTypes';
import { defaultChessBoardState, emptyChessBoardState } from '@/contexts/ChessBoardState';
import { ChessBoardController, ControllerHandler } from '@/contexts/ChessBoardController';
import { useParams } from 'react-router-dom';
import { Opening } from '@/types/chess';
import { parseMove, parsePgn } from '@/utils/pgn';

const OpeningPage: React.FC = () => {
    const { addController, setController } = useChessBoard();
    const [chessBoardKey, setChessBoardKey] = useState<string | null>(null);
    const [asWhite, setAsWhite] = useState<boolean>(true);
    const [arrowColorName, setArrowColorName] = useState<GridColorName>('orange');
    const [markColorName, setMarkColorName] = useState<GridColorName>('red');
    const [chessBoards, setChessBoards] = useState<{ key: string, controller: ChessBoardController }[]>([]);
    const { openingCategorySlug, openingSlug } = useParams<{ openingCategorySlug?: string, openingSlug?: string }>();
    const [data, setData] = useState<Opening | null>(null);
    // const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async () => {
        try {
            console.log("loading opening", openingSlug);
            const response = await fetch(`/openings/${openingCategorySlug}/${openingSlug}.json`);
            const data: Opening = await response.json();
            setData(data);
        } catch (error) {
            console.error("Error fetching opening data:", error);
            // setError(error as Error);
        }
    }, [openingSlug]);

    useEffect(() => {
        // console.log('chessBoardKey', chessBoardKey);
        if (!openingSlug) {
            setData(null);
            return;
        }
        load();
    }, [openingSlug, load]);

    useEffect(() => {
        // console.log('data', data);
        let chessBoards: { key: string, controller: ChessBoardController }[] = [];
        if (data) {
            chessBoards = [{
                key: "Explore",
                controller: loadExploreController()
            }, {
                key: "Play",
                controller: loadPlayController()
            }];
            chessBoards.forEach((chessBoard) => {
                addController(chessBoard.key, chessBoard.controller);
            });
            setChessBoards(chessBoards);
            setChessBoardKey(chessBoards[0].key);
        }
    }, [data]);

    const loadExploreController = (): ChessBoardController => {
        if (data) {
            const exploreState = defaultChessBoardState();
            const exploreController = defaultChessBoardController('Explore', true, true, exploreState.clone());
            for (const line of data.lines) {
                exploreController.selectFirst();
                const pgnGame = parsePgn(line.moves, line.name);
                pgnGame.turns.forEach((turn) => {
                    const move = parseMove(exploreController.currentState(), turn.white.pgn)
                    // const [sourceSquareId, targetSquareId] = parsePgnMove(exploreController.currentState(), true, turn.white.pgn);
                    exploreController.onMove(move.sourceSquareId, move.targetSquareId);
                    if (turn.black) {
                        const move = parseMove(exploreController.currentState(), turn.black.pgn);
                        exploreController.onMove(move.sourceSquareId, move.targetSquareId);
                    }
                });
                exploreController.onComment(line.name);
            };
            exploreController.selectFirst();
            return exploreController;
        } else {
            return defaultChessBoardController('Explore', true, true, emptyChessBoardState().clone());
        }
    }

    const loadPlayController = (): ChessBoardController => {
        if (data) {
            const playState = defaultChessBoardState();
            const playController = defaultChessBoardController('Play', true, true, playState.clone());
            for (const line of data.lines) {
                playController.selectFirst();
                const pgnGame = parsePgn(line.moves, line.name);
                pgnGame.turns.forEach((turn) => {
                    const move = parseMove(playController.currentState(), turn.white.pgn);
                    playController.onMove(move.sourceSquareId, move.targetSquareId);
                    if (turn.black) {
                        const move = parseMove(playController.currentState(), turn.black.pgn);
                        playController.onMove(move.sourceSquareId, move.targetSquareId);
                    }
                });
                playController.onComment(line.name);
            };
            playController.selectFirst();
            return playController;
        } else {
            return defaultChessBoardController('Play', true, true, emptyChessBoardState().clone());
        }
    }
    const handlers: Record<string, ControllerHandler> = {
        'Explore': {
            'reload': () => {
                if (data) {
                    setController('Explore', loadExploreController());
                }
            }
        },
        'Play': {
            'reload': () => {
                if (data) {
                    setController('Play', loadPlayController());
                }
            }
        }
    }

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
                handler={handlers[chessBoardKey]}
            />
        </Box>
    )
}

export default OpeningPage;
