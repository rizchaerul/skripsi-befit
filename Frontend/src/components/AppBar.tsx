import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Fragment,
    FunctionalComponent,
    FunctionComponent,
    MouseEventHandler,
} from "react";
import { BsBell, BsChevronLeft } from "react-icons/bs";
import useSWR from "swr";
import { ApiClient } from "../clients/ApiClient";
import { ImageConstants } from "../constants/ImageConstants";
import { createApiClient } from "../functions/create-api-client";
import { nameof } from "../functions/nameof";
import { ConditionalRender } from "./ConditionalRender";

export const SimpleAppBar: FunctionalComponent<{
    title?: string;
    backHref?: string;
    buttonTitle?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    isLoading?: boolean;
}> = (props) => {
    return (
        <Fragment>
            <div className="shadow-sm fixed-top bg-white">
                <div className="container fw-bold">
                    <div
                        className="d-flex align-items-center"
                        style={{ height: 64 }}
                    >
                        <ConditionalRender condition={!!props.backHref}>
                            <Link href={props.backHref ?? ""} passHref>
                                <a className="text-black">
                                    <BsChevronLeft className="me-2" size={24} />
                                </a>
                            </Link>
                        </ConditionalRender>

                        <h5 className="mb-0">{props.title}</h5>

                        <ConditionalRender condition={!!props.buttonTitle}>
                            <div className="text-end ms-auto">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={props.onClick}
                                >
                                    {props.buttonTitle}

                                    {props.isLoading && (
                                        <small className="spinner-border spinner-border-sm ms-3" />
                                    )}
                                </button>
                            </div>
                        </ConditionalRender>
                    </div>
                </div>
            </div>

            <div style={{ height: 64 }} />
        </Fragment>
    );
};

export const MainAppBar: FunctionComponent = () => {
    const appBarHeight = 80;

    const session = useSession();

    const swrAccount = useSWR(
        [
            nameof<ApiClient>("userAccount_GetUserAccountById"),
            session.data?.token.sub,
        ],
        async () =>
            await createApiClient().userAccount_GetUserAccountById(
                session.data?.token.sub ?? ""
            )
    );

    const { data } = useSWR(
        nameof<ApiClient>("notification_GetCount"),
        async () =>
            await createApiClient().notification_GetCount(
                session.data?.token.sub ?? ""
            )
    );

    return (
        <Fragment>
            <div className="fixed-top border-bottom bg-white">
                <div className="container">
                    <div
                        className="d-flex py-3 align-items-center"
                        style={{ height: appBarHeight }}
                    >
                        <div>
                            <img
                                src={
                                    swrAccount.data?.pictureBase64 ??
                                    ImageConstants.defaultPictureSource
                                }
                                className="rounded-circle"
                                alt="avatar"
                                height={48}
                                width={48}
                            />
                        </div>

                        <div className="ms-3">
                            <div className="text-muted">Welcome back,</div>
                            <div className="fw-bold">
                                {swrAccount.data?.fullName ??
                                    session.data?.token.name}
                            </div>
                        </div>

                        {session.data?.token.isAdmin !== true && (
                            <div className="ms-auto">
                                <Link href="/notification">
                                    <a className="btn btn-light position-relative">
                                        <BsBell />

                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {data}
                                        </span>
                                    </a>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ height: appBarHeight }} />
        </Fragment>
    );
};
