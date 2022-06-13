import { forwardRef } from "react";
import { MappableWord } from "../types/utility";

interface CharacterArrayToSentenceProps {
    charactersArr: MappableWord[];
    defaultAnimationClassName: string;
    wordClassName?: string | undefined;
    letterClassName?: string | undefined;

    rest?: Record<string, any> | {};
}

const CharacterArrayToSentence = forwardRef<
    HTMLHeadingElement,
    CharacterArrayToSentenceProps
>(
    (
        {
            charactersArr,
            defaultAnimationClassName,
            wordClassName = "",
            letterClassName = "",
            ...rest
        },
        ref
    ) => {
        // try animating each letter

        return (
            <h1 {...rest} ref={ref}>
                {charactersArr.map((characters) => (
                    <span key={characters.id} className={wordClassName}>
                        {characters.characters.map((character) => (
                            <span
                                key={character.id}
                                className={[
                                    letterClassName,
                                    character.uniqueAnimationClassName ??
                                        defaultAnimationClassName,
                                ].join(" ")}
                            >
                                {character.character}
                            </span>
                        ))}{" "}
                    </span>
                ))}
            </h1>
        );
    }
);

export default CharacterArrayToSentence;
