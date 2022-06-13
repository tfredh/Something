interface Array<T> {
    /**
     * Given a filter prompt, return a new array with the left side
     * being an array of the values of the filter, and the right side
     * being an array of the values that did not pass the filter
     */
    splitFilter: (
        callback: (value: T, index: number, array: T[]) => boolean
    ) => [passed: T[], failed: T[]];

    /**
     * Check if every element in the array is found in the array
     * passed as the argument
     *
     * @param arr The array to check against
     */
    isSubarray: <V>(arr: V[]) => boolean;

    /**
     * Check if every element in each passed array is found in the
     * array that called this method
     *
     * @param arrays The arrays being checked if they are child
     * arrays of the array that called this method
     */
    isUniversalArray: (...arrays: any[][]) => boolean;

    // testing
    bruh: () => void;
}

/**
 * @askljdalkjdaljdkdjaskljdaklsjdajk
 * ----------------------------------------------------------------------------
 */
// interface ClientWebSocket extends WebSocket {
//     deliver?: (action: string, payload: any) => void;
// }
interface WebSocket {
    deliver?: (action: string, payload: any) => void;
}

interface ObjectConstructor {
    /**
     * Making the return type of the .keys method the keys of the object
     * instead of string.
     *
     * @param obj The object to get the keys of
     * @returns The keys of the object
     */
    keys<T extends object>(obj: T): (keyof T)[];
}
