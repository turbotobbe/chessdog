import React from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';

import rawOpeningGroups from '../data/openingGroups.json';
import { OpeningCategory } from '@/types/chess';

const openingCategories: OpeningCategory[] = rawOpeningGroups.openingCategories as OpeningCategory[];

const OpeningsPage: React.FC = () => {
    const navigate = useNavigate();

    function handleSelectOpening(openingCategorySlug: string, openingSlug: string) {
        console.log("select opening", openingSlug);
        navigate(`/openings/${openingCategorySlug}/${openingSlug}`);
    }
    return (
        <Box className="dev-page">
            <Box sx={{ flexGrow: 1 }}>
                {openingCategories.map((openingCategory, openingCategoryIndex) => (
                    <Box key={openingCategoryIndex}>
                        <Typography variant="h4" p={4}>{openingCategory.name}</Typography>
                        <Grid container spacing={1}>
                        {openingCategory.openings.map((opening, openingIndex) => (
                            <Grid key={openingIndex} size={4}>
                                <Card>
                                    <CardHeader title={`${openingCategoryIndex+1}.${openingIndex+1} ${opening.name}`} />
                                    <CardContent>
                                        <Typography variant="body1">{opening.range}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSelectOpening(openingCategory.slug, opening.slug)}
                                        >
                                            Learn
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default OpeningsPage;
