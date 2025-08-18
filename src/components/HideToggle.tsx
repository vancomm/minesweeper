import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { twJoin } from 'tailwind-merge';

export type HideToggleProps = {
    hidden: boolean;
    onClick: () => unknown;
};

export default function HideToggle({ hidden, onClick }: HideToggleProps) {
    return (
        <button
            className={twJoin(
                hidden ? 'block' : 'absolute top-0 left-0 translate-x-1 translate-y-1',
                'opacity-30 transition-opacity hover:opacity-80'
            )}
            onClick={onClick}
            title={hidden ? 'Display live leaderboard' : 'Hide live leaderboard'}
        >
            {hidden ? (
                <>
                    <VisibilityIcon fontSize="small" sx={{ translate: '0 -.25rem' }} />
                </>
            ) : (
                <VisibilityOffIcon fontSize="small" sx={{ translate: '0 -.25rem' }} />
            )}
        </button>
    );
}
