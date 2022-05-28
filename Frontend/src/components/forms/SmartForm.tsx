import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import {
    BaseSyntheticEvent,
    DetailedHTMLProps,
    Fragment,
    FunctionalComponent,
    PropsWithChildren,
    useEffect,
} from "react";
import {
    FormProvider,
    RegisterOptions,
    UnpackNestedValue,
    useForm,
    useFormContext,
    UseFormProps,
    UseFormReturn,
} from "react-hook-form";

export type SmartFormSubmit<T> = (
    data: UnpackNestedValue<T>,
    methods: UseFormReturn<T>,
    event: BaseSyntheticEvent | undefined
) => void;

export interface SmartFormProps<T> {
    initialValues?: UseFormProps<T>["defaultValues"];
    formValues?: UseFormProps<T>["defaultValues"];
    schema?: Joi.ObjectSchema<T>;
    onSubmit?: SmartFormSubmit<T>;
    onReset?: (methods: UseFormReturn<T>) => void;
    disabled?: boolean;
}

export interface SmartFormInputProps {
    name: string;
    options?: RegisterOptions;
}

interface SmartFormWatcherProps<T> {
    watch?: Array<keyof T>;
    onChange?: (data: T, methods: UseFormReturn<T>) => void;
}

type SmartInputProps<T> = SmartFormInputProps &
    DetailedHTMLProps<React.InputHTMLAttributes<T>, T> & {
        options?: RegisterOptions;
    };

function Form<T>(props: PropsWithChildren<SmartFormProps<T>>): JSX.Element {
    const methods = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: props.initialValues,
        resolver: props.schema ? joiResolver(props.schema) : undefined,
    });

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit((data, event) => {
                    props.onSubmit && props.onSubmit(data, methods, event);
                })}
                onReset={(e) => {
                    e.preventDefault();

                    if (props.onReset) {
                        props.onReset(methods);
                    } else {
                        methods.reset();
                    }
                }}
            >
                <fieldset disabled={props.disabled}>{props.children}</fieldset>
            </form>
        </FormProvider>
    );
}

function FormV2<T>(props: PropsWithChildren<SmartFormProps<T>>): JSX.Element {
    const methods = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: props.initialValues,
        resolver: props.schema ? joiResolver(props.schema) : undefined,
    });

    useEffect(() => {
        if (props.formValues) {
            for (const key in props.formValues) {
                // @ts-expect-error should not be an error.
                methods.setValue(key, [props.formValues[key]]);
            }
        }
    }, [props.formValues]);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit((data, event) => {
                    props.onSubmit && props.onSubmit(data, methods, event);
                })}
                onReset={(e) => {
                    e.preventDefault();

                    if (props.onReset) {
                        props.onReset(methods);
                    } else {
                        methods.reset();
                    }
                }}
            >
                <fieldset disabled={props.disabled}>{props.children}</fieldset>
            </form>
        </FormProvider>
    );
}

export const Error: FunctionalComponent<SmartFormInputProps> = (props) => {
    const { formState } = useFormContext();
    const error = formState.errors[props.name];

    if (error) {
        const message = error.message as string;

        return <Fragment>{message}</Fragment>;
    }

    return null;
};

export function Watcher<T>(props: SmartFormWatcherProps<T>) {
    const methods = useFormContext();
    const data = methods.watch(props.watch as Array<string>);

    useEffect(() => {
        if (props.onChange && props.watch) {
            props.onChange(
                methods.getValues() as T,
                methods as UseFormReturn<T>
            );
        }
    }, [data]);

    return <Fragment />;
}

export const Input: FunctionalComponent<SmartInputProps<HTMLInputElement>> = (
    props
) => {
    const methods = useFormContext();

    return (
        <input {...props} {...methods.register(props.name, props.options)} />
    );
};

export const Select: FunctionalComponent<SmartInputProps<HTMLSelectElement>> = (
    props
) => {
    const methods = useFormContext();

    return (
        <select {...props} {...methods.register(props.name, props.options)}>
            {props.children}
        </select>
    );
};

export const TextArea: FunctionalComponent<
    SmartInputProps<HTMLTextAreaElement>
> = (props) => {
    const methods = useFormContext();

    return (
        <textarea {...props} {...methods.register(props.name, props.options)} />
    );
};

const SmartForm = { Form, FormV2, Error, Watcher, Input, Select, TextArea };
export default SmartForm;
