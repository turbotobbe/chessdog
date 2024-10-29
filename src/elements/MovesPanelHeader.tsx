import { Box, SxProps, Tab, Tabs } from "@mui/material";

type MovesPanelHeaderProps = {
    chessBoardKey: string;
    chessBoardKeys: string[];
    chessBoardIndex: number;
    onSelectChessBoardKey: (key: string) => void;
    sx?: SxProps;
}

export const MovesPanelHeader: React.FC<MovesPanelHeaderProps> = ({
    chessBoardKeys,
    chessBoardIndex,
    onSelectChessBoardKey,
    sx
}) => {

    const handleOnSelectChessBoardKey = (_event: React.SyntheticEvent, index: number) => {
        onSelectChessBoardKey(chessBoardKeys[index]);
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
            </Box>
        </Box>
    );
};
