import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import useSWR from "swr";
import { ApiClient } from "../../src/clients/ApiClient";
import { SimpleAppBar } from "../../src/components/AppBar";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { Post } from "../../src/components/Post";
import { createApiClient } from "../../src/functions/create-api-client";
import { nameof } from "../../src/functions/nameof";
import { NextPageWithLayout } from "../_app";

const PostPage: NextPageWithLayout = () => {
    const {
        query: { id },
        push,
    } = useRouter();

    const idQuery = Array.isArray(id) ? id[0] : id;

    const { data, error } = useSWR(
        [nameof<ApiClient>("post_GetPostById"), id],
        async () => await createApiClient().post_GetPostById(idQuery ?? "")
    );

    useEffect(() => {
        const body = document.getElementsByTagName("body")[0];
        if (body) {
            body.classList.add("bg-secondary");
        }

        return () => {
            if (body) {
                body.classList.remove("bg-secondary");
            }
        };
    }, []);

    if (error) {
        return null;
    }

    return (
        <Fragment>
            <SimpleAppBar title="Post" backHref="/home" />

            {data && (
                <Post post={data} onDelete={() => push("/home")} standalone />
            )}
        </Fragment>
    );
};

PostPage.getLayout = createAuthorizeLayout({
    withContainer: false,
    withBottomNav: false,
});

export default PostPage;
