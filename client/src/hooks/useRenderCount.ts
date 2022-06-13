import { useEffect, useRef } from "react";

export default function useRenderCount() {
    const counter = useRef(1);
    useEffect(() => {
        counter.current++;
    });

    return counter.current;
}
