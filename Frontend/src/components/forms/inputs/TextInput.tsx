import { Fragment, FunctionalComponent } from "react";
import { useFormContext } from "react-hook-form";
import { SmartFormInputProps } from "../SmartForm";

interface TextInputProps extends SmartFormInputProps {
    type?: "email" | "password" | "text";
}

export const TextInput: FunctionalComponent<TextInputProps> = (props) => {
    const methods = useFormContext<Record<string, string>>();

    return (
        <Fragment>
            <input
                type={props.type}
                className="form-control"
                {...methods.register(props.name)}
            />
        </Fragment>
    );
};
