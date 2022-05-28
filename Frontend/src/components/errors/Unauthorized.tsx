import Error from "next/error";
import { FunctionalComponent } from "react";

export const Unauthorized: FunctionalComponent = () => {
    return <Error statusCode={401} title="Unauthorized" />;
};
