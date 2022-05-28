import React, { FunctionalComponent, HTMLInputTypeAttribute } from "react";
import { ConditionalRender } from "../../ConditionalRender";
import SmartForm from "../../forms/SmartForm";

export const AuthInput: FunctionalComponent<{
    name: string;
    placeholder?: string;
    type: HTMLInputTypeAttribute;
    smart?: boolean;
    defaultValue?: string;
    required?: boolean;
    icon?: React.ReactNode;
}> = (props) => {
    const { smart = true } = props;
    const className = props.type !== "hidden" ? "input-group" : "";

    return (
        <div className="mb-3">
            <div className={className}>
                {props.type === "hidden" || (
                    <span className="input-group-text bg-dark border-0 rounded-4">
                        {props.icon}
                    </span>
                )}

                <ConditionalRender condition={smart}>
                    <SmartForm.Input
                        type={props.type}
                        name={props.name}
                        placeholder={props.placeholder}
                        className="form-control form-control-lg shadow-none rounded-4"
                        style={{ backgroundColor: "#ede8e2" }}
                        autoComplete="off"
                    />
                </ConditionalRender>

                <ConditionalRender condition={!smart}>
                    <input
                        type={props.type}
                        name={props.name}
                        placeholder={props.placeholder}
                        className="form-control form-control-lg shadow-none rounded-4"
                        style={{ backgroundColor: "#ede8e2" }}
                        autoComplete="off"
                        defaultValue={props.defaultValue}
                        required={props.required}
                    />
                </ConditionalRender>
            </div>

            <ConditionalRender condition={smart}>
                <div className="text-danger small">
                    <SmartForm.Error name={props.name} />
                </div>
            </ConditionalRender>
        </div>
    );
};
