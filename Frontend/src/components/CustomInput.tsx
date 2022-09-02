import { useEffect, useRef } from "react";
import { useState } from "react";
import { Fragment, FunctionComponent } from "react";

// delay fetch function for async select
// reference: https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
export function debounce<T extends (...args: any[]) => ReturnType<T>>(
    ms: number,
    callback: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    let timer: NodeJS.Timeout | undefined;

    return (...args: Parameters<T>) => {
        if (timer) {
            clearTimeout(timer);
        }

        return new Promise<ReturnType<T>>((resolve) => {
            timer = setTimeout(() => {
                const returnValue = callback(...args) as ReturnType<T>;
                resolve(returnValue);
            }, ms);
        });
    };
}

export const CustomInput: FunctionComponent<{
    onChange: (value: number) => void;
    defaultValue: string | number | readonly string[] | undefined;
    disabled?: boolean;
}> = (props) => {
    const debounceLoad = useRef(debounce(1000, props.onChange));

    const [value, setValue] = useState("");

    useEffect(() => {
        if (typeof props.defaultValue === "number") {
            setValue(props.defaultValue.toString());
        }
    }, [props.defaultValue]);

    return (
        <Fragment>
            <input
                disabled={props.disabled}
                type="number"
                step={1}
                min={1}
                style={{ maxWidth: 75 }}
                // defaultValue={props.defaultValue}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    debounceLoad.current(e.target.valueAsNumber);
                }}
            />
        </Fragment>
    );
};
