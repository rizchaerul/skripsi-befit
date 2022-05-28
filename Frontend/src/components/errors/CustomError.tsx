import { useRouter } from "next/router";
import { FunctionalComponent } from "react";
import { ApiException } from "../../clients/ApiClient";

const CustomError: FunctionalComponent<{
    error: ApiException;
}> = (props) => {
    const router = useRouter();

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <div className="mb-5 d-flex align-items-center">
                    <h1 className="display-1 fw-bold border-end pe-3 d-inline">
                        {props.error.status}
                    </h1>

                    <h3 className="ps-3 d-inline">{props.error.result}</h3>
                </div>

                {props.error.status === 404 && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => router.push("/")}
                    >
                        GO HOME
                    </button>
                )}

                {props.error.status === 500 && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => location.reload()}
                    >
                        REFRESH PAGE
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomError;
