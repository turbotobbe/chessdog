import React from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Endgames } from '@/types/chess';
import { useNavigate } from 'react-router-dom';

import rawEndgames from '@/data/endgames.json';

const endgames: Endgames = rawEndgames as Endgames;

const EndGamesPage: React.FC = () => {
    const navigate = useNavigate();

    function handleSelectEndgame(endgameSlug: string) {
        console.log("select endgame", endgameSlug);
        navigate(`/endgames/${endgameSlug}`);
    }

    return (
        <Box className="dev-page">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                    {endgames.endgames.map((endgame, index) => {
                        return (
                            <Grid key={index} size={4}>
                                <Card>
                                    <CardHeader title={endgame.name} />
                                    <CardContent>
                                        <Typography variant="body1">{endgame.description}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained" color="primary"
                                            onClick={() => handleSelectEndgame(endgame.slug)}
                                        >
                                            Learn
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
        </Box>
    )
}

export default EndGamesPage;
