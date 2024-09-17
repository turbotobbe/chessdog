import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BoardState, files, lightSquareIds, PieceInfo, ranks, SquareId } from '@/models/BoardState';
import './Chessboard3.css';
import wk from '../assets/wk.png';
import wq from '../assets/wq.png';
import wr from '../assets/wr.png';
import wb from '../assets/wb.png';
import wn from '../assets/wn.png';
import wp from '../assets/wp.png';
import bk from '../assets/bk.png';
import bq from '../assets/bq.png';
import br from '../assets/br.png';
import bb from '../assets/bb.png';
import bn from '../assets/bn.png';
import bp from '../assets/bp.png';

const pieceImage = (pieceInfo: PieceInfo) => {
    switch (pieceInfo.pieceName) {
        case 'p':
            return pieceInfo.colorName === 'w' ? <img className='piece' src={wp} alt='white pawn'/> : <img className='piece' src={bp} alt='black pawn'/>;
        case 'n':
            return pieceInfo.colorName === 'w' ? <img className='piece' src={wn} alt='white knight'/> : <img className='piece' src={bn} alt='black knight'/>;
        case 'b':
            return pieceInfo.colorName === 'w' ? <img className='piece' src={wb} alt='white bishop'/> : <img className='piece' src={bb} alt='black bishop'/>;
        case 'r':   
            return pieceInfo.colorName === 'w' ? <img className='piece' src={wr} alt='white rook'/> : <img className='piece' src={br} alt='black rook'/>;
        case 'q':
            return pieceInfo.colorName === 'w' ? <img className='piece' src={wq} alt='white queen'/> : <img className='piece' src={bq} alt='black queen'/>;
        case 'k':
            return pieceInfo.colorName === 'w' ? <img className='piece' src={wk} alt='white king'/> : <img className='piece' src={bk} alt='black king'/>;
        default:
            return '';
    }   
}


const Chessboard3: React.FC<{ boardState: BoardState }> = ({ boardState }) => {
    const [asWhite, setAsWhite] = useState<boolean>(true);
    const [movedFromSquareId, setMovedFromSquareId] = useState<SquareId | null>('b7');
    const [movedToSquareId, setMovedToSquareId] = useState<SquareId | null>('f2');
    const [validMoves, setValidMoves] = useState<SquareId[]>(['b3', 'b4', 'b5']);
    const [captureMoves, setCaptureMoves] = useState<SquareId[]>(['b6', 'c2']);

    const [previousSquareId, setPreviousSquareId] = useState<SquareId | null>(null);
    const [selectedSquareId, setSelectedSquareId] = useState<SquareId | null>(null);

    useEffect(() => {
        const lastMove = boardState.getLastMove();
        if (lastMove) {
            setMovedFromSquareId(lastMove.sourceSquareId);
            setMovedToSquareId(lastMove.targetSquareId);
        } else {
            setMovedFromSquareId(null);
            setMovedToSquareId(null);
        }
    }, [boardState, selectedSquareId]);

    useEffect(() => {

        const isWhitesTurn = boardState.isWhitesTurn();

        // check if we should make a move (by click sequence)
        if (previousSquareId && selectedSquareId) {
            const previousPiece = boardState.getPiece(previousSquareId);
            if (previousPiece) {

                // check if previous click was on a movable piece
                const isPreviousWhitePiece = previousPiece.pieceInfo.colorName === 'w';
                if (isWhitesTurn === isPreviousWhitePiece) {

                    // check if selected square is a valid (or capture) move
                    if (previousPiece.getValidMoves().includes(selectedSquareId) || previousPiece.getCaptureMoves().includes(selectedSquareId)) {
                        boardState.movePiece(previousSquareId, selectedSquareId);
                        setPreviousSquareId(null);
                        setSelectedSquareId(null);
                        return;
                    }
                }
            }
        }

        // check if this is a valid click (not initial state)
        if (selectedSquareId) {
            const selectedPiece = boardState.getPiece(selectedSquareId);
            if (selectedPiece) {

                // check if the selected square contains a movable piece
                const isSelectedWhitePiece = selectedPiece.pieceInfo.colorName === 'w';
                if (isWhitesTurn === isSelectedWhitePiece) {

                    // update valid (and capture) moves
                    setValidMoves(selectedPiece.getValidMoves());
                    setCaptureMoves(selectedPiece.getCaptureMoves());
                    return;
                }
            }
        }

        // nothing to do
        setValidMoves([]);
        setCaptureMoves([]);
    }, [boardState, selectedSquareId]);

    const handleSquareClick = (squareId: SquareId) => {
        setPreviousSquareId(selectedSquareId);
        setSelectedSquareId(squareId);
    };

    return (
        <Box className="chessboard" >
            <Box className="grid" >
                {Array.from({ length: 8 }, (_, rankIndex) =>
                    Array.from({ length: 8 }, (_, fileIndex) => {
                        const file = asWhite ? files[fileIndex] : files[7 - fileIndex];
                        const rank = asWhite ? ranks[7 - rankIndex] : ranks[rankIndex];
                        const squareId: SquareId = `${file}${rank}`;
                        const isLightSquare = lightSquareIds.includes(squareId);
                        const classNames = ['square', isLightSquare ? 'white' : 'black', `${file}${rank}`];
                        if (squareId === movedFromSquareId) {
                            classNames.push('moved-from');
                        }
                        if (squareId === movedToSquareId) {
                            classNames.push('moved-to');
                        }
                        if (validMoves.includes(squareId)) {
                            classNames.push('valid-move');
                        }
                        if (captureMoves.includes(squareId)) {
                            classNames.push('capture-move');
                        }
                        const piece = boardState.getPiece(squareId);
                        if (piece) {
                            const isWhitesTurn = boardState.isWhitesTurn();
                            const isWhitePiece = piece.pieceInfo.colorName === 'w';
                            const hasPieceTurn = isWhitePiece === isWhitesTurn;
                            if (hasPieceTurn) {
                                if (squareId === selectedSquareId) {
                                    classNames.push('selected');
                                }        
                                classNames.push('has-turn');
                            }
                        }

                        return (
                            <Box key={`${rank}-${file}`} className={classNames.join(' ')}
                                onClick={() => handleSquareClick(squareId)}
                            >
                                {piece && pieceImage(piece.pieceInfo)}
                            </Box>
                        );
                    })
                )}
            </Box>
        </Box>
    );
};

export default Chessboard3;
