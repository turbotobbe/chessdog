import { Box, SxProps, Typography } from "@mui/material";
import CapturesEl from "./CapturesEl";

import wk from '../assets/wk.png';
import bk from '../assets/bk.png';
import { useEffect, useState } from "react";

interface PlayerInfoElProps {
    sx?: SxProps,
    color: string,
    name: string,
    captures: { src: string; alt: string }[],
    value: number,
    clock: string,
}
const PlayerInfoEl: React.FC<PlayerInfoElProps> = ({
    sx,
    color,
    name,
    captures,
    value,
    clock
}) => {
    const [time, setTime] = useState<string>('');


    // initialize the value and time
    useEffect(() => {
        setTime(clock);
    }, []);

    useEffect(() => {
        const formatTime = (timeString: string) => {
            const parts = timeString.split(':');
            if (parts.length === 2) {
                // Format: m:ss or m:ss.m if less than 10 seconds
                const [minutes, seconds] = parts;
                const [wholeSeconds, milliseconds] = seconds.split('.');
                const totalSeconds = parseInt(minutes) * 60 + parseInt(wholeSeconds);

                if (totalSeconds < 10) {
                    return `${minutes}:${wholeSeconds.padStart(2, '0')}.${(milliseconds || '0').slice(0, 1)}`;
                } else {
                    return `${minutes}:${wholeSeconds.padStart(2, '0')}`;
                }
            } else if (parts.length === 3) {
                // Format: 0:00:00 or 0:00:00.0
                const [hours, minutes, seconds] = parts;
                const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);

                if (totalSeconds >= 86400) {
                    const days = Math.floor(totalSeconds / 86400);
                    return `${days} ${days === 1 ? 'day' : 'days'}`;
                } else if (totalSeconds >= 3600) {
                    const hours = Math.floor(totalSeconds / 3600);
                    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
                } else if (totalSeconds >= 10) {
                    const minutes = Math.floor(totalSeconds / 60);
                    const remainingSeconds = Math.floor(totalSeconds % 60);
                    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
                } else {
                    return `${totalSeconds.toFixed(1)}`;
                }
            }
            return timeString;
        };

        if (clock) {
            setTime(formatTime(clock));
        } else {
            setTime('');
        }
    }, [clock]);

    return (
        <Box
            className={`player-info ${color}`}
            sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gridTemplateRows: '1fr 1fr',
                ...sx
            }}>
            <Box sx={{
                gridRow: '1 / 3',
                gridColumn: '1 / 2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'var(--player-info-height)',

            }}>
                <img
                    src={color === 'black' ? bk : wk}
                    alt={color}
                    style={{
                        objectFit: 'contain',
                        height: '100%',
                        width: '100%',
                    }}
                />
            </Box>
            <Typography variant='body1' className={`player-info-label`} sx={{
                gridColumn: '2 / 3',
                gridRow: '2 / 3',
            }}>{name}</Typography>
            <CapturesEl color={color} pieces={captures} value={value} />
            <Typography variant='h4' className={`player-info-time`} sx={{
                gridColumn: '3 / 4',
                gridRow: '1 / 3',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>{time}</Typography>
        </Box>
    )
};

export default PlayerInfoEl;