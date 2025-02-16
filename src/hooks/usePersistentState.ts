import React from 'react';

export default function usePersistentState<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [state, setInternalState] = React.useState(initialValue);

    React.useEffect(() => {
        const value = window.localStorage.getItem(key);
        if (!value) {
            return;
        }
        setInternalState(JSON.parse(value) as T);
    }, [key]);

    const setState = (value: T) => {
        window.localStorage.setItem(key, JSON.stringify(value));
        setInternalState(value);
    };

    return [state, setState];
}
