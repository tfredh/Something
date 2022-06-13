import { useEffect, useState } from "react";

// const PREFIX = "something-";
export default function useLocalStorage<T>(
    key: string,
    initialValue: T | (() => T)
): [value: T, setValue: React.Dispatch<React.SetStateAction<T>>] {
    // const prefixedKey = PREFIX + key;

    const [value, setValue] = useState<T>((): T => {
        const jsonVal = localStorage.getItem(key);

        // only return if it's not null or undefined
        if (jsonVal != null) return JSON.parse(jsonVal);
        if (typeof initialValue === "function")
            return (initialValue as CallableFunction)();
        return initialValue;
    });

    useEffect(() => {
        // can use prefixedkey here too
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
