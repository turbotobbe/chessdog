import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';

import wp from '../assets/wp.png';
import wr from '../assets/wr.png';
import wn from '../assets/wn.png';
import wb from '../assets/wb.png';
import wq from '../assets/wq.png';
import wk from '../assets/wk.png';
import bp from '../assets/bp.png';
import br from '../assets/br.png';
import bn from '../assets/bn.png';
import bb from '../assets/bb.png';
import bq from '../assets/bq.png';
import bk from '../assets/bk.png';

const initWhitePieces = [
    { src: wr, alt: "wr" },
    { src: wn, alt: "wn" },
    { src: wb, alt: "wb" },
    { src: wb, alt: "wb" },
];
const initBlackPieces = [
    { src: bp, alt: "bp" },
    { src: bp, alt: "bp" },
    { src: bp, alt: "bp" },
    { src: bp, alt: "bp" },
    { src: bq, alt: "bq" },
];

const calculatePieceValue = (pieces: { src: string; alt: string }[]) => {
    let value = pieces.filter(piece => [wp, bp].indexOf(piece.src) > 0).length;
    value += pieces.filter(piece => [wn, bn].indexOf(piece.src) > 0).length * 3;
    value += pieces.filter(piece => [wb, bb].indexOf(piece.src) > 0).length * 3;
    value += pieces.filter(piece => [wr, br].indexOf(piece.src) > 0).length * 5;
    value += pieces.filter(piece => [wq, bq].indexOf(piece.src) > 0).length * 9;
    return value;
};

const BrowserAnalysisPage: React.FC = () => {

    const [whitePieces, setWhitePieces] = useState(initWhitePieces);
    const [blackPieces, setBlackPieces] = useState(initBlackPieces);
    const [whiteValue, setWhiteValue] = useState(0);
    const [blackValue, setBlackValue] = useState(0);
    const theme = useTheme();

    useEffect(() => {
        setWhiteValue(calculatePieceValue(whitePieces));
        setBlackValue(calculatePieceValue(blackPieces));
    }, [whitePieces, blackPieces]);

    const BoardContainer: React.FC<{}> = ({ }) => (
        <Box className="chessboard" sx={{
            aspectRatio: '1 / 1',
            width: 'var'
        }}>
            {/* chess board grid */}
            <Box className="grid" sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, var(--square-size))',
                gridTemplateRows: 'repeat(8, var(--square-size))',
            }}>
                {Array.from({ length: 8 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => (
                        <Box key={`${row}-${col}`} sx={{
                            border: '1px solid #ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {/* {row}-{col} */}
                            <img src={wp} alt="wp" style={{ width: '100%', height: '100%' }} />
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    )

    const PieceCollection: React.FC<{ pieces: { src: string; alt: string }[] }> = ({ pieces }) => (
        <Box className='piece-collection' sx={{
            display: 'flex',
            height: '100%',
            position: 'relative',
            width: `${15 + (pieces.length * 8)}px`, // Adjust width based on number of pieces
        }}>
            {pieces.map((piece, index) => (
                <img
                    key={index}
                    src={piece.src}
                    alt={piece.alt}
                    style={{
                        height: '100%',
                        width: 'auto',
                        objectFit: 'contain',
                        position: 'absolute',
                        top: 0,
                        left: `${index * 8}px`
                    }}
                />
            ))}
        </Box>
    );

    const CapturedPieces: React.FC<{ pieces: { src: string; alt: string }[], value: number }> = ({ pieces, value }) => (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
        }}>
            {[[wp, bp], [wn, bn], [wb, bb], [wr, br], [wq, bq]].map(([w, b], index) => {
                const filteredPieces = pieces.filter((piece: { src: string; alt: string }) => piece.src === w || piece.src === b);
                if (filteredPieces.length > 0) {
                    return <PieceCollection key={index} pieces={filteredPieces} />
                }
            })}
            {value > 0 && <Typography variant="body1" ml={1}>+{value}</Typography>}

        </Box>
    )

    const PlayerContainer: React.FC<{ pieces: { src: string; alt: string }[], name: string, value: number }> = ({ pieces, name, value }) => (
        <Box className='player-container' sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 12fr 1fr',
            gridTemplateRows: 'repeat(2, 1fr)',
            width: '100%',
            height: 'var(--player-container-height)',
        }}>
            <Box className='player-image' sx={{ gridRow: '1 / 3', gridColumn: '1 / 2', aspectRatio: '1 / 1', height: 'var(--player-container-height)' }}>
                <img src={name === "White Player" ? wk : bk} alt={name} style={{ width: '100%', height: '100%' }} />
            </Box>
            <Box className='player-name' sx={{ gridRow: '1 / 2', gridColumn: '2 / 3' }}>
                <Typography variant="body1">{name}</Typography>
            </Box>
            <Box className='player-captured-pieces' sx={{ gridRow: '2 / 3', gridColumn: '2 / 3' }}>
                <CapturedPieces pieces={pieces} value={value} />
            </Box>
            <Box className='player-time' sx={{
                gridRow: '1 / 3',
                gridColumn: '3 / 4',
            }}>
                <Typography variant="h4" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>6:34</Typography>
            </Box>
        </Box>
    )

    console.log(theme.typography.body1.lineHeight);
    console.log(theme.typography.body1.fontSize);
    console.log(theme.spacing(16));

    return (
        <Box>

            {/* board and analysis container */}
            <Box
                className='board-and-analysis-container'
                sx={{
                    display: 'flex',
                    padding: 2,
                    width: '100%',
                    height: 'fit-content',
                    '--spacing': `${theme.spacing(1)}`,
                    '--text-height': `calc(${theme.typography.body1.lineHeight} * ${theme.typography.body1.fontSize})`,
                    '--container-spacing': `calc(var(--spacing) * 2)`,
                    '--paper-spacing': `calc(var(--spacing) * 2 * 2)`,
                    '--chessboard-spacing': `calc(var(--spacing) * 2)`,
                    '--player-container-height': `calc(var(--text-height) * 2)`,
                    '--chessboard-height': `calc(100vh - var(--container-spacing) - var(--paper-spacing) - var(--chessboard-spacing) - (var(--player-container-height) * 2))`,
                    '--square-size': `calc(var(--chessboard-height) / 8)`,
                }}>
                {/* chess board container */}
                <Paper
                    className='chessboard-container'
                    elevation={1}
                    sx={{
                        padding: 2,
                        margin: 2,
                        display: 'grid',
                        width: 'fit-content',
                        height: 'fit-content',
                        gridTemplateColumns: 'auto 1fr auto',
                        gridTemplateRows: 'auto 1fr auto',
                        gap: 1,
                        gridTemplateAreas: `
                            "top-left top top-right"
                            "left center right"
                            "bottom-left bottom bottom-right"
                        `
                    }}>

                    {/* 3x3 grid */}
                    <Box className="board-1-1" sx={{ gridArea: 'top-left' }} ></Box>
                    <Box className="board-1-2" sx={{ gridArea: 'top' }} >
                        <PlayerContainer name="Black Player" pieces={blackPieces} value={blackValue - whiteValue} />
                    </Box>
                    <Box className="board-1-3" sx={{ gridArea: 'top-right' }} ></Box>
                    <Box className="board-2-1" sx={{ gridArea: 'left' }} ></Box>
                    <Box className="board-2-2" sx={{ gridArea: 'center' }}>
                        <BoardContainer />
                    </Box>
                    <Box className="board-2-3" sx={{ gridArea: 'right' }} />
                    <Box className="board-3-1" sx={{ gridArea: 'bottom-left' }} ></Box>
                    <Box className="board-3-2" sx={{ gridArea: 'bottom' }}>
                        <PlayerContainer name="White Player" pieces={whitePieces} value={whiteValue - blackValue} />
                    </Box>
                    <Box className="board-3-3" sx={{ gridArea: 'bottom-right' }} ></Box>

                </Paper>

            </Box>

            {/* more stuff Here */}
            <Box>
                {Array.from({ length: 8 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => (
                        <Typography p={2} key={`${row}-${col}`} variant="body1">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam dolorum quibusdam, quisquam nisi eaque sequi deleniti aperiam consectetur soluta, saepe dignissimos mollitia? Neque accusamus rerum, consequuntur perspiciatis sint similique quisquam.</Typography>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default BrowserAnalysisPage;
