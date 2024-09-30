import React from 'react'
import ReactDOM from 'react-dom/client'
import BrowserApp from './BrowserApp'
import './index.css'
import { BrowserView, MobileView } from 'react-device-detect'
import { IsTouchDeviceProvider } from './contexts/IsTouchDevice'
import MobileApp from './MobileApp'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { CurrentPageProvider } from './contexts/CurrentPage'
import { BrowserRouter } from 'react-router-dom'


const darkTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B4513', // SaddleBrown - a chess-inspired accent color
    },
    secondary: {
      main: '#90A4AE', // Blue Grey 300 - a neutral, versatile color
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IsTouchDeviceProvider>
      <BrowserRouter>
        <CurrentPageProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserView>
              <BrowserApp />
            </BrowserView>
            <MobileView>
              <MobileApp />
            </MobileView>
          </ThemeProvider>
        </CurrentPageProvider>
      </BrowserRouter>
    </IsTouchDeviceProvider>
  </React.StrictMode>,
)