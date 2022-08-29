import { useSession } from "next-auth/react";
import Link from "next/link";
import { FunctionComponent, useState, Fragment } from "react";
import { Modal } from "react-bootstrap";
import {
    BsPlus,
    BsHandThumbsUpFill,
    BsHandThumbsDownFill,
    BsChatFill,
    BsShareFill,
    BsTrashFill,
} from "react-icons/bs";
import useSWR from "swr";
import { PostItem, ApiClient, VoteType } from "../clients/ApiClient";
import { ImageConstants } from "../constants/ImageConstants";
import { alertError, alertConfirm, alertSuccess } from "../functions/alert";
import { createApiClient } from "../functions/create-api-client";
import { getRelativeTime } from "../functions/get-relative-time";
import { nameof } from "../functions/nameof";
import SmartForm from "./forms/SmartForm";

export const Post: FunctionComponent<{
    post: PostItem;
    onDelete: () => void;
    standalone?: boolean;
}> = (props) => {
    const p = props.post;
    const { standalone = false } = props;

    const session = useSession();

    const [show, setShow] = useState(false);
    const [enableSend, setEnableSend] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { data, mutate } = useSWR(
        [nameof<ApiClient>("post_GetReplies"), p.id],
        async () => await createApiClient().post_GetReplies(p.id)
    );

    const { data: voteData, mutate: mutateVote } = useSWR(
        [nameof<ApiClient>("post_GetVote"), p.id],
        async () =>
            await createApiClient().post_GetVote(p.id, session.data?.token.sub)
    );

    async function submitComment(comment: unknown) {
        if (typeof comment !== "string") {
            return;
        }

        try {
            await createApiClient().post_PostComment(p.id, {
                comment: comment,
                userAccountId: session.data?.token?.sub ?? "",
            });

            mutate();
        } catch {
            alertError();
        }
    }

    async function submitVote(type: VoteType) {
        await createApiClient().post_SubmitVote(p.id, {
            userAccountId: session.data?.token?.sub ?? "",
            voteType: type,
        });

        mutateVote();
    }

    function renderContent(full = false) {
        return (
            <Fragment>
                <div className="d-flex">
                    <img
                        src={
                            p.avatarBase64 ??
                            ImageConstants.defaultPictureSource
                        }
                        className="rounded-circle shadow-sm mb-3"
                        alt="avatar"
                        height={50}
                        width={50}
                    />

                    <div className="ps-3">
                        <Link href={`/profile?id=${p.userAccountId}`} passHref>
                            <a className="text-decoration-none text-black fw-bold">
                                {p.userName}
                            </a>
                        </Link>
                        <h6 className="text-muted">
                            {getRelativeTime(new Date(p.createdAt))} ago
                        </h6>

                        <div className="bg-secondary px-1">
                            {p.categoryName}
                        </div>
                    </div>

                    <div className="ms-auto">
                        {!session.data?.token.isAdmin && (
                            <button
                                className="btn btn-secondary"
                                onClick={async () => {
                                    const result = await alertConfirm(
                                        "Your workout plan will be overriden."
                                    );
                                    if (result.isConfirmed) {
                                        try {
                                            await createApiClient().post_CopyWorkout(
                                                p.userWorkoutId
                                            );
                                            alertSuccess();
                                        } catch (err) {
                                            console.error(err);
                                            alertError();
                                        }
                                    }
                                }}
                            >
                                <BsPlus />
                                Copy
                            </button>
                        )}
                    </div>
                </div>

                <div className="my-3">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th>Workout</th>
                                <th>Target</th>
                                <th>Progress</th>
                            </tr>
                        </thead>

                        <tbody>
                            {p.workouts.map((w) => (
                                <tr key={w.id}>
                                    <td>{w.name}</td>
                                    <td>{w.target}</td>
                                    <td>{w.progress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>{p.title}</h3>

                    <div className="d-flex overflow-auto">
                        {full === true && (
                            <div
                                dangerouslySetInnerHTML={{ __html: p.content }}
                            />
                        )}

                        {full === false && (
                            <Fragment>
                                {/* {p.content.slice(0, 30) + "... "} */}

                                <span
                                    className="text-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={handleShow}
                                >
                                    Read Post
                                </span>
                            </Fragment>
                        )}
                    </div>
                </div>

                <div className="d-flex gap-3">
                    <span
                        className={voteData?.isLiked ? "text-danger" : ""}
                        onClick={() => {
                            if (!session.data?.token.isAdmin) {
                                submitVote(VoteType.UpVote);
                            }
                        }}
                    >
                        <BsHandThumbsUpFill />
                        {voteData?.upvoteCount ?? p.upvoteCount}
                    </span>

                    <span
                        className={voteData?.isDisliked ? "text-danger" : ""}
                        onClick={() => {
                            if (!session.data?.token.isAdmin) {
                                submitVote(VoteType.DownVote);
                            }
                        }}
                    >
                        <BsHandThumbsDownFill />
                        {voteData?.downvoteCount ?? p.downvoteCount}
                    </span>

                    <span>
                        {full === true && (
                            <Fragment>
                                <BsChatFill />
                                {p.replyCount}
                            </Fragment>
                        )}

                        {full === false && (
                            <Fragment>
                                <BsChatFill onClick={handleShow} />
                                {p.replyCount}
                            </Fragment>
                        )}
                    </span>

                    <span
                        className="ms-auto"
                        onClick={async () => {
                            await navigator.share({
                                title: p.title,
                                url: `/post/${p.id}`,
                                text: `Check out workout plan from ${p.userName}`,
                            });
                        }}
                    >
                        <BsShareFill />
                    </span>

                    {(p.userAccountId === session.data?.token.sub ||
                        session.data?.token.isAdmin) && (
                        <span
                            className="text-danger"
                            onClick={async () => {
                                const result = await alertConfirm();

                                if (result.isConfirmed) {
                                    await createApiClient().post_DeletePost(
                                        p.id
                                    );
                                    alertSuccess();
                                    props.onDelete();
                                }
                            }}
                        >
                            <BsTrashFill />
                        </span>
                    )}
                </div>
            </Fragment>
        );
    }

    if (standalone) {
        return (
            <div className="bg-secondary vh-100">
                <div className="p-3 bg-white">
                    <div className="container">{renderContent(true)}</div>
                </div>

                <div className="container">
                    <div className="p-3">
                        <SmartForm.Form
                            onSubmit={(data, methods) => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                submitComment(data.comment);
                                methods.reset({
                                    comment: "",
                                });
                            }}
                        >
                            <SmartForm.TextArea
                                type="text"
                                name="comment"
                                className="form-control"
                                placeholder="Add a comment..."
                            />

                            <SmartForm.Watcher
                                watch={["comment"]}
                                onChange={(data) => {
                                    if (data.comment) {
                                        setEnableSend(true);
                                    } else {
                                        setEnableSend(false);
                                    }
                                }}
                            />

                            <button
                                type="submit"
                                className="btn btn-primary mt-3"
                                disabled={!enableSend}
                            >
                                Send
                            </button>
                        </SmartForm.Form>
                    </div>

                    {data?.map((r) => (
                        <div key={r.id} className="px-3 d-flex">
                            <img
                                src={
                                    r?.avatarBase64 ??
                                    ImageConstants.defaultPictureSource
                                }
                                className="rounded-circle shadow-sm mb-3"
                                alt="avatar"
                                height={40}
                                width={40}
                            />

                            <div className="ms-3">
                                <Link
                                    href={`/profile?id=${r.userAccountId}`}
                                    passHref
                                >
                                    <a className="fw-bold text-decoration-none">
                                        {r.userAccountName}
                                    </a>
                                </Link>

                                <span className="ms-1 text-muted">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </span>

                                <div>{r.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            <div className="card mt-3">
                <div className="card-body">{renderContent()}</div>
            </div>

            <Modal show={show} onHide={handleClose} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>Post</Modal.Title>
                </Modal.Header>

                <Modal.Body
                    className="p-0"
                    style={{ backgroundColor: "#f2f0f0" }}
                >
                    <div className="p-3 bg-white">
                        <div className="container">{renderContent(true)}</div>
                    </div>

                    <div className="container">
                        <div className="p-3">
                            {!session.data?.token.isAdmin && (
                                <SmartForm.Form
                                    onSubmit={(data, methods) => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        submitComment(data.comment);
                                        methods.reset({
                                            comment: "",
                                        });
                                    }}
                                >
                                    <SmartForm.TextArea
                                        type="text"
                                        name="comment"
                                        className="form-control"
                                        placeholder="Add a comment..."
                                    />

                                    <SmartForm.Watcher
                                        watch={["comment"]}
                                        onChange={(data) => {
                                            if (data.comment) {
                                                setEnableSend(true);
                                            } else {
                                                setEnableSend(false);
                                            }
                                        }}
                                    />

                                    <button
                                        type="submit"
                                        className="btn btn-primary mt-3"
                                        disabled={!enableSend}
                                    >
                                        Send
                                    </button>
                                </SmartForm.Form>
                            )}
                        </div>

                        {data?.map((r) => (
                            <div key={r.id} className="px-3 d-flex">
                                <img
                                    src={
                                        r?.avatarBase64 ??
                                        ImageConstants.defaultPictureSource
                                    }
                                    className="rounded-circle shadow-sm mb-3"
                                    alt="avatar"
                                    height={40}
                                    width={40}
                                />

                                <div className="ms-3">
                                    <Link
                                        href={`/profile?id=${r.userAccountId}`}
                                        passHref
                                    >
                                        <a className="fw-bold text-decoration-none">
                                            {r.userAccountName}
                                        </a>
                                    </Link>

                                    <span className="ms-1 text-muted">
                                        {new Date(
                                            r.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                    <div>{r.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};
