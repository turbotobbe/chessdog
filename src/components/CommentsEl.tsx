import { asSquareInfo, ChessGameState } from '@/models/chess';
import { squareIds } from '@/types/chess';
import { Box, Typography } from '@mui/material';

type CommentsElProps = {
    chessGameState: ChessGameState;
    asWhite: boolean;
}

const CommentsEl = ({ chessGameState, asWhite }: CommentsElProps) => {
    if (chessGameState.comments.length === 0) {
        return null;
    }

    const boardState = Array(8).fill(0).map(() => Array(8).fill(0));

    // show pieces
    squareIds.forEach(squareId => {
        if (chessGameState.getPieceAt(squareId)) {
            const squareInfo = asSquareInfo(squareId);
            if (asWhite) {
                boardState[7 - squareInfo.rankIndex][squareInfo.fileIndex] = 1;
            } else {
                boardState[squareInfo.rankIndex][7 - squareInfo.fileIndex] = 1;
            }
        }
    });

    // show marks
    chessGameState.marks.forEach(squareId => {
        const squareInfo = asSquareInfo(squareId);
        if (asWhite) {
            boardState[7 - squareInfo.rankIndex][squareInfo.fileIndex] = 1;
        } else {
            boardState[squareInfo.rankIndex][7 - squareInfo.fileIndex] = 1;
        }
    });

    // show last move from square
    const lastMoveSquareId = chessGameState.lastMove.fromSquareId;
    if (lastMoveSquareId) {
        const squareInfo = asSquareInfo(lastMoveSquareId);
        if (asWhite) {
            boardState[7 - squareInfo.rankIndex][squareInfo.fileIndex] = 1;
        } else {
            boardState[squareInfo.rankIndex][7 - squareInfo.fileIndex] = 1;
        }
    }

    const findLargestEmptyRectangle = (preferences: { width: number, height: number }) => {
        const heights = Array(8).fill(0);
        let maxArea = 0;
        let maxRect = { top: 0, left: 0, bottom: 0, right: 0 };

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                heights[j] = boardState[i][j] === 0 ? heights[j] + 1 : 0;
            }

            const stack = [-1];
            for (let j = 0; j <= 8; j++) {
                const h = j === 8 ? 0 : heights[j];
                while (stack.length > 1 && heights[stack[stack.length - 1]] > h) {
                    const height = heights[stack.pop()!];
                    const width = j - stack[stack.length - 1] - 1;
                    if (height >= preferences.height && width >= preferences.width) {
                        const area = height * width;
                        if (area > maxArea) {
                            maxArea = area;
                            maxRect = {
                                top: i - height + 1,
                                left: stack[stack.length - 1] + 1,
                                bottom: i,
                                right: j - 1
                            };
                        }
                    }
                }
                stack.push(j);
            }
        }

        return maxRect;
    };

    const prefs = [
        { width: 4, height: 3 },
        { width: 3, height: 4 },
        { width: 3, height: 3 },
    ]
    let top = 0, left = 0, bottom = 0, right = 0;
    for (const pref of prefs) {
        const candidate = findLargestEmptyRectangle(pref);
        if (candidate.bottom > 0 && candidate.right > 0 )  {
            console.log("found nice rectangle", candidate);
            top = candidate.top;
            left = candidate.left;
            bottom = candidate.bottom;
            right = candidate.right;
            break;
        } else {
            console.log("no rectangle found", pref, candidate);
        }
    }

    let availableWidth = right - left + 1;
    let availableHeight = bottom - top + 1;

    // if (availableWidth > 2 && availableWidth % 2 !== 0) {
    //     left -= .5;
    // }
    // if (availableHeight > 2 && availableHeight % 2 === 0) {
    //     top -= .5;
    // }

    return (
        <Box
            sx={{
                // backgroundColor: 'rgba(255, 255, 255, 0.5)',
                position: 'absolute',
                top: `${top * 12.5}%`,
                left: `${left * 12.5}%`,
                width: `${availableWidth * 12.5}%`,
                height: `${availableHeight * 12.5}%`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'var(--board-brown-light)',
                    border: `2px solid var(--board-brown-dark)`,
                    color: '#121212',
                    borderRadius: '4px',
                    display: 'flex',
                    textAlign: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: `calc(3 * var(--square-size))`,
                    height: `calc(2 * var(--square-size))`,
                    boxSizing: 'border-box',
                    overflow: 'auto',
                }}
            >
                {chessGameState.comments.map((comment, index) => (
                    <Typography key={index} variant="body2" sx={{ margin: '8px' }}>
                        {comment}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
};

export default CommentsEl;