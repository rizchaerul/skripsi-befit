import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import useSWR from "swr";
import { ApiClient, NotificationType } from "../src/clients/ApiClient";
import { SimpleAppBar } from "../src/components/AppBar";
import { ConditionalRender } from "../src/components/ConditionalRender";
import { createAuthorizeLayout } from "../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../src/components/LoadingIndicator";
import { createApiClient } from "../src/functions/create-api-client";
import { getRelativeTime } from "../src/functions/get-relative-time";
import { nameof } from "../src/functions/nameof";
import { NextPageWithLayout } from "./_app";

function getUrl(type: NotificationType, id?: string) {
    if (type === NotificationType.Comment) {
        return `/post/${id}`;
    }

    if (type === NotificationType.Drink) {
        return `/report/drink`;
    }

    if (type === NotificationType.Workout) {
        return `/workout`;
    }

    return "";
}

const NotificationPage: NextPageWithLayout = () => {
    const session = useSession();

    const { data } = useSWR(
        nameof<ApiClient>("notification_Get"),
        async () =>
            await createApiClient().notification_Get(
                session.data?.token.sub ?? ""
            )
    );

    return (
        <Fragment>
            <SimpleAppBar backHref="/home" title="Notification" />

            {data === undefined && (
                <div className="text-center mt-5">
                    <LoadingIndicator />
                </div>
            )}

            <ConditionalRender condition={!!data}>
                {data?.filter((d) => d.isRead === false).length !== 0 && (
                    <div className="container my-3">
                        <h5>Unread</h5>
                    </div>
                )}

                {data
                    ?.filter((d) => d.isRead === false)
                    .map((d) => (
                        <Link
                            key={d.id}
                            href={getUrl(d.typeEnum, d.url)}
                            passHref
                        >
                            <div className="bg-secondary py-1">
                                <div className="container">
                                    <div className="d-flex">
                                        <div className="div">
                                            <small className="fw-bold d-block">
                                                {d.title}
                                            </small>
                                            <small>{d.message}</small>
                                        </div>

                                        <small className="ms-auto">
                                            {getRelativeTime(
                                                new Date(d.timeStamp)
                                            )}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                {data?.filter((d) => d.isRead).length !== 0 && (
                    <div className="container my-3">
                        <h5>Read</h5>
                    </div>
                )}

                {data?.filter((d) => d.isRead) &&
                    data
                        ?.filter((d) => d.isRead)
                        .map((d, index) => {
                            let className = "py-1 border-bottom";

                            if (index === 0) {
                                className += " border-top";
                            }

                            return (
                                <Link
                                    key={d.id}
                                    href={getUrl(d.typeEnum, d.url)}
                                    passHref
                                >
                                    <div className={className}>
                                        <div className="container">
                                            <div className="d-flex">
                                                <div>
                                                    <small className="fw-bold d-block">
                                                        {d.title}
                                                    </small>
                                                    <small>{d.message}</small>
                                                </div>

                                                <small className="ms-auto">
                                                    {getRelativeTime(
                                                        new Date(d.timeStamp)
                                                    )}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
            </ConditionalRender>
        </Fragment>
    );
};

NotificationPage.getLayout = createAuthorizeLayout({
    withContainer: false,
});
export default NotificationPage;
