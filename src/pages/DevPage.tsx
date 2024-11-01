import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useChessBoard } from '@/contexts/ChessBoardContext';
import { defaultChessBoardController } from '@/controllers/DefaultChessBoardController';
import { GridColorName } from '@/dnd/DnDTypes';
import { BoardPaper } from '@/elements/BoardPaper';
import { ControlsPaper } from '@/elements/ControlsPaper';
import { SheetPaper } from '@/elements/SheetPaper';
import { randomChessBoardState, setupChessBoardState } from '@/contexts/ChessBoardState';
import { ChessBoardController, ControllerHandler } from '@/contexts/ChessBoardController';

const DevPage: React.FC = () => {
    const { addController, getController, setController } = useChessBoard();
    const [chessBoardKey, setChessBoardKey] = useState<string | null>(null);
    const [asWhite, setAsWhite] = useState<boolean>(true);
    const [arrowColorName, setArrowColorName] = useState<GridColorName>('orange');
    const [markColorName, setMarkColorName] = useState<GridColorName>('red');
    const [chessBoards, setChessBoards] = useState<{ key: string, controller: ChessBoardController }[]>([]);

    // const state = randomChessBoardState(true, ['wp1', 'bp1', 'wp2', 'bp2', 'wp3', 'bp3', 'wp4', 'bp4', 'wp5', 'bp5', 'wp6', 'bp6', 'wp7', 'bp7', 'wp8', 'bp8']);

    useEffect(() => {

        // console.log('random', state.whiteKingStatus.squareId);
        const state = setupChessBoardState(true,   {
            "h8": "bk1",
            "e7": "wq1",
            "a1": "wk1"
        })
        console.log('state', state);
        const chessBoards = [{
            key: "Explore",
            controller: defaultChessBoardController('Explore', true, true, state)

        }];
        // }, {
        //     key: "Play",
        //     controller: defaultChessBoardController('Play', true, false, state.clone())
        // }];
        // console.log('controllers created', chessBoards[0].controller.currentState().whiteKingStatus.squareId);
        chessBoards.forEach((chessBoard) => {
            addController(chessBoard.key, chessBoard.controller);
        });
        setChessBoards(chessBoards);
        setChessBoardKey(chessBoards[0].key);
    }, []);

    const handlers: Record<string, ControllerHandler> = {
        'Explore': {
            'restart': () => {
                const controller = getController('Explore');
                if (controller) {
                    controller.reset();
                    setController('Explore', controller);
                }
            }
        },
        'Play': {
            'restart': () => {
                const controller = getController('Explore');
                if (controller) {
                    controller.reset();
                    setController('Explore', controller);
                }
            },
            'reload': () => {
                const state = randomChessBoardState(true, ['wp1', 'bp1', 'wp2', 'bp2', 'wp3', 'bp3', 'wp4', 'bp4', 'wp5', 'bp5', 'wp6', 'bp6', 'wp7', 'bp7', 'wp8', 'bp8']);
                const newController = defaultChessBoardController('Play', true, false, state.clone())
                setController('Play', newController);
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
};

export default DevPage;
