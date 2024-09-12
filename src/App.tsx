import { useState } from 'react'
import './App.css'
import Analysis from './components/Analysis'
import chessdogLogo from '@/assets/chessdog.jpg'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Drawer,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material'

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
  const [currentPage, setCurrentPage] = useState('Analysis')

  const handleNavClick = (pageName: string) => {
    setCurrentPage(pageName)
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'Analysis':
        return <Analysis />;
      // ... other cases for different pages
      default:
        return <Typography>This is the {currentPage} page. Select a different option from the menu to change pages.</Typography>;
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: 200,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 200,
              boxSizing: 'border-box',
              backgroundColor: 'background.paper',
              color: 'text.primary',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <img src={chessdogLogo} alt="ChessDog" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
          <List>
            {['Analysis', 'Drills', 'Progress', 'Settings'].map((text) => (
              <ListItem key={text} disablePadding>
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
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {currentPage}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App