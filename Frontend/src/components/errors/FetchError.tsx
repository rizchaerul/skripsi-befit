import Error from "next/error";
import { FunctionalComponent } from "react";
import { ApiException } from "../../clients/ApiClient";

export const FetchError: FunctionalComponent<{
    error: ApiException;
}> = (props) => {
    return <Error statusCode={props.error.status} title={props.error.result} />;
};
