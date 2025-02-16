export type Success<TOutput> = {
    success: true;
    data: TOutput;
    error?: never;
};

export type Failure<TError> = {
    success: false;
    data?: never;
    error: TError;
};

export type Result<TOutput, TError> = Success<TOutput> | Failure<TError>;

export const throwIfError = <D, E>({ success, data, error }: Result<D, E>): D => {
    if (!success) {
        throw error;
    }
    return data;
};
