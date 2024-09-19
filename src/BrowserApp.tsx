import { Box, Drawer } from '@mui/material';
import './App.css';
import SiteMenu, { analysisPageInfo, basicsPageInfo, endgamesPageInfo, noPageInfo, openingsPageInfo, puzzlesPageInfo, tacticsPageInfo } from './components/SiteMenu';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import MessagePage from './pages/MessagePage';
import { Route, Routes } from 'react-router-dom';
import { useCurrentPage } from './contexts/CurrentPage';

const drawerWidth = 240;

const BrowserApp: React.FC<{}> = ({ }) => {

  const currentPage = useCurrentPage();

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
        <SiteMenu currentPageName={currentPage.currentPageName} />
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
    </Box>
  );
}

export default BrowserApp;
