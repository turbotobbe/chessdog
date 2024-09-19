import { useState } from 'react';
import { AppBar, BottomNavigation, Box, ButtonBase, Drawer, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Analysis from './components/Analysis';
import './App.css';
import SiteMenu, { PageName } from './components/SiteMeny';
import HomePage from './pages/HomePage';

function BrowserApp() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageName>('Home')

  const theme = useTheme();

  const handleNavClick = (pageName: PageName) => {
    setCurrentPage(pageName)
    setMobileOpen(false)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'Home':
        return <HomePage />;
      case 'Analysis':
        return <Analysis />;
      // ... other cases for different pages
      default:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h1">{currentPage}</Typography>
            <Typography variant="body1">This is the {currentPage} page.</Typography>
          </Box>
        );
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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

      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: '100%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '100%',
            boxSizing: 'border-box',
            top: '56px', // Height of AppBar
            height: 'calc(100% - 56px)', // Full height minus AppBar height
          },
        }}
      >
        <Box sx={{ mt: 1 }}>
          <SiteMenu onNavClick={handleNavClick} currentPage={currentPage} />
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        mt: '56px', // Add top margin to account for fixed AppBar
        height: 'calc(100% - 56px - 56px)', // Subtract AppBar and BottomNavigation heights
      }}>
        {renderContent()}
      </Box>

      {/* BottomNavigation */}
      <BottomNavigation
        // ... BottomNavigation props
      >
        {/* ... BottomNavigation items ... */}
      </BottomNavigation>
    </Box>
  );
}

export default BrowserApp;
