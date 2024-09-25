import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Drawer, Toolbar, useTheme } from '@mui/material';
import chessdogLogo from '@/assets/chessdog.jpg';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

export type PageName = 'Home' | 'Analysis' | 'Basics' | 'Openings' | 'Tactics' | 'Endgames' | 'Puzzles' | '404'

export interface PageInfo {
    name: PageName;
    path: string;
}
export const homePageInfo: PageInfo = {
    name: 'Home',
    path: '/'
}
export const analysisPageInfo: PageInfo = {
    name: 'Analysis',
    path: '/analysis'
}
export const basicsPageInfo: PageInfo = {
    name: 'Basics',
    path: '/basics'
}
export const openingsPageInfo: PageInfo = {
    name: 'Openings',
    path: '/openings'
}
export const tacticsPageInfo: PageInfo = {
    name: 'Tactics',
    path: '/tactics'
}
export const endgamesPageInfo: PageInfo = {
    name: 'Endgames',
    path: '/endgames'
}
export const puzzlesPageInfo: PageInfo = {
    name: 'Puzzles',
    path: '/puzzles'
}
export const noPageInfo: PageInfo = {
    name: '404',
    path: '/404'
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
    currentPageName: PageName;
}
const drawerWidth = 140;

const SiteMenuEl: React.FC<SiteMenuElProps> = ({ currentPageName }) => {
    const theme = useTheme();
    const appBarHeight = theme.mixins.toolbar.minHeight;
    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={true}
            sx={{
                width: isMobile ? '100%' : drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: isMobile ? '100%' : drawerWidth,
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
                            selected={currentPageName === homePageInfo.name}
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
                            selected={currentPageName === pageInfo.name}
                            component={Link}
                            to={pageInfo.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
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
