import { FunctionComponent } from "react";

export const VerticalSpacer: FunctionComponent<{
    space?: number;
}> = (props) => {
    let { space = 3 } = props;

    if (space < 1) {
        space = 1;
    } else if (space > 5) {
        space = 5;
    }

    const className = `py-${space}`;

    return <div className={className} />;
};

export const HorizontalSpacer: FunctionComponent<{
    space?: number;
}> = (props) => {
    let { space = 3 } = props;

    if (space < 1) {
        space = 1;
    } else if (space > 5) {
        space = 5;
    }

    const className = `px-${space}`;

    return <div className={className} />;
};
