import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { ChessContainer } from '@/elements/ChessContainer';
import { useChessBoard } from '@/contexts/ChessBoardContext';
import { defaultChessBoardController } from '@/controllers/DefaultChessBoardController';

const AnalysPage: React.FC = () => {
    const { addController } = useChessBoard();

    const chessBoards = [{
        key: "Explore",
        controller: defaultChessBoardController(true, true)
    },{
        key: "Play",
        controller: defaultChessBoardController(true, false)
    }];

    useEffect(() => {
        chessBoards.forEach((chessBoard) => {
            addController(chessBoard.key, chessBoard.controller);
        });
    }, []);

    return (
        <Box>
            <ChessContainer
                chessBoardKeys={chessBoards.map((chessBoard) => chessBoard.key)}
            />
        </Box>
    )
}

export default AnalysPage;
