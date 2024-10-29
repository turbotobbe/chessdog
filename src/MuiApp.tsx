import theme from './theme';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { type Navigation, type Session } from '@toolpad/core/AppProvider';
import { Outlet } from 'react-router-dom';

import ImageSearchIcon from '@mui/icons-material/ImageSearch';
// import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TagIcon from '@mui/icons-material/Tag';
import ExtensionIcon from '@mui/icons-material/Extension';
import AbcIcon from '@mui/icons-material/Abc';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CreateIcon from '@mui/icons-material/Create';
import PushPinIcon from '@mui/icons-material/PushPin';
import { useMemo, useState } from 'react';
import logo from './assets/chessdog4-nbg.png';
import { ChessBoardProvider } from './contexts/ChessBoardContext';
import './MuiApp.css';
const NAVIGATION: Navigation = [
    {
        segment: 'analysis',
        title: 'Analysis',
        icon: <ImageSearchIcon />,
    },
    {
        kind: 'header',
        title: 'Learn',
    },
    {
        segment: 'basics',
        title: 'Basics',
        icon: <AbcIcon />,
        pattern: 'basics{/:basicSlug}?',
    },
    {
        segment: 'openings',
        title: 'Openings',
        icon: <MenuBookIcon />,
        pattern: 'openings{/:openingSlug}?',
    },
    {
        segment: 'endgames',
        title: 'Endgames',
        icon: <TagIcon />,
        pattern: 'endgames{/:endgameSlug}?',
    },
    {
        segment: 'tactics',
        title: 'Tactics',
        icon: <PushPinIcon />,
        pattern: 'tactics{/:tacticSlug}?',
    },
    {
        segment: 'puzzles',
        title: 'Puzzles',
        icon: <ExtensionIcon />,
        pattern: 'puzzles{/:puzzleSlug}?',
    },
    // {
    //     kind: 'divider',
    // },
    {
        kind: 'header',
        title: 'Create',
    },
    {
        segment: 'prep',
        title: 'Prep',
        icon: <FormatListNumberedIcon />,
    },
    {
        segment: 'studio',
        title: 'Studio',
        icon: <CreateIcon />,
    },
];

const MuiApp: React.FC = () => {

    const [session, setSession] = useState<Session | null>(null);

    const authentication = useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Magnus Carlsen',
                        email: 'magnuscarlsen@chessdog.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);


    return (
        <ChessBoardProvider>
            <AppProvider
                navigation={NAVIGATION}
                session={session}
                authentication={authentication}
                branding={{
                    logo: <img src={logo} alt="Chess Dog" />,
                    title: 'Chess Dog',
                }}
                theme={theme}
            >
                <DashboardLayout defaultSidebarCollapsed={true}>
                    <Outlet />
                </DashboardLayout>
            </AppProvider>
        </ChessBoardProvider>
    );
};

export default MuiApp;