import { useEffect } from "react";

export function useBg(bodyClassName: string) {
    useEffect(() => {
        const body = document.getElementsByTagName("body")[0];
        if (body) {
            body.classList.add(bodyClassName);
        }

        return () => {
            if (body) {
                body.classList.remove(bodyClassName);
            }
        };
    });
}
