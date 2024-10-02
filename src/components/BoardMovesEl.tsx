import { Box, Button, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { BoardNodeState, BoardState } from "@/models/BoardState";
import { useEffect, useState } from "react";

type BoardMovesElProps = {
    boardState: BoardState,
    path: number[],
    pathIndex: number,
    setPathIndex: (pathIndex: number) => void,
    setLineIndex: (pathIndex: number, lineIndex: number) => void,
    sx?: SxProps
}
const BoardMovesEl: React.FC<BoardMovesElProps> = ({
    boardState,
    path,
    pathIndex,
    setPathIndex,
    setLineIndex,
    sx
}) => {
    const [line, setLine] = useState<{
        white: BoardNodeState,
        whiteLineCount: number,
        whiteLineIndex: number,
        black: BoardNodeState | null,
        blackLineCount: number,
        blackLineIndex: number
    }[]>([]);

    useEffect(() => {
        if (boardState.nodes.length === 0) {
            return;
        }
        let line: {
            white: BoardNodeState,
            whiteLineCount: number,
            whiteLineIndex: number,
            black: BoardNodeState | null,
            blackLineCount: number,
            blackLineIndex: number
        }[] = [];

        // select first node by path or main line
        let node = path.length > 0 ? boardState.nodes[path[0]] : boardState.nodes[0];
        line.push({
            white: node,
            whiteLineCount: boardState.nodes.length,
            whiteLineIndex: path.length > 0 ? path[0] : 0,
            black: null,
            blackLineCount: 0,
            blackLineIndex: -1
        });

        // step through the path
        for (let i = 1; i < path.length; i++) {
            const alternatives = node.nodes.length;
            node = node.nodes[path[i]];
            if (node) {
                if (line[line.length - 1].black === null) {
                    line[line.length - 1].black = node;
                    line[line.length - 1].blackLineCount = alternatives;
                    line[line.length - 1].blackLineIndex = path[i];
                } else {
                    line.push({
                        white: node,
                        whiteLineCount: alternatives,
                        whiteLineIndex: path[i],
                        black: null,
                        blackLineCount: 0,
                        blackLineIndex: -1
                    });
                }    
            }
        }

        console.log('node', node);
        while (node && node.nodes.length > 0) {
            const alternatives = node.nodes.length;
            node = node.nodes[0];
            if (line[line.length - 1].black === null) {
                line[line.length - 1].black = node;
                line[line.length - 1].blackLineCount = alternatives;
                line[line.length - 1].blackLineIndex = 0;
            } else {
                line.push({
                    white: node,
                    whiteLineCount: alternatives,
                    whiteLineIndex: 0,
                    black: null,
                    blackLineCount: 0,
                    blackLineIndex: -1
                });
            }
        }
        console.log('line', line);
        setLine(line);
    }, [boardState, path, pathIndex]);


    const handleMoveClick = (d: number) => {
        console.log('handleMoveClick', d);
        if (d === pathIndex) {
            console.log("double click");
            let node = boardState.nodes[path[0]];
            for (let i = 1; i < d; i++) {
                if (i < path.length) {
                    node = node.nodes[path[i]];
                } else {
                    node = node.nodes[0];
                }
            }
            let alternatives = node.nodes.length;
            let currentIndex = d < path.length ? path[d] : 0;
            console.log('pathIndex', d, 'path', path, 'currentIndex', currentIndex, 'alternatives', alternatives);
            if (currentIndex < alternatives - 1) {
                console.log('set new line index', currentIndex + 1);
                setLineIndex(d, currentIndex + 1);
            } else {
                console.log('set new line index', 0);
                setLineIndex(d, 0);
            }
        } else {
            console.log('set new path index', d);
            setPathIndex(d);
        }
    }

    return (
        <Box sx={{
            display: 'inline-block',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'var(--chessboard-height)',
            ...sx
        }}>

            <TableContainer sx={{ height: '100%', overflowY: 'scroll' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><Box sx={{ width: 'calc(var(--text-size))' }}>#</Box></TableCell>
                            <TableCell sx={{ textAlign: 'right', }}><Box sx={{ width: 'calc(var(--text-size))*2' }}></Box>White</TableCell>
                            <TableCell sx={{ textAlign: 'right', }}><Box sx={{ width: 'calc(var(--text-size))*2' }}></Box>Black</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {line.map((item, i) => {
                            const isWhiteCurrentMove = (i * 2) === pathIndex;
                            const isBlackCurrentMove = (i * 2 + 1) === pathIndex;
                            return (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}.</TableCell>
                                    <TableCell
                                        className={`white-${i} ${isWhiteCurrentMove ? 'current-move' : ''}`}
                                        sx={{
                                            color: 'inherit',
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: 'action.hover' },
                                            textAlign: 'right',
                                            backgroundColor: isWhiteCurrentMove ? 'action.selected' : 'inherit',

                                        }}
                                    >
                                        <Button
                                            size="small"
                                            variant="text"
                                            sx={{ textTransform: 'none', color: "white" }}
                                            onClick={() => handleMoveClick(i * 2)}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {item.white.pgn}
                                                {item.whiteLineCount > 1 &&
                                                    <Typography
                                                        component="sup"
                                                        variant="caption"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            verticalAlign: 'super',
                                                            fontSize: '0.7em',
                                                            marginLeft: '2px',
                                                        }}
                                                    >
                                                        ({item.whiteLineIndex + 1}/{item.whiteLineCount})
                                                    </Typography>
                                                }
                                            </Box>
                                        </Button>
                                    </TableCell>
                                    {item.black &&
                                        <TableCell
                                            className={`black-${i} ${isBlackCurrentMove ? 'current-move' : ''}`}
                                            sx={{
                                                color: 'inherit',
                                                cursor: 'pointer',
                                                '&:hover': { backgroundColor: 'action.hover' },
                                                textAlign: 'right',
                                                backgroundColor: isBlackCurrentMove ? 'action.selected' : 'inherit',

                                            }}
                                        >
                                            <Button
                                                size="small"
                                                variant="text"
                                                sx={{ textTransform: 'none', color: "white" }}
                                                onClick={() => handleMoveClick(i * 2 + 1)}
                                            >
                                                <Box>
                                                    {item.black.pgn}
                                                    {item.blackLineCount > 1 &&
                                                        <Typography
                                                            component="sup"
                                                            variant="caption"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                verticalAlign: 'super',
                                                                fontSize: '0.7em',
                                                                marginLeft: '2px',
                                                            }}
                                                        >
                                                            ({item.blackLineIndex + 1}/{item.blackLineCount})
                                                        </Typography>
                                                    }
                                                </Box>
                                            </Button>
                                        </TableCell>
                                    }
                                    {!item.black &&
                                        <TableCell>&nbsp;</TableCell>
                                    }
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default BoardMovesEl;