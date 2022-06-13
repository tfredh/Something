// general utility functions ---------------------------------------------------
export type ExclusiveUnion<T extends object, U extends object> = Record<
    Exclude<keyof (T & U), Extract<keyof T, keyof U>>,
    unknown
>;

export type NonEmptyObject<T extends object> = keyof T extends never
    ? never
    : T;

export type NonOverlappingKeys<T extends object, M extends object> = Extract<
    keyof T,
    keyof M
> extends never // empty extract returns never
    ? Record<keyof (T & M), unknown>
    : never;

export type ArrayType<T> = T extends (infer R)[] ? R : T;
export type HeadArgument<T extends CallableFunction> = T extends (
    a1: infer A1,
    ...rest: unknown[]
) => any
    ? A1
    : never;

// general utility primitive types ---------------------------------------------

export type Character = string;
export type UnariableString = string; // meaning it can be converted to a valid number
export type ClassName = string;

// character animations ---------------------------------------------------
export interface MappableCharacter {
    id: string;
    character: string;
    uniqueAnimationClassName?: string;
}

export interface MappableWord {
    id: string;
    characters: MappableCharacter[];
}

// transitions ------------------------------------------------------------------
export type TransitionStartingDirection =
    | "no-transition"
    | "no-movement"
    | "l"
    | "r"
    | "t"
    | "b"
    | "tl"
    | "tr"
    | "bl"
    | "br";
