import { PgnTurn } from "@/utils/pgn";
import { Box, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const ScoreSheetEl: React.FC<{ sx?: SxProps, moves: PgnTurn[] }> = ({ sx, moves }) => {
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
                        {moves.map((move, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}.</TableCell>
                                <TableCell
                                    sx={{
                                        color: 'inherit',
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: 'action.hover' },
                                        textAlign: 'right'
                                    }}
                                >
                                    {move.white.pgn}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: 'inherit',
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: 'action.hover' },
                                        textAlign: 'right'
                                    }}
                                >
                                    {move.black?.pgn}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default ScoreSheetEl;