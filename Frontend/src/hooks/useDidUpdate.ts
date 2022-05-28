import { DependencyList, useEffect, useRef } from "react";

/**
 * Similar to useEffect, but doesn't run in first render.
 *
 * @param effect Imperative function that can return a cleanup function.
 * @param deps If present, effect will only activate if the values in the list change.
 *
 * @see https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-did-update/use-did-update.ts
 */
export function useDidUpdate(effect: () => void, deps?: DependencyList): void {
    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) {
            effect();
        } else {
            mounted.current = true;
        }
    }, deps);
}
