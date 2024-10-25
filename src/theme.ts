import { createTheme } from '@mui/material/styles';

// Extend the palette to include 'accent'
declare module '@mui/material/styles' {
    interface Palette {
        accent: Palette['primary'];
    }
    interface PaletteOptions {
        accent?: PaletteOptions['primary'];
    }
    interface PaletteColor {
        lighter?: string;
    }
}

// from icon
// #FFFFE5 - light yellow
// #FFB64E - light brown
// #E06E1B - dark brown

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFB64E' // from logo
            // main: '#E0AB76' // Buff



            // Light squares (maple or ashwood)
            //   main: '#F5DEB3', // Wheat color
            // main: '#F5DEB3'
            // main: '#FF0000'
        },
        secondary: {
            main: '#E06E1B' // from logo
            // main: '#AF6E4D' // Brown sugar 

            // Dark squares (walnut or mahogany)
            //   main: '#5A3E36', // Walnut color
            // main: '#5C5248'
        },
        // chessRed: {
        //     main: 'var(--chess-highlight-red)'
        // },
        // chessYellow: {
        //     main: 'var(--chess-highlight-yellow)'
        // },
        // chessOrange: {
        //     main: 'var(--chess-highlight-orange)'
        // },
        // chessGreen: {
        //     main: 'var(--chess-highlight-green)'
        // },
        // chessBlue: {
        //     main: 'var(--chess-highlight-blue)'
        // },
        // accent: {
        //     // Accent color (gold or brass)
        //     main: '#D4AF37', // Gold

        // },
        // background: {
        //     // Background (soft leather or dark felt)
        //     default: '#2D2B28', // Charcoal color
        // },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export default theme;