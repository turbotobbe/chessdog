import { Box, Button, Paper } from "@mui/material";
import PaperHeaderEl from "./PaperHeaderEl";
import BoardNavigatorEl from "./BoardNavigatorEl";
import BoardMovesEl from "./BoardMovesEl";
import { BoardState } from "@/models/BoardState";
type AnalysisPaperElProps = {
    title: string,
    subtitle?: string,
    boardState: BoardState,
    practice: boolean,
    path: number[],
    pathIndex: number,
    setPathIndex: (pathIndex: number) => void,
    setLineIndex: (pathIndex: number, lineIndex: number) => void
    actions?: {
        label: string,
        onClick: () => void,
        disabled: boolean,
        selected?: boolean
    }[]
    sx?: React.CSSProperties
}

const AnalysisPaperEl: React.FC<AnalysisPaperElProps> = ({
    title,
    boardState,
    practice,
    path,
    pathIndex,
    setPathIndex,
    setLineIndex,
    actions,
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
                gridTemplateRows: 'auto 1fr auto auto',
                gridTemplateAreas: `
            "head"
            "body"
            "actions"
            "foot"
        `,
            }}
        >
            <PaperHeaderEl sx={{ gridArea: 'head' }} title={title} />
            <Box sx={{ 
                gridArea: 'body',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
             }}>
            <BoardMovesEl
                sx={{ flexGrow: 1, overflow: 'auto' }}
                boardState={boardState}
                path={path}
                pathIndex={pathIndex}
                practice={practice}
                setPathIndex={setPathIndex}
                setLineIndex={setLineIndex}
            />
            </Box>

            {actions && <Box sx={{ gridArea: 'actions', display: 'flex', justifyContent: 'center', gap: 1 }}>
                {actions.map((action, index) => (
                    <Button key={index} onClick={action.onClick} disabled={action.disabled} variant={'contained'}>
                        {action.label}
                    </Button>
                ))}
            </Box>}
            {/* <AnalysisBodyEl sx={{ gridArea: 'body' }} setMoves={setMoves} /> */}
            <BoardNavigatorEl
                sx={{ gridArea: 'foot' }}
                path={path}
                pathIndex={pathIndex}
                setPathIndex={setPathIndex}
                practice={practice}
            />
            {/* <AnalysisHeader sx={{ gridArea: 'head' }} />
            <AnalysisBody sx={{ gridArea: 'body' }} setMoves={setMoves} />
            <AnalysisFooter sx={{ gridArea: 'foot' }} /> */}
        </Paper>
    )
}

export default AnalysisPaperEl;