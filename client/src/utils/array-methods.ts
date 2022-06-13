export {};

/**
 * @Custom array methods
 *
 * To use,
 * Import this file and then use the methods as you would normally.
 * The import should just be empty brackets,
 * import {} from "[path_to_dir]/array-methods";
 *
 * [array].[method](...)
 *
 */

// testing
Array.prototype.bruh = function () {
    console.log("asd");
};

Array.prototype.splitFilter = function <T>(
    callback: (value: T, index: number, array: T[]) => boolean
): [passed: T[], failed: T[]] {
    // see global.d.ts for the definition of this function

    return this.reduce(
        (
            accumulator: [T[], T[]],
            value: T,
            index: number,
            array: T[]
        ): [T[], T[]] => {
            const result = callback(value, index, array);
            const oldP = accumulator[0];
            const oldNP = accumulator[1];

            return result
                ? [[...oldP, value], oldNP]
                : [oldP, [...oldNP, value]];
        },
        [[], []]
    );
};

Array.prototype.isSubarray = function <V>(arr: V[]): boolean {
    // see global.d.ts for the definition of this function

    return this.every((value) => arr.includes(value));
};

Array.prototype.isUniversalArray = function (...arrays: any[][]): boolean {
    // see global.d.ts for the definition of this function

    return arrays.every((arr) => arr.every((value) => this.includes(value)));
};
