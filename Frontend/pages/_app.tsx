import { NextPage } from "next";
import { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { Fragment, ReactElement, ReactNode, useEffect } from "react";
import { generatePushSubscription } from "../src/functions/push-subscription";
import { createApiClient } from "../src/functions/create-api-client";
import { WebPushConstants } from "../src/constants/WebPushConstants";
import { signOut } from "../src/functions/auth";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "react-datepicker/dist/react-datepicker.min.css";

import "../src/styles/index.scss";

/**
 * Session object, only used in client.
 */
let clientSession: Session | null = null;

/**
 * Custom AppProps type for layout support.
 */
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

/**
 * Custom page type for layout support.
 * Reference: https://nextjs.org/docs/basic-features/layouts
 */
export type NextPageWithLayout<T = {}> = NextPage<T> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    useEffect(() => {
        (async () => {
            if (!pageProps.session) return;

            try {
                const doesUserExist = await createApiClient().user_Check();

                if (doesUserExist === false) {
                    signOut({ callbackUrl: "/" });
                }

                const sub = await generatePushSubscription();

                if (sub) {
                    const json = JSON.stringify(sub);

                    const parsedSub = JSON.parse(json) as {
                        endpoint: string;
                        keys: {
                            p256dh: string;
                            auth: string;
                        };
                    };

                    await createApiClient().notification_SaveNotificationData(
                        "",
                        parsedSub.endpoint,
                        parsedSub.keys.p256dh,
                        parsedSub.keys.auth
                    );

                    console.log("submitted push notification token!");

                    localStorage.setItem(
                        WebPushConstants.subscriptionKey,
                        JSON.stringify(sub)
                    );
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    return (
        <Fragment>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, user-scalable=no"
                />

                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/icons/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/icons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/icons/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />

                <meta name="theme-color" content="#7d98a6" />

                <title>Befit</title>
            </Head>

            <SessionProvider session={pageProps.session}>
                {getLayout(<Component {...pageProps} />)}
            </SessionProvider>
        </Fragment>
    );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
    let session: Session | null = null;

    const appProps = await App.getInitialProps(appContext);

    if (typeof window === "undefined") {
        session = await getSession(appContext.ctx);
    } else {
        if (!clientSession) {
            clientSession = await getSession(appContext.ctx);
        }

        session = clientSession;
    }

    return {
        ...appProps,
        pageProps: {
            ...appProps.pageProps,
            session,
        },
    };
};
