import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import DnDGrid from './DnDGrid';
import { PieceId, pieceIds, SquareId, squareIds } from '@/types/chess';
import { asPieceInfo, asSquareId, asSquareInfo } from '@/models/chess';
import { DnDBadgeName, DnDCellId, gridBadgeNames, GridColorName, gridColorNames } from './DnDTypes';

export const useChessBoard = (
    initialItems: Partial<Record<SquareId, PieceId>>,
    initialBadges: Partial<Record<PieceId, DnDBadgeName>>,
    initialMarks: Record<GridColorName, SquareId[]>,
    initialArrows: Record<GridColorName, [SquareId, SquareId][]>,
) => {
    const [isWhite, setIsWhite] = useState<boolean>(true);
    const [items, setItems] = useState<Partial<Record<SquareId, PieceId>>>(initialItems);
    const [badges, setBadges] = useState<Partial<Record<PieceId, DnDBadgeName>>>(initialBadges);
    const [marks, setMarks] = useState<Record<GridColorName, SquareId[]>>(initialMarks);
    const [arrows, setArrows] = useState<Record<GridColorName, [SquareId, SquareId][]>>(initialArrows);

    const canDrag = (sourceId: string): boolean => {
        if (!sourceId) {
            return false;
        }
        const pieceId = items[sourceId as SquareId];
        if (!pieceId) {
            return false;
        }
        return isWhite && pieceId.startsWith('w') || !isWhite && pieceId.startsWith('b');
    };

    const canDrop = (sourceId: string, targetId: string): boolean => {
        if (!sourceId || !targetId) {
            return false;
        }
        const sourcePieceId = items[sourceId as SquareId];
        const targetPieceId = items[targetId as SquareId];
        if (!targetPieceId) {
            return true;
        }
        if (!sourcePieceId) {
            return false;
        }
        const sourcePieceInfo = asPieceInfo(sourcePieceId);
        const targetPieceInfo = asPieceInfo(targetPieceId);
        return sourcePieceInfo.colorName !== targetPieceInfo.colorName;
    };

    const onDrop = (sourceId: string, targetId: string): boolean => {
        if (!sourceId || !targetId) {
            return false;
        }
        setItems(prev => {
            const newItems = { ...prev };
            const pieceId = newItems[sourceId as SquareId];
            delete newItems[sourceId as SquareId];
            newItems[targetId as SquareId] = pieceId;

            setIsWhite(!isWhite);
            return newItems;
        });
        return true;
    };

    return {
        isWhite,
        items,
        setItems,
        marks,
        setMarks,
        arrows,
        setArrows,
        badges,
        setBadges,
        canDrag,
        canDrop,
        onDrop,
    }
}


const DnDApp: React.FC = () => {

    const asWhite = true;
    const markColorName = "green";
    const arrowColorName = "orange";

    const noBadges: Partial<Record<PieceId, DnDBadgeName>> = {};
    const noMarks: Record<GridColorName, SquareId[]> = {
        red: [],
        blue: [],
        yellow: [],
        green: [],
        orange: [],
    };
    const noArrows: Record<GridColorName, [SquareId, SquareId][]> = {
        red: [],
        blue: [],
        yellow: [],
        green: [],
        orange: [],
    };

    // default stuff
    const defaultPieces: Partial<Record<SquareId, PieceId>> = {
        "a1": "wr1",
        "b1": "wn1",
        "c1": "wb1",
        "d1": "wq1",
        "e1": "wk1",
        "f1": "wb2",
        "g1": "wn2",
        "h1": "wr2",
        "a2": "wp1",
        "b2": "wp2",
        "c2": "wp3",
        "d2": "wp4",
        "e2": "wp5",
        "f2": "wp6",
        "g2": "wp7",
        "h2": "wp8",
        "a7": "bp1",
        "b7": "bp2",
        "c7": "bp3",
        "d7": "bp4",
        "e7": "bp5",
        "f7": "bp6",
        "g7": "bp7",
        "h7": "bp8",
        "a8": "br1",
        "b8": "bn1",
        "c8": "bb1",
        "d8": "bq1",
        "e8": "bk1",
        "f8": "bb2",
        "g8": "bn2",
        "h8": "br2",
    }

    // random stuff
    const randomSquareIds = [...squareIds].sort(() => Math.random() - 0.5);

    // random pieces
    const randomPieces: Partial<Record<SquareId, PieceId>> = {};
    pieceIds.forEach((pieceId, index) => {
        const squareId = randomSquareIds[index];
        randomPieces[squareId] = pieceId;
    });

    // random badges    
    const randomBadges: Partial<Record<PieceId, DnDBadgeName>> = {};
    pieceIds.forEach((pieceId, index) => {
        const badgeName = gridBadgeNames[index % gridBadgeNames.length];
        randomBadges[pieceId] = badgeName;
    });

    // random marks
    const randomMarks = JSON.parse(JSON.stringify(noMarks));
    [...squareIds].sort(() => Math.random() - 0.5).slice(0, 10).forEach((squareId, index) => {
        const markColorName = gridColorNames[index % gridColorNames.length];
        randomMarks[markColorName].push(squareId);
    });

    // random arrows
    const randomArrows = JSON.parse(JSON.stringify(noArrows));
    [...squareIds].sort(() => Math.random() - 0.5).slice(0, 10).forEach((sourceId, sourceIndex) => {
        const targetId = [...squareIds].sort(() => Math.random() - 0.5)[0];
        if (sourceId !== targetId) {
            const arrowColorName = gridColorNames[(sourceIndex) % gridColorNames.length];
            randomArrows[arrowColorName].push([sourceId, targetId]);
        }
    });

    const chessboards = [
        useChessBoard(defaultPieces, noBadges, noMarks, noArrows),
        useChessBoard(randomPieces, randomBadges, randomMarks, randomArrows),
    ];

    const toCellId = useMemo(() => (sourceId: string): DnDCellId => {
        const sourceInfo = asSquareInfo(sourceId as SquareId);
        if (asWhite) {
            return { row: 7 - sourceInfo.rankIndex, col: sourceInfo.fileIndex };
        } else {
            return { row: sourceInfo.rankIndex, col: 7 - sourceInfo.fileIndex };
        }
    }, [asWhite]);

    const fromCellId = useMemo(() => (cellId: DnDCellId): string => {
        if (asWhite) {
            return asSquareId(cellId.col, 7 - cellId.row);
        } else {
            return asSquareId(7 - cellId.col, cellId.row);
        }
    }, [asWhite]);

    const handleOnMark = (
        chessBoard: ReturnType<typeof useChessBoard>,
        colorName: GridColorName,
        sourceId: SquareId) => {

        console.log('handleOnMark', colorName, sourceId);
        let found = false;

        // remove any previous mark on this square
        for (const gridColorName of gridColorNames) {
            const markIds = chessBoard.marks[gridColorName];
            const index = markIds.findIndex(mark => mark === sourceId);
            if (index !== -1) {
                chessBoard.setMarks(prev => {
                    const newMarks = { ...prev };
                    newMarks[gridColorName] = [
                        ...markIds.slice(0, index),
                        ...markIds.slice(index + 1)
                    ];
                    return newMarks;
                })
                found = true;
            }
        }

        if (!found) {

            // add new mark
            chessBoard.setMarks(prev => ({
                ...prev,
                [colorName]: [...prev[colorName], sourceId]
            }));
        }
    };

    const handleOnArrow = (
        chessBoard: ReturnType<typeof useChessBoard>,
        colorName: GridColorName,
        sourceId: SquareId,
        targetId: SquareId) => {

        let found = false;

        // remove any previous arrow
        for (const gridColorName of gridColorNames) {
            const arrowIds = chessBoard.arrows[gridColorName];
            const index = arrowIds.findIndex(arrow => arrow[0] === sourceId && arrow[1] === targetId);
            if (index !== -1) {
                chessBoard.setArrows(prev => {
                    const newArrows = { ...prev };
                    newArrows[gridColorName] = [
                        ...arrowIds.slice(0, index),
                        ...arrowIds.slice(index + 1)
                    ];
                    return newArrows;
                })
                found = true;
            }
        }

        if (!found) {

            // add new arrow
            chessBoard.setArrows(prev => ({
                ...prev,
                [colorName]: [...prev[colorName], [sourceId, targetId]]
            }));
        }
    }

    return (
        <Box sx={{ margin: '1rem' }}>
            <Typography variant="h6">Drag and drop the pieces to see how they behave.</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                gap: 2
            }}>
                {/* initialItems: Record<SquareId, PieceId | undefined>, */}

                {chessboards.map((chessBoard, index) => (

                    <DnDGrid key={index}
                        rows={8}
                        cols={8}
                        items={chessBoard.items}
                        badges={chessBoard.badges}
                        marks={chessBoard.marks}
                        arrows={chessBoard.arrows}
                        markColorName={markColorName}
                        arrowColorName={arrowColorName}
                        toCellId={toCellId}
                        fromCellId={fromCellId}
                        canDrag={chessBoard.canDrag}
                        canDrop={chessBoard.canDrop}
                        onDrop={chessBoard.onDrop}
                        onMark={(color, sourceId) => handleOnMark(chessBoard, color, sourceId as SquareId)}
                        onArrow={(color, sourceId, targetId) => handleOnArrow(chessBoard, color, sourceId as SquareId, targetId as SquareId)}
                        sx={{
                            width: '80vh',
                            height: '80vh',
                        }}
                    >
                    </DnDGrid>
                ))}
            </Box>
        </Box>
    )
}

export default DnDApp;
