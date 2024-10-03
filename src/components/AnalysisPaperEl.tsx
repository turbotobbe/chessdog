import { Paper } from "@mui/material";
import AnalysisHeaderEl from "./AnalysisHeaderEl";
import BoardNavigatorEl from "./BoardNavigatorEl";
import BoardMovesEl from "./BoardMovesEl";
import { BoardState } from "@/models/BoardState";

type AnalysisPaperElProps = {
    boardState: BoardState,
    path: number[],
    pathIndex: number,
    setPathIndex: (pathIndex: number) => void,
    setLineIndex: (pathIndex: number, lineIndex: number) => void
    resetBoard: () => void
    sx?: React.CSSProperties
}

const AnalysisPaperEl: React.FC<AnalysisPaperElProps> = ({
    boardState,
    path,
    pathIndex,
    setPathIndex,
    setLineIndex,
    resetBoard,
    sx
}) => {
    // console.log('AnalysisPaperEl', path, pathIndex);
    return (
        <Paper className='analysis-paper'
            elevation={1}
            sx={{
                ...sx,
                display: 'grid',
                p: 'var(--chessboard-paper-padding)',
                m: 'var(--chessboard-paper-margin)',
                gap: 'var(--chessboard-paper-gap)',
                // width: 'fit-content',
                // aspectRatio: '9 / 16',
                height: 'var(--chessboard-paper-height)',
                gridTemplateColumns: 'auto',
                gridTemplateRows: 'auto 1fr auto',
                gridTemplateAreas: `
            "head"
            "body"
            "foot"
        `,
            }}
        >
            <AnalysisHeaderEl sx={{ gridArea: 'head' }} />
            <BoardMovesEl
                sx={{ gridArea: 'body' }}
                boardState={boardState}
                path={path}
                pathIndex={pathIndex}
                setPathIndex={setPathIndex}
                setLineIndex={setLineIndex}
            />
            {/* <AnalysisBodyEl sx={{ gridArea: 'body' }} setMoves={setMoves} /> */}
            <BoardNavigatorEl
                sx={{ gridArea: 'foot' }}
                path={path}
                pathIndex={pathIndex}
                setPathIndex={setPathIndex}
                resetBoard={resetBoard}
            />
            {/* <AnalysisHeader sx={{ gridArea: 'head' }} />
            <AnalysisBody sx={{ gridArea: 'body' }} setMoves={setMoves} />
            <AnalysisFooter sx={{ gridArea: 'foot' }} /> */}
        </Paper>
    )
}

export default AnalysisPaperEl;