import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useChessBoard } from '@/contexts/ChessBoardContext';
import { defaultChessBoardController } from '@/controllers/DefaultChessBoardController';
import { BoardPaper } from '@/elements/BoardPaper';
import { SheetPaper } from '@/elements/SheetPaper';
import { ControlsPaper } from '@/elements/ControlsPaper';
import { GridColorName } from '@/dnd/DnDTypes';
import { ChessBoardState, emptyChessBoardState, randomChessBoardState, setupChessBoardState } from '@/contexts/ChessBoardState';
import { ChessBoardController, ControllerHandler } from '@/contexts/ChessBoardController';
import { useParams } from 'react-router-dom';
import { Endgame, PieceId, SquareId } from '@/types/chess';
import { asPieceInfo } from '@/models/chess';

const parsePgn = (state: ChessBoardState, isWhite: boolean, pgn: string): [SquareId, SquareId] => {
    // Remove +, #, and =Q at the end
    const colorName = isWhite ? 'w' : 'b';
    const pgnWithoutSpecialChars = pgn.replace(/[+#=].*$/, '');
    const targetSquareId = pgnWithoutSpecialChars.slice(-2);
    const pgnWithoutTarget = pgnWithoutSpecialChars.slice(0, -2);
    const pieceName = ['k', 'q', 'r', 'b', 'n'].includes(pgnWithoutTarget.charAt(0).toLowerCase()) ? pgnWithoutTarget.charAt(0).toLowerCase() : 'p';

    // console.log("pgn", pgn, colorName, pieceName, pgnWithoutSpecialChars, pgnWithoutTarget, targetSquareId);

    // Find piece that can move to the target square
    const validMoves = isWhite ? state.validWhiteMoves : state.validBlackMoves;
    const pieceId = Object.entries(validMoves)
        .find(([pieceId, squares]) => {
            const pieceInfo = asPieceInfo(pieceId as PieceId);
            if (pieceInfo.pieceName !== pieceName) return false;
            if (pieceInfo.colorName !== colorName) return false;
            return squares.includes(targetSquareId as SquareId);
        })?.[0];

    if (!pieceId) {
        throw new Error(`No ${colorName}${pieceName} found that can move to ${targetSquareId}`);
    }
    // Find the square the piece is currently on
    const sourceSquareId = Object.entries(state.squares)
        .find(([_, id]) => id === pieceId)?.[0] as SquareId;

    if (!sourceSquareId) {
        throw new Error(`Piece ${pieceId} not found on board`);
    }
    return [sourceSquareId, targetSquareId as SquareId];
}

const EndgamePage: React.FC = () => {
    const { addController, setController } = useChessBoard();
    const [chessBoardKey, setChessBoardKey] = useState<string | null>(null);
    const [asWhite, setAsWhite] = useState<boolean>(true);
    const [arrowColorName, setArrowColorName] = useState<GridColorName>('orange');
    const [markColorName, setMarkColorName] = useState<GridColorName>('red');
    const [chessBoards, setChessBoards] = useState<{ key: string, controller: ChessBoardController }[]>([]);
    const { endgameSlug } = useParams<{ endgameSlug?: string }>();
    const [data, setData] = useState<Endgame | null>(null);
    // const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async () => {
        try {
            console.log("loading endgame", endgameSlug);
            const response = await fetch(`/endgames/${endgameSlug}.json`);
            const data: Endgame = await response.json();
            setData(data);
        } catch (error) {
            console.error("Error fetching endgame data:", error);
            // setError(error as Error);
        }
    }, [endgameSlug]);

    useEffect(() => {
        // console.log('chessBoardKey', chessBoardKey);
        if (!endgameSlug) {
            setData(null);
            return;
        }
        load();
    }, [endgameSlug, load]);

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
            const exploreState = setupChessBoardState(true, data.setup);
            const exploreController = defaultChessBoardController('Explore', true, true, exploreState.clone());
            data.moves.forEach((move, index) => {
                const isWhite = index % 2 === 0;
                const [sourceSquareId, targetSquareId] = parsePgn(exploreController.currentState(), isWhite, move.pgn);
                exploreController.onMove(sourceSquareId, targetSquareId);
                move.arrows?.forEach((arrow) => {
                    exploreController.onArrow(arrow.fromSquareId, arrow.toSquareId, 'orange');
                });
                move.marks?.forEach((mark) => {
                    exploreController.onMark(mark, 'red');
                });
                move.comments?.forEach((comment) => {
                    exploreController.onComment(comment);
                });
            });
            exploreController.selectFirst();
            return exploreController;
        } else {
            return defaultChessBoardController('Explore', true, true, emptyChessBoardState().clone());
        }
    }

    const loadPlayController = (): ChessBoardController => {
        if (data) {
            const drillState = randomChessBoardState(true, data.drill);
            const controller = defaultChessBoardController('Play', true, false, drillState.clone());
            return controller;
        } else {
            return defaultChessBoardController('Play', true, false, emptyChessBoardState().clone());
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

export default EndgamePage;
