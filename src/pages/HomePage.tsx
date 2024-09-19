import React from 'react';
import { Box, Typography, Container, Grid, Paper, Card, CardContent, CardHeader, CardActions, Button } from '@mui/material';
import { pageNames } from '@/components/SiteMeny';

const HomePage: React.FC = () => {
    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    py: 8,
                    mb: 6,
                }}
            >
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" component="h1" gutterBottom>
                        ChessDog
                    </Typography>
                    <Typography variant="h6">
                        Unleash your inner chess dog on the board!
                    </Typography>
                </Container>
            </Box>

            {/* Sections for menu items */}
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {pageNames.map((section) => (
                        <Grid item xs={12} md={6} key={section}>
                            <Card>
                                <CardHeader
                                    title={section}
                                />
                                <CardContent>
                                {getDescriptionForSection(section)}
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained'>Explore {section} →</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const getDescriptionForSection = (section: string): string => {
    switch (section) {
        case 'Analysis':
            return 'Analyze your games and improve your strategy with our powerful chess engine.';
        case 'Basics':
            return 'Learn the fundamentals of chess, from piece movements to basic strategies.';
        case 'Openings':
            return 'Explore a wide range of chess openings and master the early game.';
        case 'Tactics':
            return 'Sharpen your tactical skills with our collection of chess puzzles and exercises.';
        case 'Endgames':
            return 'Study essential endgame techniques to finish your games with confidence.';
        case 'Puzzles':
            return 'Challenge yourself with a variety of chess puzzles to enhance your problem-solving skills.';
        default:
            return '';
    }
};

export default HomePage;
