import { AuthParams } from 'api/entities';

interface AuthDialogProps {
    title: string;
    errorText?: string;
    disabled?: boolean;
    submitText?: string;
    onSubmit: (data: AuthParams) => unknown;
}

export default function AuthDialog({
    title,
    errorText,
    onSubmit,
    disabled = false,
    submitText = 'Submit',
}: AuthDialogProps) {
    return (
        <form
            className={
                'w-fit rounded bg-white px-3 py-3 dark:border dark:border-zinc-400 dark:border-t-zinc-200 dark:bg-zinc-700'
            }
            onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                onSubmit({
                    username: data.get('username') as string,
                    password: data.get('password') as string,
                });
                form.reset();
            }}
        >
            <fieldset className="flex flex-col items-center gap-y-5" disabled={disabled}>
                <h2 className="font-bold">{title}</h2>
                <div className="flex flex-col gap-y-2">
                    <div>
                        <input
                            className="rounded bg-zinc-200 px-1 placeholder-neutral-600 disabled:cursor-not-allowed dark:bg-zinc-950 dark:placeholder-neutral-400"
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="rounded bg-zinc-200 px-1 placeholder-neutral-600 disabled:cursor-not-allowed dark:bg-zinc-950 dark:placeholder-neutral-400"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                        />
                    </div>
                </div>
                {errorText && <div className="text-center">{errorText}</div>}
                <button
                    className="cursor-pointer rounded bg-sky-600 px-4 py-1 text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                >
                    {submitText}
                </button>
            </fieldset>
        </form>
    );
}
