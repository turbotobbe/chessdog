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
import { ChessGameState, getDefaultChessGameState, nextChessGameState } from "@/models/chess";

import { PgnTurn } from "@/utils/pgn";


import BoardEl from "./BoardEl";
import { PieceId, SquareId } from "@/types/chess";
import { toPieceInfo } from "@/utils/board";

type CapturedPiece = { src: string; alt: string };

const calculatePieceValue = (pieces: { src: string; alt: string }[]) => {
    let value = pieces.filter(piece => [wp, bp].indexOf(piece.src) > 0).length;
    value += pieces.filter(piece => [wn, bn].indexOf(piece.src) > 0).length * 3;
    value += pieces.filter(piece => [wb, bb].indexOf(piece.src) > 0).length * 3;
    value += pieces.filter(piece => [wr, br].indexOf(piece.src) > 0).length * 5;
    value += pieces.filter(piece => [wq, bq].indexOf(piece.src) > 0).length * 9;
    return value;
};

interface BoardPaperElProps {
    moves: PgnTurn[];
    white: {
        name: string;
    }
    black: {
        name: string;
    }
    whitePlayerName: string;
    blackPlayerName: string;
}

function pieceToCapturedPiece(pieceId: PieceId): CapturedPiece {
    const pieceInfo = toPieceInfo(pieceId);
    if (pieceInfo.colorName === 'w') {
    switch (pieceInfo.pieceName) {
        case 'p':
            return { src: wp, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
        case 'n':
            return { src: wn, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
        case 'b':
            return { src: wb, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
        case 'r':
            return { src: wr, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
        case 'q':
            return { src: wq, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
    }
    } else {
        switch (pieceInfo.pieceName) {
            case 'p':
                return { src: bp, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
            case 'n':
                return { src: bn, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
            case 'b':
                return { src: bb, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
            case 'r':   
                return { src: br, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
            case 'q':
                return { src: bq, alt: `${pieceInfo.colorName}${pieceInfo.pieceName}` };
        }   
    }

    return { src: '', alt: '' };
}


const BoardPaperEl: React.FC<BoardPaperElProps> = ({
    moves,
    whitePlayerName,
    blackPlayerName
}) => {
    const [whiteCaptures, setWhiteCaptures] = useState<CapturedPiece[]>([]);
    const [blackCaptures, setBlackCaptures] = useState<CapturedPiece[]>([]);
    const [whiteValue, setWhiteValue] = useState(0);
    const [blackValue, setBlackValue] = useState(0);
    const [whiteClock, setWhiteClock] = useState("");
    const [blackClock, setBlackClock] = useState("");

    const [boardStates, setBoardStates] = useState<ChessGameState[]>([]);
    const [currentBoardStateIndex, setCurrentBoardStateIndex] = useState(-1);
    const [asWhite, setAsWhite] = useState(true);

    useEffect(() => {
        const boardState = getDefaultChessGameState();
        setBoardStates([boardState]);
        setCurrentBoardStateIndex(0);
        console.log(boardState);
    }, []);

    useEffect(() => {
        const boardState = boardStates[currentBoardStateIndex];
        if (!boardState || !boardState.getCapturedPieceIds) {
            return;
        }

        setBlackCaptures(boardState.getCapturedPieceIds()
            .filter(pieceId => {
                const pieceInfo = toPieceInfo(pieceId);
                return pieceInfo.colorName === 'w';
            })
            .map(pieceId => pieceToCapturedPiece(pieceId)));

        setWhiteCaptures(boardState.getCapturedPieceIds()
            .filter(pieceId => {
                const pieceInfo = toPieceInfo(pieceId);
                return pieceInfo.colorName === 'b';
            })
            .map(pieceId => pieceToCapturedPiece(pieceId)));
}, [currentBoardStateIndex]);

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
                const newBoardState = nextChessGameState(currentBoardState, {
                    fromSquareId: sourceSquareId,
                    toSquareId: targetSquareId,
                    promotionPieceName: 'q'
                });

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

if (boardStates.length === 0) {
    return <div>loading...</div>;
}

const boardState = boardStates[currentBoardStateIndex];

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
            chessGameState={boardState}
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