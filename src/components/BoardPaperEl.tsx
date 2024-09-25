import { Paper } from "@mui/material";
import PlayerInfoEl from "./PlayerInfoEl";
import { useEffect, useState } from "react";

import wp from '../assets/wp.png';
import wr from '../assets/wr.png';
import wn from '../assets/wn.png';
import wb from '../assets/wb.png';
import wq from '../assets/wq.png';
// import wk from '../assets/wk.png';
import bp from '../assets/bp.png';
import br from '../assets/br.png';
import bn from '../assets/bn.png';
import bb from '../assets/bb.png';
import bq from '../assets/bq.png';
// import bk from '../assets/bk.png';

import { PgnMove } from "@/utils/pgn";
import ScoreSheetEl from "./ScoreSheetEl";
import BoardPlayerEl from "./BoardPlayerEl";
import BoardToolsEl from "./BoardToolsEl";
import { getDefaultBoard, movePiece } from "@/utils/board";
import { SquareId } from "@/models/BoardState";
import BoardEl from "./BoardEl";

const calculatePieceValue = (pieces: { src: string; alt: string }[]) => {
    let value = pieces.filter(piece => [wp, bp].indexOf(piece.src) > 0).length;
    value += pieces.filter(piece => [wn, bn].indexOf(piece.src) > 0).length * 3;
    value += pieces.filter(piece => [wb, bb].indexOf(piece.src) > 0).length * 3;
    value += pieces.filter(piece => [wr, br].indexOf(piece.src) > 0).length * 5;
    value += pieces.filter(piece => [wq, bq].indexOf(piece.src) > 0).length * 9;
    return value;
};

interface BoardPaperElProps {
    moves: PgnMove[];
    white: {
        name: string;
    }
    black: {
        name: string;
    }
    whitePlayerName: string;
    blackPlayerName: string;
}

const BoardPaperEl: React.FC<BoardPaperElProps> = ({
    moves,
    whitePlayerName,
    blackPlayerName
}) => {
    const [whiteCaptures, setWhiteCaptures] = useState([]);
    const [blackCaptures, setBlackCaptures] = useState([]);
    const [whiteValue, setWhiteValue] = useState(0);
    const [blackValue, setBlackValue] = useState(0);
    const [whiteClock, setWhiteClock] = useState("");
    const [blackClock, setBlackClock] = useState("");

    const [boardStates, setBoardStates] = useState([getDefaultBoard()]);
    const [currentBoardStateIndex, setCurrentBoardStateIndex] = useState(0);
    const [asWhite, setAsWhite] = useState(true);

    useEffect(() => {
        setWhiteCaptures([]);
        setBlackCaptures([]);
        setWhiteValue(0);
        setBlackValue(0);
        setWhiteClock("");
        setBlackClock("");
    }, [moves]);

    const handleMovePiece = (sourceSquareId: SquareId, targetSquareId: SquareId) => {
        setBoardStates(currentBoardStates => {
            let newBoardStates = currentBoardStates;

            setCurrentBoardStateIndex(currentIndex => {
                console.log(`handleMovePiece ${currentIndex} ${currentBoardStates.length} ${sourceSquareId} ${targetSquareId}`);

                if (currentBoardStates.length === 0) {
                    console.warn('No board states available to move pieces.');
                    return currentIndex;
                }

                const currentBoardState = currentBoardStates[currentIndex];

                try {
                    const newBoardState = movePiece(currentBoardState, sourceSquareId, targetSquareId);

                    // Create a new array with states up to the current index, plus the new state
                    newBoardStates = [
                        ...currentBoardStates.slice(0, currentIndex + 1),
                        newBoardState
                    ];

                    return newBoardStates.length - 1; // New index
                } catch (error) {
                    console.error('Error moving piece:', error);
                    return currentIndex;
                }
            });

            return newBoardStates; // Return the new board states
        });
    }

    return (
        <Paper className='chessboard-paper'
            elevation={1}
            sx={{
                display: 'grid',
                p: 'var(--chessboard-paper-padding)',
                m: 'var(--chessboard-paper-margin)',
                gap: 'var(--chessboard-paper-gap)',
                width: 'fit-content',
                height: 'fit-content',
                gridTemplateColumns: 'auto 1fr auto',
                gridTemplateRows: 'auto 1fr auto',
                gridTemplateAreas: `
            "nw head ne"
            "west body east"
            "sw foot se"
        `,
            }}
        >
            <PlayerInfoEl
                sx={{
                    gridArea: 'head',
                }}
                color='black'
                name={blackPlayerName}
                clock={blackClock}
                captures={blackCaptures}
                value={calculatePieceValue(blackCaptures) - calculatePieceValue(whiteCaptures)} />
            <PlayerInfoEl
                sx={{
                    gridArea: 'foot',
                }}
                color='white'
                name={whitePlayerName}
                clock={whiteClock}
                captures={whiteCaptures}
                value={calculatePieceValue(whiteCaptures) - calculatePieceValue(blackCaptures)} />

            <BoardEl
                sx={{ gridArea: 'body' }}
                boardState={boardStates[currentBoardStateIndex]}
                asWhite={true}
                movePiece={handleMovePiece}
            />
            {/* <BoardEl sx={{ gridArea: 'body' }} /> */}

            {/* <ScoreSheetEl sx={{ gridArea: 'east' }} moves={moves} /> */}
            {/* <BoardPlayerEl sx={{ gridArea: 'se' }} /> */}
            {/* <BoardToolsEl sx={{ gridArea: 'ne' }} /> */}
        </Paper>
    )
}

export default BoardPaperEl;