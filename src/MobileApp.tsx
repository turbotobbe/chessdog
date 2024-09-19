import { useState } from 'react';
import { AppBar, Box, ButtonBase, Drawer, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Analysis from './components/Analysis';
import './App.css';
import SiteMenu, { PageName } from './components/SiteMeny';

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
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4">Welcome to ChessDog</Typography>
            <Typography variant="body1">Select an option from the menu to get started.</Typography>
          </Box>
        );
      case 'Analysis':
        return <Analysis />;
      // ... other cases for different pages
      default:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4">Welcome to ChessDog</Typography>
            <Typography variant="body1">This is the {currentPage} page.</Typography>
          </Box>
        );
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      {/* AppBar for mobile view */}
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
          <ButtonBase onClick={() => handleNavClick('Home')} sx={{ textAlign: 'left', width: 'auto' }}>
            <Typography variant="h6" noWrap>
              ChessDog
            </Typography>
          </ButtonBase>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={'temporary'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: '100%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '100%',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ mt: 8 }}>
          <SiteMenu onNavClick={handleNavClick} currentPage={currentPage} />
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', mt: 8, overflow: 'auto' }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default BrowserApp;
