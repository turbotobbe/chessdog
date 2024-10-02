import { useState, useEffect, useCallback } from 'react';
import { BoardState, BoardNodeState, loadBoardState } from '@/models/BoardState';
import { ChessGameState, nextChessGameState } from '@/models/chess';
import { PieceName, SquareId } from '@/types/chess';
import { PgnGame } from '@/utils/pgn';

export const useChessGame = () => {
    const [boardState, setBoardState] = useState<BoardState>(new BoardState());
    const [chessGameState, setChessGameState] = useState<ChessGameState>(new ChessGameState());
    const [path, setPath] = useState<number[]>([]);
    const [pathIndex, setPathIndex] = useState<number>(-1);

    useEffect(() => {
        const games: PgnGame[] = [
            // parsePgn("1. e4 1... e5"),
            // parsePgn("1. f4 1... f5"),
            // parsePgn("1. e4"),
            // parsePgn("1. e4 1... e5 2. d4 2... d5"),
            // parsePgn("1. e4 1... e5 2. Nf3 2... Nc6 3. Bc4"),
            // parsePgn("1. e4 1... e5 2. Nf3 2... Nf6 3. Nxe5"),
            // parsePgn("1. d4 1... d5 2. Bf4 2... Bf5 3. Nc3 3... Nc6 4. Qd2 4... Qd7 5. O-O-O 5... O-O-O"),
            // parsePgn("1. e4 1... d5 2. exd5 2... e5 3. e6"),
            // parsePgn("1. e4 1... d5 2. exd5 2... c6 3. dxc6 3... Nf6 4. cxb7 4... Bd7 5. bxa8=Q"),
            // parsePgn("1. e4 1... d5 2. exd5 2... c5 3. d6 3... Qa5 4. d7+ 4... Kd8 5. c3 5... Kc7 6. d8=Q+"),
        ]
        const newBoardState = loadBoardState(boardState, games);
        setBoardState(newBoardState);

        // set initial main line path ([0, 0, 0, 0, 0, 0, 0, 0]...)
        const newPath = [];
        let node = newBoardState.nodes[0];
        while (node) {
            newPath.push(0);
            node = node.nodes[0];
        }
        setPath(newPath);
    }, []);

    useEffect(() => {
        console.log(`effect pathIndex ${pathIndex} path ${path}`);
        if (pathIndex < 0) {
            setChessGameState(boardState.chessGameState);
        } else if (pathIndex < path.length) {
            let node = boardState.nodes[path[0]];
            for (let i = 1; i <= pathIndex; i++) {
                node = node.nodes[path[i]];
            }
            setChessGameState(node.chessGameState);
        } else {
            throw new Error(`pathIndex ${pathIndex} is out of bounds`);
        }
    }, [pathIndex, path]);

    const setLineIndex = (pathIndex: number, lineIndex: number) => {
        console.log(`setLineIndex pathIndex ${pathIndex} lineIndex ${lineIndex} path ${path}`);
        if (pathIndex < 0) {
            throw new Error(`pathIndex ${pathIndex} is out of bounds`);
        } else if (pathIndex >= path.length) {
            throw new Error(`pathIndex ${pathIndex} is out of bounds`);
        }

        // reuse previous path up to pathIndex
        let newPath = [...path.slice(0, pathIndex + 1)];

        // set new line index
        newPath[pathIndex] = lineIndex;

        // traverse new path
        let node = boardState.nodes[newPath[0]];
        for (let i = 1; i < newPath.length; i++) {
            node = node.nodes[newPath[i]];
        }
        let chessGameState = node.chessGameState;
        console.log('newPath', newPath);

        // traverse rest of main line
        node = node.nodes[0];
        while (node) {
            newPath.push(0);
            node = node.nodes[0];
        }
        console.log('newPath', newPath);

        setPath(newPath);
        setPathIndex(pathIndex);
        setChessGameState(chessGameState);
    }

    const handleSetPathIndex = (index: number) => {
        console.log(`handle set path index ${index}`);
        setPathIndex(index);
    };

    const handleSetLineIndex = (pathIndex: number, lineIndex: number) => {
        console.log(`handle set line index path ${pathIndex} line ${lineIndex}`);
        setLineIndex(pathIndex, lineIndex);
    };

    const handleMovePiece = useCallback((sourceSquareId: SquareId, targetSquareId: SquareId, promotionPieceName: PieceName | null) => {
        console.log(`handle move piece ${sourceSquareId} ${targetSquareId}`);

        // handle the case where the move already exists in the tree
        if (pathIndex < 0) {
            const lineIndex = boardState.nodes.findIndex(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
            if (lineIndex !== -1) {
                setLineIndex(pathIndex + 1, lineIndex); // i.e. 0,Y
                return;
            }
        } else {
            let node = boardState.nodes[path[0]];
            for (let i = 1; i < pathIndex; i++) {
                node = node.nodes[path[i]];
            }
            const lineIndex = node.nodes.findIndex(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
            if (lineIndex !== -1) {
                setLineIndex(pathIndex + 1, lineIndex); // i.e. X,Y
                return;
            }
        }

        // handle new move
        let newLineIndex: number = -1;
        setBoardState(prevBoardState => {
            const newBoardState = prevBoardState.clone();
            if (pathIndex < 0) {
                const newChessGameState = nextChessGameState(newBoardState.chessGameState, {
                    sourceSquareId: sourceSquareId,
                    targetSquareId: targetSquareId,
                    promotionPieceName: promotionPieceName
                });
                newBoardState.nodes.push(new BoardNodeState(newChessGameState, sourceSquareId, targetSquareId, newChessGameState.pgn));
                newLineIndex = newBoardState.nodes.length - 1;
            } else {
                let node = newBoardState.nodes[path[0]];
                for (let i = 1; i <= pathIndex; i++) {
                    node = node.nodes[path[i]];
                }
                const newChessGameState = nextChessGameState(node.chessGameState, {
                    sourceSquareId: sourceSquareId,
                    targetSquareId: targetSquareId,
                    promotionPieceName: promotionPieceName
                });
                node.nodes.push(new BoardNodeState(newChessGameState, sourceSquareId, targetSquareId, newChessGameState.pgn));
                newLineIndex = node.nodes.length - 1;
            }
            return newBoardState;
        });
        const oldPath = [...path];
        const newPath = [...path.slice(0, pathIndex + 1), newLineIndex];
        console.log('oldPath', oldPath, 'newPath', newPath, 'newLineIndex', newLineIndex);
        setPath(newPath);
        setPathIndex(pathIndex + 1);
        setChessGameState(chessGameState);
    }, [pathIndex, path]);

    return {
        boardState,
        chessGameState,
        path,
        pathIndex,
        handleSetPathIndex,
        handleSetLineIndex,
        handleMovePiece
    };
};

