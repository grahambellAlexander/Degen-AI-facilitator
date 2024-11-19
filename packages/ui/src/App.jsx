import { useSelector } from 'react-redux'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { CssBaseline, Container, Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

// routing
import Routes from '@/routes'

// defaultTheme
import themes from '@/themes'

// project imports
import NavigationScroll from '@/layout/NavigationScroll'

// ==============================|| MOBILE CHECK COMPONENT ||============================== //

const MobileCheck = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            // Check if device is mobile using user agent
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

            // Check screen width
            const isNarrowScreen = window.innerWidth <= 768;
            
            setIsMobile(isMobileDevice && isNarrowScreen);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    return isMobile ? (
        <Container maxWidth="sm">
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    padding: '20px'
                }}
            >
                <Typography variant="h4" component="h1">
                    Desktop Only
                </Typography>
                <Typography variant="body1">
                    Please use a desktop computer or tablet to access this content.
                </Typography>
            </Box>
        </Container>
    ) : null;
};

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <MobileCheck />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
