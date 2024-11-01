import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useChessBoard } from '@/contexts/ChessBoardContext';
import { defaultChessBoardController } from '@/controllers/DefaultChessBoardController';
import { BoardPaper } from '@/elements/BoardPaper';
import { SheetPaper } from '@/elements/SheetPaper';
import { ControlsPaper } from '@/elements/ControlsPaper';
import { GridColorName } from '@/dnd/DnDTypes';
import { defaultChessBoardState } from '@/contexts/ChessBoardState';
import { ChessBoardController, ControllerHandler } from '@/contexts/ChessBoardController';

const AnalysPage: React.FC = () => {
    const { addController, getController, setController } = useChessBoard();
    const [chessBoardKey, setChessBoardKey] = useState<string | null>(null);
    const [asWhite, setAsWhite] = useState<boolean>(true);
    const [arrowColorName, setArrowColorName] = useState<GridColorName>('orange');
    const [markColorName, setMarkColorName] = useState<GridColorName>('red');
    const [chessBoards, setChessBoards] = useState<{ key: string, controller: ChessBoardController }[]>([]);

    useEffect(() => {

        // console.log('random', state.whiteKingStatus.squareId);
        const chessBoards = [{
            key: "Explore",
            controller: defaultChessBoardController('Explore', true, true, defaultChessBoardState().clone())
        }, {
            key: "Play",
            controller: defaultChessBoardController('Play', true, false, defaultChessBoardState().clone())
        }];
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
                const controller = getController('Play');
                if (controller) {
                    controller.reset();
                    setController('Play', controller);
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

export default AnalysPage;
