import { useEffect, useState } from 'react';
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css';
import SiteMenu, { analysisPageInfo, basicsPageInfo, endgamesPageInfo, noPageInfo, openingsPageInfo, puzzlesPageInfo, tacticsPageInfo } from './components/SiteMenu';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import MessagePage from './pages/MessagePage';
import { Route, Routes } from 'react-router-dom';
import { useCurrentPage } from './contexts/CurrentPage';

function BrowserApp() {

  const currentPage = useCurrentPage();

  const [mobileOpen, setMobileOpen] = useState(false);
  //
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPage]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
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
          <SiteMenu currentPageName={currentPage.currentPageName} />
        </Box>
      </Drawer>

      <Box sx={{
        flexGrow: 1,
        overflow: 'auto',
        mt: '56px', // Add top margin to account for fixed AppBar
        height: 'calc(100% - 56px - 56px)', // Subtract AppBar and BottomNavigation heights
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={analysisPageInfo.path} element={<AnalysisPage />} />
          <Route path={basicsPageInfo.path} element={<MessagePage title={basicsPageInfo.name} message='This is the basics page.' />} />
          <Route path={openingsPageInfo.path} element={<MessagePage title={openingsPageInfo.name} message='This is the openings page.' />} />
          <Route path={tacticsPageInfo.path} element={<MessagePage title={tacticsPageInfo.name} message='This is the tactics page.' />} />
          <Route path={endgamesPageInfo.path} element={<MessagePage title={endgamesPageInfo.name} message='This is the endgames page.' />} />
          <Route path={puzzlesPageInfo.path} element={<MessagePage title={puzzlesPageInfo.name} message='This is the puzzles page.' />} />
          <Route path="*" element={<MessagePage title={noPageInfo.name} message='Page not found.' />} />
        </Routes>
      </Box>

      {/* <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      >
        {[homePageInfo, analysisPageInfo, basicsPageInfo].map(pageInfo => (
          <BottomNavigationAction key={pageInfo.name} label={pageInfo.name} icon={<HomeIcon />} component={Link} to={pageInfo.path} />
        ))}
      </BottomNavigation> */}
    </Box>
  );
}

export default BrowserApp;
