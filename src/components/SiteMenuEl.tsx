import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Drawer, Toolbar, useTheme } from '@mui/material';
import chessdogLogo from '@/assets/chessdog.jpg';
import { Link } from 'react-router-dom';
import { useCurrentPage } from '@/contexts/CurrentPage';

export type PageName = 'Home' | 'Analysis' | 'Basics' | 'Openings' | 'Opening' | 'Tactics' | 'Endgames' | 'Endgame' | 'Puzzles' | '404' | 'Loading'

export interface PageInfo {
    name: PageName;
    path: string;
    description: string;
}

export const homePageInfo: PageInfo = {
    name: 'Home',
    path: '/',
    description: 'Mans best (chess) friend!'
}
export const analysisPageInfo: PageInfo = {
    name: 'Analysis',
    path: '/analysis',
    description: 'Analyze your games and improve your strategy with our powerful chess engine.'
}
export const basicsPageInfo: PageInfo = {
    name: 'Basics',
    path: '/basics',
    description: 'Learn the fundamentals of chess, from piece movements to basic strategies.'
}
export const openingsPageInfo: PageInfo = {
    name: 'Openings',
    path: '/openings',
    description: 'Explore a wide range of chess openings and master the early game.'
}
export const openingPageInfo: PageInfo = {
    name: 'Opening',
    path: '/openings/:categoryParam/:openingParam',
    description: 'Explore a wide range of chess openings and master the early game.'
}
export const tacticsPageInfo: PageInfo = {
    name: 'Tactics',
    path: '/tactics',
    description: 'Sharpen your tactical skills with our collection of chess puzzles and exercises.'
}
export const endgamesPageInfo: PageInfo = {
    name: 'Endgames',
    path: '/endgames',
    description: 'Study essential endgame techniques to finish your games with confidence.'
}
export const endgamePageInfo: PageInfo = {
    name: 'Endgame',
    path: '/endgames/:endgameParam',
    description: 'Study essential endgame techniques to finish your games with confidence.'
}
export const puzzlesPageInfo: PageInfo = {
    name: 'Puzzles',
    path: '/puzzles',
    description: 'Challenge yourself with a variety of chess puzzles to enhance your problem-solving skills.'
}
export const noPageInfo: PageInfo = {
    name: '404',
    path: '/404',
    description: 'Page not found.'
}
export const loadingPageInfo: PageInfo = {
    name: 'Loading',
    path: '/loading',
    description: 'Loading...'
}

export const pageInfos: PageInfo[] = [
    homePageInfo,
    analysisPageInfo,
    basicsPageInfo,
    openingsPageInfo,
    tacticsPageInfo,
    endgamesPageInfo,
    puzzlesPageInfo,
    noPageInfo
];

export const menuPageInfos: PageInfo[] = [
    analysisPageInfo,
    basicsPageInfo,
    openingsPageInfo,
    tacticsPageInfo,
    endgamesPageInfo,
    puzzlesPageInfo
];

interface SiteMenuElProps {
    isMobile: boolean
    drawerWidth?: number
}

const SiteMenuEl: React.FC<SiteMenuElProps> = ({
    isMobile,
    drawerWidth,
}) => {
    const currentPage = useCurrentPage();
    const theme = useTheme();
    const appBarHeight = theme.mixins.toolbar.minHeight;
    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={true}
            sx={{
                width: drawerWidth ? `${drawerWidth}px` : '100%',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth ? `${drawerWidth}px` : '100%',
                    boxSizing: 'border-box',
                },
            }}
        >
            {!isMobile && (
                <Toolbar disableGutters>
                    <Link to={homePageInfo.path}>
                        <img
                            src={chessdogLogo}
                            alt="ChessDog"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </Link>
                </Toolbar>
            )}

            <List dense disablePadding sx={{
                marginTop: isMobile ? `${appBarHeight}px` : 0
            }}>
                <ListItem disablePadding>
                    {isMobile && (
                        <ListItemButton
                            selected={currentPage.currentPageName === homePageInfo.name}
                            component={Link}
                            to={homePageInfo.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                },
                            }}
                        >
                            <ListItemText primary={homePageInfo.name} />
                        </ListItemButton>

                    )}
                </ListItem>
                {menuPageInfos.map((pageInfo) => (
                    <ListItem key={pageInfo.name} disablePadding>
                        <ListItemButton
                            selected={currentPage.currentPageName === pageInfo.name}
                            component={Link}
                            to={pageInfo.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'secondary.main',
                                    '&:hover': {
                                        backgroundColor: 'secondary.dark',
                                    },
                                },
                            }}
                        >
                            <ListItemText primary={pageInfo.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>

    );
};

export default SiteMenuEl;
