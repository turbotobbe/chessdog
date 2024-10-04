import { Paper } from "@mui/material";
import PaperHeaderEl from "./PaperHeaderEl";

type PgnSourcePaperElProps = {
    loadBoard: (pgnText: string) => void
    sx?: React.CSSProperties
}

const PgnSourcePaperEl: React.FC<PgnSourcePaperElProps> = ({
    loadBoard,
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
            <PaperHeaderEl sx={{ gridArea: 'head' }} title='Load PGN' />
            {/* <BoardMovesEl
                sx={{ gridArea: 'body' }}
                boardState={boardState}
                path={path}
                pathIndex={pathIndex}
                setPathIndex={setPathIndex}
                setLineIndex={setLineIndex}
            /> */}
            {/* <AnalysisBodyEl sx={{ gridArea: 'body' }} setMoves={setMoves} /> */}
            {/* <BoardNavigatorEl
                sx={{ gridArea: 'foot' }}
                path={path}
                pathIndex={pathIndex}
                setPathIndex={setPathIndex}
                resetBoard={resetBoard} />*/}
            
            {/* <AnalysisHeader sx={{ gridArea: 'head' }} />
            <AnalysisBody sx={{ gridArea: 'body' }} setMoves={setMoves} />
            <AnalysisFooter sx={{ gridArea: 'foot' }} /> */}
        </Paper>
    )
}

export default PgnSourcePaperEl;
