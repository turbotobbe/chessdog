import { Box } from '@mui/material';

import HomePage from './pages/HomePage';
import MessagePage from './pages/MessagePage';
import { Route, Routes } from 'react-router-dom';
import { useCurrentPage } from './contexts/CurrentPage';
import BrowserAnalysisPage from './pages/BrowserAnalysisPage';
import SiteMenuEl, { analysisPageInfo, basicsPageInfo, endgamePageInfo, endgamesPageInfo, noPageInfo, openingPageInfo, openingsPageInfo, puzzlesPageInfo, tacticsPageInfo } from './components/SiteMenuEl';
import BrowserOpeningsPage from './pages/BrowserOpeningsPage';
import BrowserEndgamesPage from './pages/BrowserEndgamesPage';

const BrowserApp: React.FC<{}> = ({ }) => {

  const currentPage = useCurrentPage();

  return (

    <Box className='body' sx={{ display: 'flex' }}>
      <SiteMenuEl currentPageName={currentPage.currentPageName} />
      <Box className='main' sx={{
        flexGrow: 1,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={analysisPageInfo.path} element={<BrowserAnalysisPage />} />
          <Route path={basicsPageInfo.path} element={<MessagePage title={basicsPageInfo.name} message='This is the basics page.' />} />
          <Route path={openingsPageInfo.path} element={<BrowserOpeningsPage />} />
          <Route path={openingPageInfo.path} element={<BrowserOpeningsPage />} />
          <Route path={tacticsPageInfo.path} element={<MessagePage title={tacticsPageInfo.name} message='This is the tactics page.' />} />
          <Route path={endgamesPageInfo.path} element={<BrowserEndgamesPage />} />
          <Route path={endgamePageInfo.path} element={<BrowserEndgamesPage/>} />
          <Route path={puzzlesPageInfo.path} element={<MessagePage title={puzzlesPageInfo.name} message='This is the puzzles page.' />} />
          <Route path="*" element={<MessagePage title={noPageInfo.name} message='Page not found.' />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default BrowserApp;
