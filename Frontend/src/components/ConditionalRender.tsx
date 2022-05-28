import { Fragment, FunctionalComponent } from "react";

export const ConditionalRender: FunctionalComponent<{
    condition?: boolean;
    alternative?: React.ReactNode;
}> = (props) => {
    const { condition = true } = props;

    if (condition) {
        return <Fragment>{props.children}</Fragment>;
    }

    return <Fragment>{props.alternative}</Fragment>;
};
