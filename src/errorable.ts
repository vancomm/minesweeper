export interface Errorable {
    error(): string;
}

export const newErrorable = (message: string): Errorable => ({
    error: () => message,
});

export const isErrorable = (value: unknown): value is Errorable => 'error' in (value as Errorable);
