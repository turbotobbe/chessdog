import { Paper } from "@mui/material";
import PaperHeaderEl from "./PaperHeaderEl";
import BoardNavigatorEl from "./BoardNavigatorEl";
import BoardMovesEl from "./BoardMovesEl";
import { BoardState } from "@/models/BoardState";

type AnalysisPaperElProps = {
    title: string,
    subtitle?: string,
    boardState: BoardState,
    path: number[],
    pathIndex: number,
    setPathIndex: (pathIndex: number) => void,
    setLineIndex: (pathIndex: number, lineIndex: number) => void
    restartBoard?: () => void
    resetBoard: () => void
    sx?: React.CSSProperties
}

const AnalysisPaperEl: React.FC<AnalysisPaperElProps> = ({
    title,
    boardState,
    path,
    pathIndex,
    setPathIndex,
    setLineIndex,
    resetBoard,
    restartBoard,
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
                // m: 'var(--chessboard-paper-margin)',
                gap: 'var(--chessboard-paper-gap)',
                // width: 'fit-content',
                // aspectRatio: '9 / 16',
                height: 'var(--chessboard-paper-height)',
                width: 'calc(var(--text-size) * 16)',
                gridTemplateColumns: 'auto',
                gridTemplateRows: 'auto 1fr auto',
                gridTemplateAreas: `
            "head"
            "body"
            "foot"
        `,
            }}
        >
            <PaperHeaderEl sx={{ gridArea: 'head' }} title={title} />            
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
                // resetBoard={resetBoard}
                // restartBoard={restartBoard}
            />
            {/* <AnalysisHeader sx={{ gridArea: 'head' }} />
            <AnalysisBody sx={{ gridArea: 'body' }} setMoves={setMoves} />
            <AnalysisFooter sx={{ gridArea: 'foot' }} /> */}
        </Paper>
    )
}

export default AnalysisPaperEl;