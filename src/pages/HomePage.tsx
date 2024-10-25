import React from 'react';
import { Box, Typography } from '@mui/material';
import logo from '../assets/logo.png';
const HomePage: React.FC = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            textAlign: 'center',
            p: 2
        }}><Box
                component="img"
                src={logo}
                alt="Chess Dog"
                sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    width: {
                        xs: '80%',  // 0-600px
                        sm: '60%',  // 600-900px
                        md: '40%',  // 900-1200px
                        lg: '30%',  // 1200px+
                    },
                }}
            />
            {/* <img src={logo} alt="Chess Dog" /> */}
            <Typography variant="body1">Okey, here's the deal.</Typography>
            <Typography variant="body1">
                Just hop around in here and try out whatever you like.
            </Typography>
            <Typography variant="body1">
                We got some free <a href="/openings">openings</a>,  <a href="/endgames">endgames</a>,  <a href="/tactics">tactics</a> and  <a href="/puzzles">puzzles</a> for you.
            </Typography>
            <Typography variant="body1">
                If you like it you can <a href="/join">Join</a> to get access to everything.
            </Typography>
            <Typography variant="body1">
                Well... except my prep!
            </Typography>
        </Box>
    )
}

export default HomePage;
