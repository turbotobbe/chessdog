import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import { loadingPageInfo } from './components/SiteMenuEl';
import HomePage from './pages/HomePage';
import MessagePage from './pages/MessagePage';

// Lazy load pages
// const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
// const OpeningsPage = lazy(() => import('./pages/OpeningsPage'));
// const EndgamesPage = lazy(() => import('./pages/EndgamesPage'));

// Import page info objects
import {
  analysisPageInfo, basicsPageInfo, endgamesPageInfo,
  noPageInfo, openingsPageInfo, puzzlesPageInfo, tacticsPageInfo
} from './components/SiteMenuEl';

import { MobileLayout } from './components/MobileLayout';
import { DesktopLayout } from './components/DesktopLayout';
import AnalysisPage from './pages/AnalysisPage';

const App: React.FC<{}> = ({ }) => {

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const renderRoutes = () => {
    return (
      <Suspense fallback={<MessagePage title={loadingPageInfo.name} message={loadingPageInfo.description} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={analysisPageInfo.path} element={<AnalysisPage />} />
          <Route path={basicsPageInfo.path} element={<MessagePage title={basicsPageInfo.name} message={basicsPageInfo.description} />} />
          <Route path={openingsPageInfo.path} element={<MessagePage title={openingsPageInfo.name} message={openingsPageInfo.description} />} />
          <Route path={tacticsPageInfo.path} element={<MessagePage title={tacticsPageInfo.name} message={tacticsPageInfo.description} />} />
          <Route path={endgamesPageInfo.path} element={<MessagePage title={endgamesPageInfo.name} message={endgamesPageInfo.description} />} />
          <Route path={puzzlesPageInfo.path} element={<MessagePage title={puzzlesPageInfo.name} message={puzzlesPageInfo.description} />} />
          <Route path="*" element={<MessagePage title={noPageInfo.name} message={noPageInfo.description} />} />
        </Routes>
      </Suspense>
    );
  };

  console.log('isSmallDevice', isSmallDevice);
  if (isSmallDevice) {
    return (<MobileLayout>
      {renderRoutes()}
    </MobileLayout>)
  } else {
    return (<DesktopLayout>
      {renderRoutes()}
    </DesktopLayout>)
  }
}

export default App;
