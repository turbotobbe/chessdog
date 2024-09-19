import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, ButtonBase, Box } from '@mui/material';
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

interface SiteMenuProps {
    currentPageName: PageName;
}

const drawerWidth = 240;

const SiteMenu: React.FC<SiteMenuProps> = ({ currentPageName }) => {

    return (
        <Box className='sitemenu'>
            {!isMobile && (
                <ButtonBase
                    component={Link}
                    to={homePageInfo.path}
                    sx={{
                        width: '100%',
                        p: 2,
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    <img
                        src={chessdogLogo}
                        alt="ChessDog"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: `${drawerWidth - 32}px`
                        }}
                    />
                </ButtonBase>
            )}
            <List dense disablePadding>
                {isMobile && 
                    <ListItem>
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
                    </ListItem>
                }
                {menuPageInfos.map((pageInfo) => (
                    <ListItem key={pageInfo.name}>
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
        </Box>
    );
};

export default SiteMenu;
