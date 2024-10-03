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
            // parsePgn("1. a3 1... a6 2. b3 2... b6 3. c3 3... c6 4. d3 4... d6 5. e3 5... e6 6. f3 6... f6 7. g3 7... g6 8. h3 8... h6 9. a4 9... a5 10. b4 10... b5 11. c4 11... c5 12. d4 12... d5 13. e4 13... e5 14. f4 14... f5 15. g4 15... g5 16. h4 16... h5"),
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
    }

    const handleResetBoard = () => {
        setBoardState(_prevBoardState => {
            const newBoardState = new BoardState();
            setPath([]);
            setPathIndex(-1);
            setChessGameState(newBoardState.chessGameState);
            return newBoardState;
        });
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
        console.log(`handle move piece ${sourceSquareId} ${targetSquareId} ${promotionPieceName}`);

        setBoardState(prevBoardState => {
            const newBoardState = prevBoardState.clone();
            let newPath = [...path];
            let newPathIndex = pathIndex;
            let newChessGameState: ChessGameState | null = null;

            // Handle existing move in the tree
            if (pathIndex < 0) {
                const lineIndex = newBoardState.nodes.findIndex(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
                if (lineIndex !== -1) {
                    newPath = [lineIndex];
                    newPathIndex = 0;
                    newChessGameState = newBoardState.nodes[lineIndex].chessGameState;
                    // TODO: add rest of line to newPath
                    let node = newBoardState.nodes[lineIndex];
                    while (node.nodes.length > 0) {
                        node = node.nodes[0];
                        newPath.push(0);
                    }
                }
                console.log('newPath', newPath);
            } else {
                let node = newBoardState.nodes[path[0]];
                for (let i = 1; i <= pathIndex; i++) {
                    node = node.nodes[path[i]];
                }
                const lineIndex = node.nodes.findIndex(node => node.sourceSquareId === sourceSquareId && node.targetSquareId === targetSquareId);
                if (lineIndex !== -1) {
                    newPath = [...path.slice(0, pathIndex + 1), lineIndex];
                    newPathIndex = pathIndex + 1;
                    newChessGameState = node.nodes[lineIndex].chessGameState;
                    // TODO: add rest of line to newPath
                    node = node.nodes[lineIndex];
                    while (node.nodes.length > 0) {
                        node = node.nodes[0];
                        newPath.push(0);
                    }
                }
                console.log('newPath', newPath);
            }

            // Handle new move
            if (!newChessGameState) {
                if (pathIndex < 0) {
                    newChessGameState = nextChessGameState(newBoardState.chessGameState, {
                        sourceSquareId, targetSquareId, promotionPieceName
                    });
                    newBoardState.nodes.push(new BoardNodeState(newChessGameState, sourceSquareId, targetSquareId, newChessGameState.pgn));
                    newPath = [newBoardState.nodes.length - 1];
                    newPathIndex = 0;
                } else {
                    let node = newBoardState.nodes[path[0]];
                    for (let i = 1; i <= pathIndex; i++) {
                        node = node.nodes[path[i]];
                    }
                    newChessGameState = nextChessGameState(node.chessGameState, {
                        sourceSquareId, targetSquareId, promotionPieceName
                    });
                    node.nodes.push(new BoardNodeState(newChessGameState, sourceSquareId, targetSquareId, newChessGameState.pgn));
                    newPath = [...path.slice(0, pathIndex + 1), node.nodes.length - 1];
                    newPathIndex = pathIndex + 1;
                }
            }

            // Update all states at once
            setPath(newPath);
            setPathIndex(newPathIndex);
            setChessGameState(newChessGameState);
            return newBoardState;
        });

    }, [pathIndex, path]);

    return {
        boardState,
        chessGameState,
        path,
        pathIndex,
        handleSetPathIndex,
        handleSetLineIndex,
        handleMovePiece,
        handleResetBoard
    };
};

