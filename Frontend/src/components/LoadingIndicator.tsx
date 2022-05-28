import { Fragment, FunctionComponent } from "react";

export const LoadingIndicator: FunctionComponent<{
    loading?: boolean;
    size?: "small" | "normal";
    className?: string;
}> = (props) => {
    const { loading = true } = props;
    const { size = "small" } = props;

    if (loading) {
        return (
            <Fragment>
                <small
                    className={`${props.className} spinner-border ${
                        size === "small" ? " spinner-border-sm" : ""
                    }`}
                />
            </Fragment>
        );
    }

    return null;
};
