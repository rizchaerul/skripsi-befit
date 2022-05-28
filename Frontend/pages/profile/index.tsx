import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { BsGear } from "react-icons/bs";
import useSWR from "swr";
import { ApiClient, PostList } from "../../src/clients/ApiClient";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { Post } from "../../src/components/Post";
import { ImageConstants } from "../../src/constants/ImageConstants";
import { createApiClient } from "../../src/functions/create-api-client";
import { nameof } from "../../src/functions/nameof";
import { NextPageWithLayout } from "../_app";

const ProfilePage: NextPageWithLayout = () => {
    const session = useSession();
    const router = useRouter();

    const { id } = router.query;

    const { data: userData } = useSWR(
        [
            nameof<ApiClient>("userAccount_GetUserAccountById"),
            (id as string) ?? session.data?.token.sub,
        ],
        async () =>
            await createApiClient().userAccount_GetUserAccountById(
                (id as string) ?? session.data?.token.sub ?? ""
            )
    );

    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <Fragment>
            <div className="text-black text-end pt-2">
                <Link href="/profile/settings" passHref>
                    <a className="text-black">
                        <BsGear />
                    </a>
                </Link>
            </div>

            <div className="text-center mt-5">
                <img
                    src={
                        userData?.pictureBase64 ??
                        ImageConstants.defaultPictureSource
                    }
                    className="rounded-circle shadow-sm mb-3"
                    alt="avatar"
                    height={100}
                    width={100}
                />

                <h1>{userData?.fullName}</h1>
                <p>{userData?.email}</p>
            </div>

            {session.data?.token.isAdmin === false && (
                <Fragment>
                    <div className="text-center">
                        <button
                            className={`btn ${
                                selectedTab === 0 ? "btn-primary" : "btn-light"
                            }`}
                            onClick={() => {
                                setSelectedTab(0);
                            }}
                        >
                            {userData?.fullName} posts
                        </button>

                        <button
                            className={`btn ms-3 ${
                                selectedTab === 1 ? "btn-primary" : "btn-light"
                            }`}
                            onClick={() => {
                                setSelectedTab(1);
                            }}
                        >
                            Liked
                        </button>
                    </div>

                    {selectedTab === 0 && <OwnPost id={id as string} />}
                    {selectedTab === 1 && <LikedPost id={id as string} />}
                </Fragment>
            )}
        </Fragment>
    );
};

const OwnPost: FunctionComponent<{ id: string }> = (props) => {
    const session = useSession();

    const [pageState, setPageState] = useState({
        page: 1,
        pageSize: 5,
    });

    const [data, setData] = useState<PostList>();

    useEffect(() => {
        fetchData();
    }, [pageState]);

    async function fetchData() {
        const data = await createApiClient().userAccount_GetOwnPosts(
            null,
            null,
            props.id ?? session.data?.token.sub ?? "",
            pageState.page,
            pageState.pageSize
        );

        setData(data);
    }

    function handlePageChange(page: number) {
        if (page < 1) {
            setPageState({ ...pageState, page: 1 });
        } else if (data?.totalPages !== undefined && page > data?.totalPages) {
            setPageState({ ...pageState, page: data?.totalPages });
        } else {
            setPageState({ ...pageState, page: page });
        }
    }

    return (
        <Fragment>
            {data === undefined && (
                <div className="text-center mt-5">
                    <LoadingIndicator />
                </div>
            )}

            {data?.posts.map((p) => (
                <Post
                    key={p.id}
                    post={p}
                    onDelete={() => setPageState({ ...pageState, page: 1 })}
                />
            ))}

            {data && data?.posts.length !== 0 && (
                <ul className="pagination mt-3">
                    <li className="page-item">
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => handlePageChange(pageState.page - 1)}
                        >
                            «
                        </button>
                    </li>

                    {[...Array(data?.totalPages ?? 0)].map((p, i) => (
                        <li
                            key={i + 1}
                            className={`page-item ${
                                i + 1 === pageState.page ? "active" : ""
                            }`}
                        >
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li className="page-item">
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => handlePageChange(pageState.page + 1)}
                        >
                            »
                        </button>
                    </li>
                </ul>
            )}
        </Fragment>
    );
};

const LikedPost: FunctionComponent<{ id: string }> = (props) => {
    const session = useSession();

    const [pageState, setPageState] = useState({
        page: 1,
        pageSize: 5,
    });

    const [data, setData] = useState<PostList>();

    useEffect(() => {
        fetchData();
    }, [pageState]);

    async function fetchData() {
        const data = await createApiClient().userAccount_GetFavoritePosts(
            props.id ?? session.data?.token.sub ?? "",
            pageState.page,
            pageState.pageSize
        );

        setData(data);
    }

    function handlePageChange(page: number) {
        if (page < 1) {
            setPageState({ ...pageState, page: 1 });
        } else if (data?.totalPages !== undefined && page > data?.totalPages) {
            setPageState({ ...pageState, page: data?.totalPages });
        } else {
            setPageState({ ...pageState, page: page });
        }
    }

    return (
        <Fragment>
            {data === undefined && (
                <div className="text-center mt-5">
                    <LoadingIndicator />
                </div>
            )}

            {data?.posts.map((p) => (
                <Post
                    key={p.id}
                    post={p}
                    onDelete={() => setPageState({ ...pageState, page: 1 })}
                />
            ))}

            {data && data?.posts.length !== 0 && (
                <ul className="pagination mt-3">
                    <li className="page-item">
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => handlePageChange(pageState.page - 1)}
                        >
                            «
                        </button>
                    </li>

                    {[...Array(data?.totalPages ?? 0)].map((p, i) => (
                        <li
                            key={i + 1}
                            className={`page-item ${
                                i + 1 === pageState.page ? "active" : ""
                            }`}
                        >
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li className="page-item">
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => handlePageChange(pageState.page + 1)}
                        >
                            »
                        </button>
                    </li>
                </ul>
            )}
        </Fragment>
    );
};

ProfilePage.getLayout = createAuthorizeLayout();

export default ProfilePage;
