import { useEffect, useRef } from "react";
import useRenderCount from "./useRenderCount";

export default function useDebugInformation(
    componentName: string,
    props: Record<string, any>
): {
    count: number;
    lastRenderTimestamp: React.MutableRefObject<number>;
    changedProps: React.MutableRefObject<{}>;
} {
    const count = useRenderCount();
    const changedProps = useRef<object>({});
    const previousProps = useRef(props);
    const lastRenderTimestamp = useRef(Date.now());

    // gets all props
    const propKeys = Object.keys({ ...props, ...previousProps });
    changedProps.current = propKeys.reduce((obj, key) => {
        if (props[key] === previousProps.current[key]) return obj;
        return {
            ...obj,
            [key]: {
                previous: previousProps.current[key],
                current: props[key],
            },
        };
    }, {});

    useEffect(() => {
        previousProps.current = props;
        lastRenderTimestamp.current = Date.now();

        // this will also execute on the initial render because no props would have changed
        if (Object.keys(changedProps.current).length) {
            console.log(componentName, `change #${count - 1}:`);
            console.table(changedProps.current);
        }
    });

    return { count, lastRenderTimestamp, changedProps };
}
