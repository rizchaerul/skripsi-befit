import { Fragment, useEffect, useState } from "react";
import { PostCategory, PostList, PostSortType } from "../src/clients/ApiClient";
import { MainAppBar } from "../src/components/AppBar";
import { createAuthorizeLayout } from "../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../src/components/LoadingIndicator";
import { Post } from "../src/components/Post";
import { createApiClient } from "../src/functions/create-api-client";
import { NextPageWithLayout } from "./_app";

const HomePage: NextPageWithLayout = () => {
    const [pageState, setPageState] = useState({
        page: 1,
        pageSize: 5,
        category: 0,
        sortType: PostSortType.New,
    });

    const [data, setData] = useState<PostList>();

    useEffect(() => {
        fetchData();
    }, [pageState]);

    async function fetchData() {
        const data = await createApiClient().post_GetPosts(
            pageState.category === 0 ? null : pageState.category,
            pageState.sortType,
            null,
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
            <MainAppBar />

            <div className="form-floating mt-3">
                <select
                    className="form-select"
                    onChange={(e) =>
                        setPageState({
                            ...pageState,
                            page: 1,
                            category: parseInt(e.target.value),
                        })
                    }
                >
                    <option value={0}>All</option>
                    <option value={PostCategory.WorkoutSharing}>Sharing</option>
                    <option value={PostCategory.WorkoutQuestion}>
                        Question
                    </option>
                </select>

                <label>Type</label>
            </div>

            <div className="form-floating mt-3">
                <select
                    className="form-select"
                    onChange={(e) =>
                        setPageState({
                            ...pageState,
                            page: 1,
                            sortType: parseInt(e.target.value),
                        })
                    }
                >
                    <option value={PostSortType.New}>Newest</option>
                    <option value={PostSortType.Best}>Most Liked</option>
                </select>

                <label>Sort By</label>
            </div>

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

HomePage.getLayout = createAuthorizeLayout();
export default HomePage;
