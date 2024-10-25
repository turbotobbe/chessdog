import SiteMenuEl from "@/components/SiteMenuEl";
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import { useEffect, useState } from "react";
import { useCurrentPage } from "@/contexts/CurrentPage";

type MobileLayoutProps = {
    children: React.ReactNode
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {

    const [mobileOpen, setMobileOpen] = useState(false);
    const currentPage = useCurrentPage();
    useEffect(() => {
        setMobileOpen(false);
    }, [currentPage]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    return (
        <Box>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Chess Dog
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%' },
                }}
            >
                <SiteMenuEl isMobile={true} />
            </Drawer>
            <Box component="main" sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}>
                <Toolbar>just for height purposes</Toolbar>
                {children}
            </Box>
        </Box>
    )
}
