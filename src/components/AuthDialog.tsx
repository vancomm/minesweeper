import { AuthParams } from 'api/entities';

interface AuthDialogProps {
    title: string;
    errorText?: string;
    disabled?: boolean;
    submitText?: string;
    onSubmit(data: AuthParams): unknown;
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
                'w-64 bg-white p-2 shadow-[.5rem_.5rem_0_black] dark:border dark:border-white dark:bg-neutral-900'
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
            <fieldset className="flex flex-col items-center gap-2" disabled={disabled}>
                <h2 className="font-bold">{title}</h2>
                <div>
                    <input
                        className="bg-zinc-200 placeholder-neutral-600 disabled:cursor-not-allowed dark:bg-zinc-800 dark:placeholder-neutral-400"
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        required
                    />
                </div>
                <div>
                    <input
                        className="bg-zinc-200 placeholder-neutral-600 disabled:cursor-not-allowed dark:bg-zinc-800 dark:placeholder-neutral-400"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        required
                    />
                </div>
                {errorText && <div className="text-center">{errorText}</div>}
                <button className="underline disabled:cursor-not-allowed disabled:opacity-50" type="submit">
                    {submitText}
                </button>
            </fieldset>
        </form>
    );
}
