import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ErrorComponent({ error }: { error: Error }) {
    return (
        <div className="flex w-fit items-stretch gap-x-2 rounded border border-amber-600 bg-amber-400/30 p-2">
            <div className="flex gap-x-1">
                <ErrorOutlineIcon fontSize="medium" />
                <h1 className="font-bold">Error</h1>
            </div>
            <div className="border-r border-black/50 dark:border-white/50"></div>
            <p>{String(error.message)}</p>
        </div>
    );
}
