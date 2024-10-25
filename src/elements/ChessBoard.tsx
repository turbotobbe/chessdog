import { useChessBoard } from "@/contexts/ChessBoardContext";
import DnDGrid from "@/dnd/DnDGrid";
import { DnDCellId, GridColorName } from "@/dnd/DnDTypes";
import { asSquareInfo, asSquareId, asPieceInfo } from "@/models/chess";
import { fullColorNames, fullPieceNames, PieceId, PieceName, SquareId } from "@/types/chess";
import { SxProps } from "@mui/material";
import { useCallback, useMemo } from "react";

type ChessBoardProps = {
    chessBoardKey: string;
    asWhite: boolean
    markColorName: GridColorName
    arrowColorName: GridColorName
    cellSize: number
    boardSize: number
    sx: SxProps
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
    chessBoardKey,
    asWhite,
    markColorName,
    arrowColorName,
    cellSize,
    boardSize,
    sx
}) => {

    const { getController, setController } = useChessBoard();

    const controller = useMemo(() => getController(chessBoardKey), [getController, setController, chessBoardKey]);

    const handleOnCanDrag = useCallback((sourceId: string): boolean => {
        if (controller) {
            return controller.canDrag(sourceId as SquareId);
        }
        return false;
    }, [controller]);

    const handleOnCanMove = useCallback((sourceId: string, targetId: string): boolean => {
        if (controller) {
            return controller.canMove(sourceId as SquareId, targetId as SquareId);
        }
        return false;
    }, [controller]);

    const handleOnCanMark = useCallback((sourceId: string): boolean => {
        if (controller) {
            return controller.canMark(sourceId as SquareId);
        }
        return false;
    }, [controller]);

    const handleOnCanArrow = useCallback((sourceId: string, targetId: string): boolean => {
        if (controller) {
            return controller.canArrow(sourceId as SquareId, targetId as SquareId);
        }
        return false;
    }, [controller]);

    const handleOnMove = useCallback((sourceId: string, targetId: string) => {
        if (controller) {
            controller.onMove(sourceId as SquareId, targetId as SquareId);
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    const handleOnMark = useCallback((sourceId: string, color: GridColorName) => {
        if (controller) {
            controller.onMark(sourceId as SquareId, color);
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

    const handleOnArrow = useCallback((sourceId: string, targetId: string, color: GridColorName) => {
        if (controller) {
            controller.onArrow(sourceId as SquareId, targetId as SquareId, color);
            setController(chessBoardKey, controller);
        }
    }, [controller, setController, chessBoardKey]);

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

    const toItemColor = useMemo(() => (pieceId: string): string => {
        const pieceInfo = asPieceInfo(pieceId as PieceId);
        return fullColorNames[pieceInfo.colorName];
    }, []);

    const toItemFace = useMemo(() => (pieceId: string): string => {
        let pieceName: PieceName | undefined = undefined;
        if (controller) {
            const piece = controller.currentState().pieces[pieceId as PieceId];
            if (piece) {
                pieceName = piece.promotionPieceName ?? piece.pieceName;
            }
        }
        if (!pieceName) {
            // fall back on pieceId information
            const pieceInfo = asPieceInfo(pieceId as PieceId);
            pieceName = pieceInfo.pieceName;
        }
        return fullPieceNames[pieceName as PieceName];
    }, [controller]);

    if (!controller) {
        return null;
    }
    const state = controller.currentState();
    const pieces = state.squares;
    const badges = state.badges;
    const marks = state.marks;
    const arrows = state.arrows;
    const targets = { ...state.validWhiteMoves, ...state.validBlackMoves };
    // console.log('chessboard marks', chessboard.key, chessboard.marks);

    // console.log('chess board toCellId', toCellId('a1'));
    return (
        <DnDGrid
            rows={8}
            cols={8}
            cellSize={{ width: cellSize, height: cellSize }}
            gridSize={{ width: boardSize, height: boardSize }}
            items={pieces}
            badges={badges}
            marks={marks}
            arrows={arrows}
            targets={targets}
            markColorName={markColorName}
            arrowColorName={arrowColorName}
            toCellId={toCellId}
            fromCellId={fromCellId}
            toItemColor={toItemColor}
            toItemFace={toItemFace}

            canDrag={handleOnCanDrag}
            canMove={handleOnCanMove}
            canMark={handleOnCanMark}
            canArrow={handleOnCanArrow}

            onMove={handleOnMove}
            onMark={handleOnMark}
            onArrow={handleOnArrow}

            sx={sx}
        >
        </DnDGrid>
    );
};
