import React from 'react';
import Chessboard from './Chessboard';
import './Analysis.css';
import { BoardSetup } from '../models/BoardSetup';

const Analysis: React.FC = () => {
    const boardSetup = new BoardSetup();
    //boardSetup.setDefaultSetup();
    boardSetup.setQueenEndGameSetup();
    console.log(boardSetup.getBoard());
    return (
        <div className="analysis-container">
            <Chessboard boardSetup={boardSetup} />
        </div>
    );
};

export default Analysis;