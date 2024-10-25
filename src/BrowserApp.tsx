import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import SiteMenuEl from './components/SiteMenuEl';

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
const BrowserAnalysisPage = lazy(() => import('./pages/BrowserAnalysisPage'));
const BrowserOpeningsPage = lazy(() => import('./pages/BrowserOpeningsPage'));
const BrowserEndgamesPage = lazy(() => import('./pages/BrowserEndgamesPage'));
// const MessagePage = lazy(() => import('./pages/MessagePage'));
import MessagePage from './pages/MessagePage';

// Import page info objects
import {
  analysisPageInfo, basicsPageInfo, endgamePageInfo, endgamesPageInfo,
  noPageInfo, openingPageInfo, openingsPageInfo, puzzlesPageInfo, tacticsPageInfo
} from './components/SiteMenuEl';

const BrowserApp: React.FC<{}> = ({ }) => {

  // const currentPage = useCurrentPage();

  return (

    <Box className='body' sx={{ display: 'flex' }}>
      <SiteMenuEl isMobile={false} />
      <Box className='main' sx={{
        flexGrow: 1,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <Suspense fallback={<MessagePage title={"Loading..."} message='soon we will be pushing pawn again!' />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path={analysisPageInfo.path} element={<BrowserAnalysisPage />} />
            <Route path={basicsPageInfo.path} element={<MessagePage title={basicsPageInfo.name} message='Do you want to know how the knight moves?' />} />
            <Route path={openingsPageInfo.path} element={<BrowserOpeningsPage />} />
            <Route path={openingPageInfo.path} element={<BrowserOpeningsPage />} />
            <Route path={tacticsPageInfo.path} element={<MessagePage title={tacticsPageInfo.name} message='Forks, pins, skewers, discoveries and all the rest.' />} />
            <Route path={endgamesPageInfo.path} element={<BrowserEndgamesPage />} />
            <Route path={endgamePageInfo.path} element={<BrowserEndgamesPage />} />
            <Route path={puzzlesPageInfo.path} element={<MessagePage title={puzzlesPageInfo.name} message='Bring out your A game!' />} />
            <Route path="*" element={<MessagePage title={noPageInfo.name} message='Page not found.' />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
}

export default BrowserApp;
