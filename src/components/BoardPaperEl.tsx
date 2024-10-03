import { Paper } from "@mui/material";
import PlayerInfoEl from "./PlayerInfoEl";
import { useEffect, useState } from "react";
import { asPieceInfo, ChessGameState } from "@/models/chess";
import BoardEl from "./BoardEl";
import { PieceId, PieceName, SquareId } from "@/types/chess";
import BoardOptionsEl from "./BoardOptionsEl";
import { BrowserView } from "react-device-detect";

const calculatePieceValue = (pieceIds: PieceId[]) => {
    const pieceInfos = pieceIds.map(pieceId => asPieceInfo(pieceId));
    let value = pieceInfos.filter(piece => piece.pieceName === 'p').length;
    value += pieceInfos.filter(piece => piece.pieceName === 'n').length * 3;
    value += pieceInfos.filter(piece => piece.pieceName === 'b').length * 3;
    value += pieceInfos.filter(piece => piece.pieceName === 'r').length * 5;
    value += pieceInfos.filter(piece => piece.pieceName === 'q').length * 9;
    return value;
};

interface BoardPaperElProps {
    chessGameState: ChessGameState,
    white: {
        name: string;
    }
    black: {
        name: string;
    },
    movePiece: (sourceSquareId: SquareId, targetSquareId: SquareId, promotionPieceName: PieceName | null) => void;
}

const BoardPaperEl: React.FC<BoardPaperElProps> = ({
    chessGameState,
    white,
    black,
    movePiece
}) => {
    const [whiteClock, setWhiteClock] = useState("");
    const [blackClock, setBlackClock] = useState("");
    const [capturedWhitePieces, setCapturedWhitePieces] = useState<PieceId[]>([]);
    const [capturedBlackPieces, setCapturedBlackPieces] = useState<PieceId[]>([]);
    const [whiteScore, setWhiteScore] = useState(0);
    const [blackScore, setBlackScore] = useState(0);

    // const [boardStates, setBoardStates] = useState<ChessGameState[]>([]);
    // const [currentBoardStateIndex, setCurrentBoardStateIndex] = useState(-1);
    const [asWhite, setAsWhite] = useState(true);

    // useEffect(() => {
    //     chessGameState.
    //     const boardState = getDefaultChessGameState();
    //     setBoardStates([boardState]);
    //     setCurrentBoardStateIndex(0);
    // }, [chessGameState]);

    useEffect(() => {
        if (!chessGameState) {
            return;
        }

        const capturedWhitePieces = chessGameState.capturedWhitePieceIds;
        const capturedBlackPieces = chessGameState.capturedBlackPieceIds;
        const capturedWhitePiecesValue = calculatePieceValue(capturedWhitePieces);
        const capturedBlackPiecesValue = calculatePieceValue(capturedBlackPieces);

        setCapturedWhitePieces(capturedWhitePieces);
        setCapturedBlackPieces(capturedBlackPieces);
        setWhiteScore(capturedBlackPiecesValue - capturedWhitePiecesValue);
        setBlackScore(capturedWhitePiecesValue - capturedBlackPiecesValue);
    }, [chessGameState]);

    useEffect(() => {
        setCapturedWhitePieces([]);
        setCapturedBlackPieces([]);
        setWhiteClock("");
        setBlackClock("");
        setWhiteScore(0);
        setBlackScore(0);
    }, []);

    const handleMovePiece = (sourceSquareId: SquareId, targetSquareId: SquareId) => {
        console.log(`handleMovePiece ${sourceSquareId} ${targetSquareId}`);
        movePiece(sourceSquareId, targetSquareId, 'q');
    }

    if (!chessGameState) {
        return <div>loading...</div>;
    }

    const top = {
        color: asWhite ? 'black' : 'white',
        name: asWhite ? black.name : white.name,
        clock: asWhite ? blackClock : whiteClock,
        captures: asWhite ? capturedWhitePieces : capturedBlackPieces,
        value: asWhite ? blackScore : whiteScore
    }

    const bottom = {
        color: asWhite ? 'white' : 'black',
        name: asWhite ? white.name : black.name,
        clock: asWhite ? whiteClock : blackClock,
        captures: asWhite ? capturedBlackPieces : capturedWhitePieces,
        value: asWhite ? whiteScore : blackScore
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
                color={top.color}
                name={top.name}
                clock={top.clock}
                pieceIds={top.captures}
                pieceValue={top.value} />
            <PlayerInfoEl
                sx={{
                    gridArea: 'foot',
                }}
                color={bottom.color}
                name={bottom.name}
                clock={bottom.clock}
                pieceIds={bottom.captures}
                pieceValue={bottom.value} />

            <BoardEl
                sx={{ gridArea: 'body' }}
                chessGameState={chessGameState}
                asWhite={asWhite}
                movePiece={handleMovePiece}
            />
            <BrowserView>
            <BoardOptionsEl sx={{ gridArea: 'east' }} isAsWhite={asWhite} asWhite={setAsWhite} />
            </BrowserView>
            {/* <BoardEl sx={{ gridArea: 'body' }} /> */}

            {/* <ScoreSheetEl sx={{ gridArea: 'east' }} moves={moves} /> */}
            {/* <BoardPlayerEl sx={{ gridArea: 'se' }} /> */}
            {/* <BoardToolsEl sx={{ gridArea: 'ne' }} /> */}
        </Paper>
    )
}

export default BoardPaperEl;