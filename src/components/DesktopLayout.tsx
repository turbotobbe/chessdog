import SiteMenuEl from "@/components/SiteMenuEl";
import { Box } from "@mui/material";

export const drawerWidth = 140;

type DesktopLayoutProps = {
    children: React.ReactNode
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
    return (
        <Box>
            <SiteMenuEl
                drawerWidth={drawerWidth}
                isMobile={false}
            />
            <Box component="main" sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                // mt: 8
            }}>
                {children}
            </Box>
        </Box>
    )
}
