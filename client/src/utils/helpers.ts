import { v4 as uuid } from "uuid";
import { FieldError } from "react-hook-form";
import React, { MutableRefObject } from "react";
import {
    MappableCharacter,
    MappableWord,
    TransitionStartingDirection,
} from "../types/utility";

// general utility functions ---------------------------------------------------
export function arrayEquality<A extends any[], Q extends any[]>(
    arrA: A,
    arrB: Q
): boolean {
    /**
     * Check if two arrays have the same values in the same order
     * with same amount of elements.
     */

    if (arrA.length === arrB.length) return false;

    arrA.sort();
    arrB.sort();
    return arrA.every((item, index) => arrB[index] === item);
}

// prettier-ignore
export function clearObjectValues<T extends object, F>(obj: T, fillWith: F): Record<keyof T, F>;
// prettier-ignore
export function clearObjectValues<T extends object>(obj: T): Record<keyof T, "">;
export function clearObjectValues<T extends object>(
    obj: T,
    fillWith: unknown = ""
): Record<string, unknown> {
    /**
     * Clear all values in an object.
     * @param obj Object to clear values in.
     * @param fillWith Value to fill with.
     * @returns Object with cleared values.
     * @example
     * clearObjectValues({ a: 1, b: 2 }) // { a: "", b: "" }
     * clearObjectValues({ a: 1, b: 2 }, "") // { a: "", b: "" }
     * clearObjectValues({ a: 1, b: 2 }, "foo") // { a: "foo", b: "foo" }
     */

    return Object.fromEntries(
        Object.entries(obj).map(([key]) => [key, fillWith])
    );
}

export function getParsedJSONObject(
    stringified: string
): Record<string, any> | null {
    /**
     * Checks if the string is a valid JSON object. If it is, it will return the object.
     * Otherwise, it will return a falsy value.
     *
     * This function will return `null` for any valid json primitive.
     * EG, 'true' -> null
     *     '123' -> null
     *     'null' -> null
     *     '"I'm a string"' -> null
     */

    try {
        const parsed = JSON.parse(stringified);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(null) or JSON.parse(1234) throw errors, hence the type-checking,
        // but JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. However, null is falsy, so this suffices
        return (
            parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed) &&
            // return the parsed object if all checks pass
            parsed
        );
    } catch (e) {}

    // returned outside catch block to make type checker happy
    return null;
}

// react hook forms ------------------------------------------

export function RHFEmptyForm(
    values: Record<string, string>,
    ...setStates: React.Dispatch<React.SetStateAction<any>>[]
): Record<string, ""> {
    /**
     * Use with reset and getValues() from RHF's useForm() hook.
     *
     * reset(RHFEmptyForm(getValues())) clears the form.
     */

    setStates.forEach((setState) => setState(""));

    return clearObjectValues(values);
}

export function RHFRegisterMessageHelpers(
    errorState: FieldError | undefined
) {
    return {
        error: !!errorState?.message,
        helperText: errorState?.message,
    };
}

// website effects ---------------------------------
export function sentenceToMappableCharacters(sentence: string) {
    return sentence.split(" ").map((word): MappableWord => {
        return {
            id: uuid(),
            characters: Array.from(word, (character): MappableCharacter => {
                return { id: uuid(), character };
            }),
        };
    });
}

export function addTransition<N extends HTMLElement | null>(
    intersectionObserver: IntersectionObserver,
    transitionStartingDirection: TransitionStartingDirection
) {
    /**
     * react element ref values can be null so '| null' is required to pass the typechecker
     * otherwise it is useless
     *
     * the intersectionobserver argument is useless since this function is context-specific,
     * however this is to avoid circular imports
     */

    return (node: N) => {
        if (node == null) return;

        if (transitionStartingDirection !== "no-transition") {
            node.classList.add("transition-" + transitionStartingDirection);
        }

        // console.log("adding transition");
        intersectionObserver.observe(node);
    };
}

export function addTransitionAndStoreNode<N extends HTMLElement | null>(
    intersectionObserver: IntersectionObserver,
    refStorage: React.RefObject<N>,
    transitionStartingDirection?: TransitionStartingDirection
) {
    /**
     * Reasoning of intesectionobserver argument can be found by referring to
     * @addTransition function.
     */

    return (node: N) => {
        if (node == null) return;

        // includetransition effect
        addTransition(
            intersectionObserver,
            transitionStartingDirection ?? "no-transition"
        )(node);

        // update ref to node
        // because the node type isn't instantiated here, the typechecker
        // thinks the ref value was meant to be readonly when it isn't
        (refStorage as MutableRefObject<N>).current = node;
    };
}

// random -------------------------------------------------

export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function randomChoice<T>(arr: T[]): T {
    return arr[getRandomInt(arr.length - 1)];
}

function partialCall<T extends any[], U extends any[], R>(
    f: (...args: [...T, ...U]) => R,
    ...headArgs: T
) {
    return (...tailArgs: U) => f(...headArgs, ...tailArgs);
}

// array methods ---------------------------------------------------
/**
 * Doing them as functions instead of adding them to the Array prototype
 * because it makes the importing implicit.
 */
