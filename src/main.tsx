import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { CssBaseline } from '@mui/material'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MuiApp from './MuiApp.tsx'
import AnalysisPage from './pages/AnalysisPage.tsx'
import MessagePage from './pages/MessagePage.tsx'
import HomePage from './pages/HomePage.tsx'

// const darkTheme = createTheme({
//   cssVariables: true,
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#8B4513', // SaddleBrown - a chess-inspired accent color
//     },
//     secondary: {
//       main: '#90A4AE', // Blue Grey 300 - a neutral, versatile color
//     },
//     background: {
//       default: '#121212',
//       paper: '#1E1E1E',
//     },
//     text: {
//       primary: '#E0E0E0',
//       secondary: '#A0A0A0',
//     },
//   },
// });
// Add this wrapper component

const router = createBrowserRouter([
  {
    Component: MuiApp, // root layout route
    children: [
      {
        path: '/',
        Component: HomePage,
      },
      {
        path: '/analysis',
        Component: AnalysisPage,
      },
      {
        path: '/basics',
        Component: () => <MessagePage title='Basics' message='This is where you learn how the knight moves.' />,
      },
      {
        path: '/basics/:basicSlug',
        Component: () => <MessagePage title='Basics' message='This is where you learn how the knight moves.' />,
      },
      {
        path: '/openings',
        Component: () => <MessagePage title='Openings' message='Study what the best players are playing.' />,
      },
      {
        path: '/openings/:openingSlug',
        Component: () => <MessagePage title='Openings' message='Study what the best players are playing.' />,
      },
      {
        path: '/endgames',
        Component: () => <MessagePage title='Endgames' message='Master the endgames to win more games.' />,
      },
      {
        path: '/endgames/:endgameSlug',
        Component: () => <MessagePage title='Endgames' message='Master the endgames to win more games.' />,
      },
      {
        path: '/tactics',
        Component: () => <MessagePage title='Tactics' message='Learn all about Forks, Pins, Skewers and all the rest.' />,
      },
      {
        path: '/tactics/:tacticSlug',
        Component: () => <MessagePage title='Tactics' message='Learn all about Forks, Pins, Skewers and all the rest.' />,
      },
      {
        path: '/puzzles',
        Component: () => <MessagePage title='Puzzles' message='Crunch through puzzles to improve your skills.' />,
      },
      {
        path: '/puzzles/:puzzleSlug',
        Component: () => <MessagePage title='Puzzles' message='Crunch through puzzles to improve your skills.' />,
      },
      {
        path: '/prep',
        Component: () => <MessagePage title='Prep' message="This is your own personal repertoire. Don't show anyone!" />,
      },
      {
        path: '/studio',
        Component: () => <MessagePage title='Studio' message='Create your own openings, endgames, tactics and puzzles.' />,
      },
      {
        path: '/*',
        Component: () => <MessagePage title='Not Found' message='The page you are looking for does not exist.' />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <CurrentPageProvider> */}
    <CssBaseline />
    <RouterProvider router={router} />
    {/* </CurrentPageProvider> */}
  </React.StrictMode>,
)