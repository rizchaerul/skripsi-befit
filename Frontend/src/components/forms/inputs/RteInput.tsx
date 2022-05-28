import dynamic from "next/dynamic";
import { FunctionalComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SmartFormInputProps } from "../SmartForm";

const RichTextEditor = dynamic(() => import("@mantine/rte"), {
    ssr: false,
});

export const RteInput: FunctionalComponent<SmartFormInputProps> = (props) => {
    const methods = useFormContext();

    return (
        <Controller
            control={methods.control}
            name={props.name}
            rules={props.options}
            render={({ field }) => (
                <RichTextEditor style={{ minHeight: 250 }} {...field} />
            )}
        />
    );
};
