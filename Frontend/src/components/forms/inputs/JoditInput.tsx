import dynamic from "next/dynamic";
import { Fragment, FunctionalComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SmartFormInputProps } from "../SmartForm";

const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
});

export const JoditInput: FunctionalComponent<
    SmartFormInputProps & {
        base64Image?: boolean;
    }
> = (props) => {
    const { base64Image = true } = props;

    const methods = useFormContext<Record<string, string>>();

    const config = {
        uploader: {
            insertImageAsBase64URI: base64Image,
        },
    };

    return (
        <Fragment>
            <Controller
                control={methods.control}
                name={props.name}
                render={({ field }) => (
                    <JoditEditor config={config} {...field} />
                )}
            />
        </Fragment>
    );
};
