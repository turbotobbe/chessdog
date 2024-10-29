import { useChessBoard } from "@/contexts/ChessBoardContext";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";

type CommentsPanelProps = {
    chessBoardKey: string;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
    chessBoardKey,
}) => {
    const { getController } = useChessBoard();

    const controller = useMemo(() => getController(chessBoardKey), [getController, chessBoardKey]);

    if (!controller) {
        return null;
    }

    return (
        <Box sx={{ padding: 2 }}>
            {controller.currentState().comments.map((comment, index) => (
                <Typography
                    key={index}
                    variant="body1"
                    sx={{
                        marginBottom: 1,
                        wordWrap: 'break-word',
                        width: '100%',
                    }}
                >
                    {comment}
                </Typography>
            ))}
        </Box>
    );
};
