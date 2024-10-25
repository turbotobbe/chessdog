import React, { useState, useEffect } from 'react';
import { DnDCellId, DnDOffset, DnDSize, GridColorName, gridColors } from './DnDTypes';
import { useDnDGridContext } from './DnDContext';


const knightRightMoves = [[2, 1], [-1, 2], [-2, -1], [1, -2]]
const knightLeftMoves = [[-1, -2], [2, -1], [1, 2], [-2, 1]]


const createArrowPoints = (centerToCenterDistance: number, cellSize: DnDSize): [number, number][] => {

    // ratio
    const ratio = cellSize.width * 8 / 100

    const arrowHead: DnDSize = {
        height: ratio * 4.5,
        width: ratio * 6.5,
    }

    // body length is shortened by the length of the arrow head (this might not be true for diagonal arrows?)
    const bodyLength = centerToCenterDistance - arrowHead.height - (arrowHead.height); // 87.5 - 4.5 - 4.5 =

    const arrowBody: DnDSize = {
        height: bodyLength,
        width: ratio * 2.75,
        // width: ratio * 3,
    }

    /*
    points are from the tip to the far left and the back to the far right
    * a: tip    is at [0,0]
    * b: top    head arrow edge is at [arrowHead.height,               arrorHead.width/2]
    * c: top    inner edge is at      [arrowHead.height,               arrow.width/2]
    * d: top    end edge is at        [arrow.height-arrowHead.height,  arrow.width/2]
    * e: bottom end edge is at        [arrow.height-arrowHead.height, -arrow.width/2]
    * f: bottom inner edge is at      [arrowHead.height,               -arrow.width/2]
    * g: bottom head arrow edge is at [arrowHead.height,               -arrorHead.width/2]
     */

    const a = { x: 0, y: 0 };
    const b = { x: arrowHead.height, y: arrowHead.width / 2 };
    const c = { x: arrowHead.height, y: arrowBody.width / 2 };
    const d = { x: arrowBody.height + arrowHead.height, y: arrowBody.width / 2 };
    const e = { x: arrowBody.height + arrowHead.height, y: -arrowBody.width / 2 };
    const f = { x: arrowHead.height, y: -arrowBody.width / 2 };
    const g = { x: arrowHead.height, y: -arrowHead.width / 2 };

    let points: [number, number][] = [
        [a.x, a.y],
        [b.x, b.y],
        [c.x, c.y],
        [d.x, d.y],
        [e.x, e.y],
        [f.x, f.y],
        [g.x, g.y],
    ]
    return points
}

const createKnightPoints = (cellSize: DnDSize): [number, number][] => {

    // ratio
    const ratio = cellSize.width * 8 / 100

    const arrowHead: DnDSize = {
        height: ratio * 4.5,
        width: ratio * 6.5,
    }

    // const centerToCenterDistance = cellSize.width*2
    // // body length is shortened by the length of the arrow head (this might not be true for diagonal arrows?)
    // const bodyLength = centerToCenterDistance - arrowHead.height - (arrowHead.height); // 87.5 - 4.5 - 4.5 =

    const arrowBody: DnDSize = {
        height: 0,
        width: ratio * 2.75,
        // width: ratio * 3,
    }

    /*
    points are from the tip to the far left and the back to the far right
    * a: tip    is at [0,0]
    * b: top    head arrow edge is at [arrowHead.height,               arrorHead.width/2]
    * c: top    inner edge is at      [arrowHead.height,               arrow.width/2]
    * d: top    corner edge is at     [1.5*cell.width+(arrow.width/2), arrow.width/2]
    * e: top    end edge is at        [1.5*cell.width+(arrow.width/2), -(2*cell.height)]
    * f: bottom end edge is at        [1.5*cell.width-(arrow.width/2), -(2*cell.height)]
    * g: bottom corner edge is at     [1.5*cell.width+(arrow.width/2), -arrow.width/2]
    * h: bottom inner edge is at      [arrowHead.height,               -arrow.width/2]
    * i: bottom head arrow edge is at [arrowHead.height,               -arrorHead.width/2]
     */

    const a = { x: 0, y: 0 };
    const b = { x: arrowHead.height, y: arrowHead.width / 2 };
    const c = { x: arrowHead.height, y: arrowBody.width / 2 };
    const d = { x: 1 * cellSize.width + (arrowBody.width / 2), y: arrowBody.width / 2 };
    const e = { x: 1 * cellSize.width + (arrowBody.width / 2), y: -2 * cellSize.height + arrowHead.height };
    const f = { x: 1 * cellSize.width - (arrowBody.width / 2), y: -2 * cellSize.height + arrowHead.height };
    const g = { x: 1 * cellSize.width - (arrowBody.width / 2), y: -arrowBody.width / 2 };
    const h = { x: arrowHead.height, y: -arrowBody.width / 2 };
    const i = { x: arrowHead.height, y: -arrowHead.width / 2 };

    let points: [number, number][] = [
        [a.x, a.y],
        [b.x, b.y],
        [c.x, c.y],
        [d.x, d.y],
        [e.x, e.y],
        [f.x, f.y],
        [g.x, g.y],
        [h.x, h.y],
        [i.x, i.y],
    ]

    // flip
    points = points.map(([x, y]) => [x, -y])
    return points

}

const getSquareCenter = (cellId: DnDCellId, cellSize: DnDSize): DnDOffset => {
    return {
        top: (cellId.row * cellSize.height) + (cellSize.height / 2),
        left: (cellId.col * cellSize.width) + (cellSize.width / 2),
    };
};

// Add this function inside the BoardEl component or in a separate utility file
const calculateArrowPoints = (sourceCellId: DnDCellId, targetCellId: DnDCellId, cellSize: DnDSize): string => {
    // console.log('Calculating arrow points:', sourceCellId, targetCellId, cellSize);

    const sourceCellOffset = getSquareCenter(sourceCellId, cellSize);
    const targetCellOffset = getSquareCenter(targetCellId, cellSize);

    const colDiff = targetCellId.col - sourceCellId.col;
    const rowDiff = targetCellId.row - sourceCellId.row;

    const knightRightIndex = knightRightMoves.findIndex(([col, row]) => col == colDiff && row == rowDiff);
    const knightLeftIndex = knightLeftMoves.findIndex(([col, row]) => col == colDiff && row == rowDiff);

    if (knightRightIndex != -1) {
        let points = createKnightPoints(cellSize)

        // Mirror points diagonally
        points = points.map(([x, y]) => [-y, -x]);

        // Rotate points based on knightRightIndex
        const rotationAngle = knightRightIndex * 90 * (Math.PI / 180); // Convert degrees to radians
        points = points.map(([x, y]) => {
            const rotatedX = x * Math.cos(rotationAngle) - y * Math.sin(rotationAngle);
            const rotatedY = x * Math.sin(rotationAngle) + y * Math.cos(rotationAngle);
            return [rotatedX, rotatedY];
        });

        // offset so the tip is at the target cell
        points = points.map(([x, y]) => [x + targetCellOffset.left, y + targetCellOffset.top])

        return points.map(point => point.join(',')).join(' ');
    } else if (knightLeftIndex != -1) {
        let points = createKnightPoints(cellSize)

        // Rotate points based on knightRightIndex
        const rotationAngle = knightLeftIndex * 90 * (Math.PI / 180); // Convert degrees to radians
        points = points.map(([x, y]) => {
            const rotatedX = x * Math.cos(rotationAngle) - y * Math.sin(rotationAngle);
            const rotatedY = x * Math.sin(rotationAngle) + y * Math.cos(rotationAngle);
            return [rotatedX, rotatedY];
        });

        // offset so the tip is at the target cell
        points = points.map(([x, y]) => [x + targetCellOffset.left, y + targetCellOffset.top])

        return points.map(point => point.join(',')).join(' ');
    } else {

        const angle = Math.atan2(sourceCellOffset.top - targetCellOffset.top, sourceCellOffset.left - targetCellOffset.left);
        const centerToCenterDistance = Math.sqrt((targetCellOffset.left - sourceCellOffset.left) ** 2 + (targetCellOffset.top - sourceCellOffset.top) ** 2);
        let points = createArrowPoints(centerToCenterDistance, cellSize)

        // rotate the arrow points
        points = points.map(([x, y]) => {
            const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
            const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
            return [rotatedX, rotatedY];
        });

        // offset so the tip is at the target cell
        points = points.map(([x, y]) => [x + targetCellOffset.left, y + targetCellOffset.top])

        return points.map(([x, y]) => [x, y].join(',')).join(' ');
    }
};

export type DnDArrowProps = {
    colorName: GridColorName,
    sourceKey: string,
    targetKey: string,
}

const DnDArrow: React.FC<DnDArrowProps> = ({
    colorName,
    sourceKey,
    targetKey,
}) => {
    const {cellSize, toCellId} = useDnDGridContext();
    const [points, setPoints] = useState<string>('');

    useEffect(() => {
        if (!colorName || !sourceKey || !targetKey) {
            setPoints('');
            return;
        }

        const sourceCellId = toCellId(sourceKey);
        const targetCellId = toCellId(targetKey);
        const calculatedPoints = calculateArrowPoints(sourceCellId, targetCellId, cellSize);
        setPoints(calculatedPoints);
    }, [colorName, sourceKey, targetKey, cellSize, toCellId]);

    if (!points) {
        return null;
    }

    return (
        <polygon
            id={`${colorName}-${sourceKey}-${targetKey}`}
            points={points}
            fill={gridColors[colorName]}
        />
    );
};

export default DnDArrow;
