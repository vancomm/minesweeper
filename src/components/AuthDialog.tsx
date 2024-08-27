import { AuthParams } from '../api/auth'

type AuthDialogProps = {
    title: string
    onSubmit: (data: AuthParams) => unknown
    errorText?: string
}

export default function AuthDialog({
    title,
    errorText,
    onSubmit,
}: AuthDialogProps) {
    return (
        <form
            className={
                'flex w-64 flex-col items-center gap-2 bg-white p-2 shadow-[.5rem_.5rem_0_black] dark:border dark:border-white dark:bg-neutral-900'
            }
            onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const data = new FormData(form)
                onSubmit({
                    username: data.get('username') as string,
                    password: data.get('password') as string,
                })
                form.reset()
            }}
        >
            <h2 className="font-bold">{title}</h2>
            <div>
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    required
                />
            </div>
            {errorText && <div className="text-center">{errorText}</div>}
            <button className="underline" type="submit">
                Submit
            </button>
        </form>
    )
}
