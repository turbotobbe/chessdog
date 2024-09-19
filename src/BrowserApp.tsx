import { useState } from 'react';
import { Box, Drawer, Typography } from '@mui/material';
import Analysis from './components/Analysis';
import './App.css';
import SiteMenu, { PageName } from './components/SiteMeny';
import HomePage from './pages/HomePage';

const drawerWidth = 240;

const BrowserApp: React.FC<{}> = ({ }) => {

  const [currentPage, setCurrentPage] = useState<PageName>('Home')

  const handleNavClick = (pageName: PageName) => {
    setCurrentPage(pageName)
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'Home':
        return <HomePage />;
      case 'Analysis':
        return <Analysis />;
      // ... other cases for different pages
      default:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h4">Welcome to ChessDog</Typography>
            <Typography variant="body1">This is the {currentPage} page.</Typography>
          </Box>
        );
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant={'permanent'}
        open={true}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <SiteMenu onNavClick={handleNavClick} currentPage={currentPage} />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default BrowserApp;
