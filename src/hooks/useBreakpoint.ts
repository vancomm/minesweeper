import { useMediaQuery } from '@mui/material';

const breakpoints = {
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
    xl: '80rem',
    '2xl': '96rem',
} as const;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
    const bool = useMediaQuery(`(min-width: ${breakpoints[breakpointKey]})`);
    const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
    type Key = `is${Capitalize<K>}`;
    return {
        [`is${capitalizedKey}`]: bool,
    } as Record<Key, boolean>;
}
