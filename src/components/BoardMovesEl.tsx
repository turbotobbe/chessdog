import { Box, Button, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { BoardNodeState, BoardState } from "@/models/BoardState";
import { useEffect, useRef, useState } from "react";

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
    const tableRef = useRef<HTMLTableElement>(null);
    
    const [line, setLine] = useState<{
        white: BoardNodeState,
        whiteLineCount: number,
        whiteLineIndex: number,
        black: BoardNodeState | null,
        blackLineCount: number,
        blackLineIndex: number
    }[]>([]);

    useEffect(() => {
        if (tableRef.current) {
            const currentMoveElement = tableRef.current.querySelector('.current-line');
            if (currentMoveElement) {
                const headerHeight = tableRef.current.querySelector('thead')?.clientHeight || 0;
                const containerRect = tableRef.current.getBoundingClientRect();
                const elementRect = currentMoveElement.getBoundingClientRect();
                
                if (elementRect.top < containerRect.top + headerHeight) {
                    // Element is hidden behind the header, scroll it into view
                    tableRef.current.scrollTop = tableRef.current.scrollTop + (elementRect.top - containerRect.top - headerHeight) - 10;
                } else if (elementRect.bottom > containerRect.bottom) {
                    // Element is below the visible area, scroll it into view
                    currentMoveElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                // If the element is already visible, do nothing
            }
        }
    }, [pathIndex]);

    useEffect(() => {
        let line: {
            white: BoardNodeState,
            whiteLineCount: number,
            whiteLineIndex: number,
            black: BoardNodeState | null,
            blackLineCount: number,
            blackLineIndex: number
        }[] = [];

        // early return if path is empty
        if (path.length == 0) {
            setLine([]);
            return;
        }

        // select first node by path
        let node = boardState.nodes[path[0]];
        if (!node) {
            throw new Error('node not found');
        }

        // add first node to line
        line.push({
            white: node,
            whiteLineCount: boardState.nodes.length,
            whiteLineIndex: path[0],
            black: null,
            blackLineCount: 0,
            blackLineIndex: -1
        });

        // step through the path
        for (let i = 1; i < path.length; i++) {
            const alternatives = node.nodes.length;
            node = node.nodes[path[i]];
            if (!node) {
                throw new Error('node not found');
            }

            if (line[line.length - 1].black === null) {
                // add black node if it doesn't exist
                line[line.length - 1].black = node;
                line[line.length - 1].blackLineCount = alternatives;
                line[line.length - 1].blackLineIndex = path[i];
            } else {
                // add new line and white node otherwise
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

        if (node.nodes.length > 0) {
            throw new Error('node has alternatives');
        }
        console.log('line', line);
        setLine(line);
    }, [boardState, path]);


    const handleMoveClick = (index: number) => {
        console.log('handleMoveClick', index);
        if (index === pathIndex) {
            console.log("double click");

            // initial
            let alternatives = boardState.nodes.length;
            let currentIndex = path[pathIndex];

            if (pathIndex > 0) {
                // traverse to the the correct alternatives
                let node = boardState.nodes[path[0]];
                alternatives = node.nodes.length;
                for (let i = 1; i < pathIndex; i++) {
                    node = node.nodes[path[i]];
                    alternatives = node.nodes.length;
                }
            }

            // round robin through alternatives
            console.log('pathIndex', index, 'path', path, 'currentIndex', currentIndex, 'alternatives', alternatives);
            if (currentIndex < alternatives - 1) {
                console.log('set new line index', currentIndex + 1);
                setLineIndex(index, currentIndex + 1);
            } else {
                console.log('set new line index', 0);
                setLineIndex(index, 0);
            }
        } else {
            console.log('set new path index', index);
            setPathIndex(index);
        }
    }

    return (
        <Box sx={{
            display: 'inline-block',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'var(--chessboard-height)',
            position: 'relative',
            ...sx
        }}>

            <TableContainer ref={tableRef} sx={{ height: '100%', overflowY: 'scroll' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ width: 'calc(var(--text-size))' }}>#</Box>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                                <Box sx={{ width: 'calc(var(--text-size)*4)', paddingRight: 'calc(var(--text-size)/2)' }} >White</Box>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', }}>
                                <Box sx={{ width: 'calc(var(--text-size)*4)', paddingRight: 'calc(var(--text-size)/2)' }}>Black</Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {line.map((item, i) => {
                            const isFirstLineCurrentLine = i === 0 && pathIndex < 0;
                            const isWhiteCurrentMove = (i * 2) === pathIndex;
                            const isBlackCurrentMove = (i * 2 + 1) === pathIndex;
                            return (
                                <TableRow key={i}>
                                    <TableCell
                                        className={`move-number ${isFirstLineCurrentLine || isWhiteCurrentMove || isBlackCurrentMove ? 'current-line' : ''}`}
                                    >{i + 1}.</TableCell>
                                    <TableCell
                                        className={`white-${i} ${isWhiteCurrentMove ? 'current-move' : ''}`}
                                        sx={{
                                            textAlign: 'right',
                                            color: 'inherit',
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: 'action.hover' },
                                            backgroundColor: isWhiteCurrentMove ? 'action.selected' : 'inherit',
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            variant="text"
                                            sx={{ textTransform: 'none', color: "white" }}
                                            onClick={() => handleMoveClick(i * 2)}>
                                            <Box>
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