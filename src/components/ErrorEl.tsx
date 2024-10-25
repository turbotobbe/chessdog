import { Box, SxProps } from "@mui/material"

type ErrorElProps = {
    error: Error,
    sx?: SxProps
}


const ErrorEl: React.FC<ErrorElProps> = ({
    error,
    sx
}) => {

    return (
        <Box
            className="error"
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...sx
            }}
        >
            {error.message}
        </Box>
    );
}


export default ErrorEl;