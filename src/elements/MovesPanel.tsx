import { useChessBoard } from "@/contexts/ChessBoardContext";
import { ChessBoardItem } from "@/contexts/ChessBoardState";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";

interface MovesPanelProps {
    chessBoardKey: string;
    isHidden: boolean;
}

export const MoveButton: React.FC<{
    move: ChessBoardItem,
    selectedMoveKey: string | undefined,
    handleSelectMove: (moveKey: string) => void
}> = ({
    move,
    selectedMoveKey,
    handleSelectMove
}) => {
        return (<Button
            size='small'
            onClick={() => handleSelectMove(move.state.key)}
            variant='text'
            sx={{
                width: '100%',
                textTransform: 'none',
            }}
            color={selectedMoveKey === move.state.key ? 'primary' : 'inherit'}
        >
            <Typography variant='body1'>{move.state.pgn}</Typography>
            {move.lineCount > 1 && <Typography variant='caption'>&nbsp;({move.lineIndex + 1}/{move.lineCount})</Typography>}
        </Button>)
    };

export const MovesPanel: React.FC<MovesPanelProps> = ({
    chessBoardKey,
    isHidden,
    ...other
}) => {
    const { getController, setController } = useChessBoard();
    const controller = useMemo(() => getController(chessBoardKey), [getController, chessBoardKey]);

    const handleSelectMove = useCallback((moveKey: string) => {
        if (controller) {
            if (moveKey !== selectedMoveKey) {
                controller.selectByKey(moveKey);
            } else {
                if (controller.isCurrentNodeSibling()) {
                    controller.selectNextSibling();
                } else {
                    controller.selectByKey(moveKey);
                }
            }
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    let moves: [ChessBoardItem, ChessBoardItem | null][] = [];
    let selectedMoveKey: string | undefined = undefined;
    if (controller) {
        selectedMoveKey = controller.currentState().key;
        const currentLine = controller.currentLine();
        // console.log('currentLine', currentLine);
        currentLine.forEach((item, index) => {
            if (index % 2 === 0) {
                moves.push([item, null]);
            } else {
                moves[moves.length - 1][1] = item;
            }
        });
    }
    return (
        <div
            role="tabpanel"
            hidden={isHidden}
            id={`simple-tabpanel-${chessBoardKey}`}
            aria-labelledby={`simple-tab-${chessBoardKey}`}
            {...other}
        >
            {!isHidden && <Box>
                <TableContainer
                    component={Paper}
                    sx={{
                        height: { xs: '260px', sm: 'calc(var(--table-height))' },
                        maxHeight: { xs: '260px', sm: 'calc(var(--table-height))' },
                        overflow: 'auto',
                    }}
                >
                    <Table size='small' stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '20%' }}>Move</TableCell>
                                <TableCell style={{ width: '40%', textAlign: 'center' }}>White</TableCell>
                                <TableCell style={{ width: '40%', textAlign: 'center' }}>Black</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {moves.map((move, index) => {
                                const [whiteMove, blackMove] = move;
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index+1}.</TableCell>
                                        <TableCell style={{ textAlign: 'right' }}>
                                            <MoveButton
                                                move={whiteMove}
                                                selectedMoveKey={selectedMoveKey}
                                                handleSelectMove={handleSelectMove}
                                            />
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'right' }}>
                                            {blackMove && <MoveButton
                                                move={blackMove}
                                                selectedMoveKey={selectedMoveKey}
                                                handleSelectMove={handleSelectMove}
                                            />}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>}
        </div>
    );
}
