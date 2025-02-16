import { useMediaQuery } from '@mui/material';
import resolveConfig from 'tailwindcss/resolveConfig';

import config from '@/../tailwind.config';

const breakpoints = resolveConfig(config).theme.screens;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
    const bool = useMediaQuery(`(min-width: ${breakpoints[breakpointKey]})`);
    const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
    type Key = `is${Capitalize<K>}`;
    return {
        [`is${capitalizedKey}`]: bool,
    } as Record<Key, boolean>;
}
