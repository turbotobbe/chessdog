import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, ButtonBase, Box } from '@mui/material';
import chessdogLogo from '@/assets/chessdog.jpg';
import { isMobile } from 'react-device-detect';

export type PageName = 'Home' | 'Analysis' | 'Basics' | 'Openings' | 'Tactics' | 'Endgames' | 'Puzzles'

interface SiteMenuProps {
    onNavClick: (pageName: PageName) => void;
    currentPage: string;
}

const drawerWidth = 240;

const SiteMenu: React.FC<SiteMenuProps> = ({ onNavClick, currentPage }) => {

    const pageNames: PageName[] = ['Analysis', 'Basics', 'Openings', 'Tactics', 'Endgames', 'Puzzles'];

    return (
        <Box>
            {!isMobile && (
                <ButtonBase
                    onClick={()=>onNavClick('Home')}
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
                {pageNames.map((text) => (
                    <ListItem key={text}>
                        <ListItemButton
                            selected={currentPage === text}
                            onClick={() => onNavClick(text)}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                },
                            }}
                        >
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SiteMenu;
