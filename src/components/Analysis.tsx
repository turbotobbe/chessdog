import React from 'react';
import Chessboard from './Chessboard';
import './Analysis.css';
import { BoardSetup } from '../models/BoardSetup';
import { getDefaultBoard, getRandomBoard } from '../utils/boardUtil';

const Analysis: React.FC = () => {
    const boardSetup = new BoardSetup();
    // const board = getRandomBoard(['wk', 'wq', 'wr', 'wr', 'wb', 'wb', 'wn','wn', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'bk', 'bq', 'br', 'br', 'bb', 'bb', 'bn','bn', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp']);
    const board = getDefaultBoard();
    if (board) {
        boardSetup.setBoard(board);
    }
    console.log(board);

    return (
        <div className="analysis-container">
            <Chessboard boardSetup={boardSetup} />
        </div>
    );
};

export default Analysis;