import { useState } from 'react';
import { AppBar, Box, createTheme, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, ThemeProvider, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import chessdogLogo from '@/assets/chessdog.jpg'
import Analysis from './components/Analysis';
import './App.css'

const drawerWidth = 240;

// Create a custom dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B4513', // SaddleBrown - a chess-inspired color
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#A0A0A0',
    },
  },
});

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Analysis')

  const handleNavClick = (pageName: string) => {
    setCurrentPage(pageName)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'Analysis':
        return <Analysis />;
      // ... other cases for different pages
      default:
        return <Typography>This is the {currentPage} page. Select a different option from the menu to change pages.</Typography>;
    }
  }

  // Sidebar content
  const drawer = (
    <Box sx={{}}>
      {!isMobile &&
        <Box sx={{ p: 2 }}>
          <img src={chessdogLogo} alt="ChessDog" style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>
      }
      <List sx={{ marginTop: isMobile ? '3rem' : '0px' }} disablePadding>
        {['Analysis', 'Basics', 'Openings', 'Tactics', 'Endgames', 'Puzzles'].map((text) => (
          <ListItem key={text}>
            <ListItemButton
              selected={currentPage === text}
              onClick={() => handleNavClick(text)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* AppBar for mobile view */}
        {isMobile && (
          <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                ChessDog
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        {/* Sidebar Drawer */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          sx={{
            width: isMobile ? '100%' : drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: isMobile ? '100%' : drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', mt: isMobile ? 8 : 0, overflow: 'auto' }}
        >
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
