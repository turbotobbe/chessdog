import { Box, Button, SxProps, Tab, Tabs } from "@mui/material";
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useChessBoard } from "@/contexts/ChessBoardContext";
import { useMemo } from "react";

type MovesPanelHeaderProps = {
    chessBoardKey: string;
    chessBoardKeys: string[];
    chessBoardIndex: number;
    onSelectChessBoardKey: (key: string) => void;
    sx?: SxProps;
}

export const MovesPanelHeader: React.FC<MovesPanelHeaderProps> = ({
    chessBoardKey,
    chessBoardKeys,
    chessBoardIndex,
    onSelectChessBoardKey,
    sx
}) => {
    const { getController, setController } = useChessBoard();

    const controller = useMemo(() => getController(chessBoardKey), [getController, chessBoardKey]);

    const handleOnSelectChessBoardKey = (_event: React.SyntheticEvent, index: number) => {
        onSelectChessBoardKey(chessBoardKeys[index]);
    };

    const handleOnReset = () => {
        if (controller) {
            controller.reset();
            setController(chessBoardKey, controller);
        }
    };

    return (
        <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            ...sx
        }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Tabs value={chessBoardIndex} onChange={handleOnSelectChessBoardKey} aria-label="moves panel tabs" sx={{ flex: 1 }}>
                    {chessBoardKeys.map((key) => (
                        <Tab
                            key={key}
                            label={key}
                            id={`simple-tab-${key}`}
                            aria-controls={`simple-tabpanel-${key}`}
                        />
                    ))}
                </Tabs>
                <Button sx={{ marginLeft: 'auto' }}>
                    <PlaylistRemoveIcon onClick={handleOnReset} />
                </Button>
            </Box>
        </Box>
    );
};
