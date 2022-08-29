import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, FunctionComponent, useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { BsDashCircle, BsPlusCircle, BsShareFill } from "react-icons/bs";
import useSWR from "swr";
import {
    ApiClient,
    ApiException,
    PostCategory,
} from "../src/clients/ApiClient";
import { RteInput } from "../src/components/forms/inputs/RteInput";
import SmartForm from "../src/components/forms/SmartForm";
import { createAuthorizeLayout } from "../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../src/components/LoadingIndicator";
import { alertConfirm, alertError, alertSuccess } from "../src/functions/alert";
import { createApiClient } from "../src/functions/create-api-client";
import { nameof } from "../src/functions/nameof";
import { NextPageWithLayout } from "./_app";

const WorkoutPage: NextPageWithLayout = () => {
    const session = useSession();
    const { data, mutate } = useSWR(
        [
            nameof<ApiClient>("userWorkout_GetUserWorkouts"),
            session.data?.token.sub,
        ],
        async () =>
            await createApiClient().userWorkout_GetUserWorkouts(
                session.data?.token.sub ?? ""
            )
    );

    const { data: daysData, mutate: mutateDays } = useSWR(
        nameof<ApiClient>("userWorkout_GetDays"),
        async () => await createApiClient().userWorkout_GetDays("")
    );

    // console.log(daysData);

    const [showTargetModal, setShowTargetModal] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [loadingShare, setLoadingShare] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(false);

    const [showDescriptionModal, setShowDescriptionModal] = useState(false);

    const [selectedWorkoutDetailId, setselectedWorkoutDetailId] =
        useState<string>();
    const [target, setTarget] = useState(0);
    const [progress, setProgress] = useState(0);
    const [selectedWorkoutForDesc, setSelectedWorkoutForDesc] = useState("");

    // const [showProgressModal, setShowProgressModal] = useState(false);

    function handleCloseTarget() {
        setShowTargetModal(false);
        setTarget(0);
        setselectedWorkoutDetailId(undefined);
    }

    function handleCloseProgress() {
        setShowProgressModal(false);
        setProgress(0);
        setselectedWorkoutDetailId(undefined);
    }

    function handleCloseShare() {
        setShowShareModal(false);
    }

    return (
        <Fragment>
            <div className="container">
                <div className="d-flex align-items-center">
                    <h2 className="text-primary display-2 fw-bold">BeFit</h2>

                    <div className="ms-auto">
                        {data && data.items.length !== 0 && (
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowShareModal(true);
                                }}
                            >
                                <BsShareFill /> &nbsp; Post
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div
                className="d-flex align-items-center"
                style={{
                    height: 125,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundImage: `url("/images/run.webp")`,
                }}
            >
                {/* <img
                    src="https://images.pexels.com/photos/40751/running-runner-long-distance-fitness-40751.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                    alt=""
                    width="100%"
                    height={125}
                    style={{ objectFit: "cover" }}
                /> */}

                {/* <div className="position-absolute" style={{ top: "30%" }}> */}
                <div className="container">
                    <h1 className="text-white">MY WORKOUT</h1>
                </div>
                {/* </div> */}
            </div>

            <div className="container">
                {data?.isOffDay && (
                    <div className="alert alert-primary mt-3">
                        This is your off day.
                    </div>
                )}

                <div className="d-flex align-items-center py-3 justify-content-between">
                    {["S", "M", "T", "W", "T", "F", "S"].map((w, i) => {
                        let className = "btn-light";

                        if (daysData?.includes(i)) {
                            className = "btn-primary";
                        }

                        return (
                            <div key={i}>
                                <DaysButton
                                    disabled={daysData === undefined}
                                    className={`btn ${className} rounded-circle`}
                                    dayIndex={i}
                                    dayName={w}
                                    onSuccessUpdate={async () => {
                                        await mutateDays();
                                        await mutate();
                                    }}
                                />

                                {/* <button
                                    className={`btn ${className} rounded-circle`}
                                    onClick={async () => {
                                        await createApiClient().userWorkout_SubmitDays(
                                            "",
                                            i
                                        );

                                        mutateDays();
                                    }}
                                >
                                    <LoadingIndicator loading={false} />
                                    {w}
                                </button> */}
                            </div>
                        );
                    })}
                </div>

                {/* <Dropdown className="ms-auto">
                    <Dropdown.Toggle variant="primary"></Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                        <Dropdown.Item>Edit Progress</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> */}

                {data === undefined && (
                    <div className="text-center mt-5">
                        <LoadingIndicator />
                    </div>
                )}

                {data && data?.items.length !== 0 && (
                    <table className="table table-secondary">
                        <thead>
                            <tr>
                                <th>Workout</th>
                                <th>Target</th>
                                <th>Progress</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.items.map((w) => (
                                <tr key={w.id}>
                                    <td>{w.name}</td>
                                    <td>
                                        {w.target} {w.unit}
                                    </td>
                                    <td
                                        className={`${
                                            w.progress >= w.target
                                                ? "fw-bold text-success"
                                                : ""
                                        }`}
                                    >
                                        {w.progress}
                                    </td>
                                    <td>
                                        <Dropdown className="ms-auto">
                                            <Dropdown.Toggle variant="secondary">
                                                {/* <BsThreeDotsVertical /> */}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu align="end">
                                                {w.isCustom === false && (
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            setSelectedWorkoutForDesc(
                                                                w.workoutId
                                                            );
                                                            setShowDescriptionModal(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        View Description
                                                    </Dropdown.Item>
                                                )}

                                                <Dropdown.Item
                                                    onClick={() => {
                                                        setProgress(w.progress);
                                                        setselectedWorkoutDetailId(
                                                            w.id
                                                        );
                                                        setShowProgressModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Update Progress
                                                </Dropdown.Item>

                                                <Dropdown.Item
                                                    onClick={() => {
                                                        setTarget(w.target);
                                                        setselectedWorkoutDetailId(
                                                            w.id
                                                        );
                                                        setShowTargetModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Edit Target
                                                </Dropdown.Item>

                                                <Dropdown.Item
                                                    className="text-danger"
                                                    onClick={async () => {
                                                        const result =
                                                            await alertConfirm();
                                                        if (
                                                            result.isConfirmed
                                                        ) {
                                                            try {
                                                                await createApiClient().userWorkout_DeleteWorkoutDetail(
                                                                    w.id
                                                                );
                                                                alertSuccess();
                                                                mutate();
                                                            } catch (err) {
                                                                console.error(
                                                                    err
                                                                );
                                                                alertError();
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* <div style={{ height: 250 }} /> */}

                {data?.isOffDay == false && data?.items.length === 0 && (
                    <div className="text-center mt-5">
                        <Link href="/add-workout" passHref>
                            <a className="btn btn-primary text-black">
                                <BsPlusCircle size={50} />
                            </a>
                        </Link>
                        <h5 className="fw-bold mt-3">Add Workout</h5>
                        <p className="text-muted fw-bold">
                            Customize your own training plans based on your
                            preferences
                        </p>
                    </div>
                )}
            </div>

            <Modal show={showShareModal} onHide={handleCloseShare} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>Share Workout</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <SmartForm.Form
                        disabled={loadingShare}
                        onSubmit={async (dataUnknown) => {
                            const formData: any = dataUnknown;

                            setLoadingShare(true);

                            try {
                                await createApiClient().post_CreatePost("", {
                                    title: formData.title,
                                    description: formData.description,
                                    postCategory: parseInt(
                                        formData.postCategory
                                    ),
                                });

                                alertSuccess();
                                setShowShareModal(false);
                            } catch (err) {
                                console.error(err);

                                const error = err as ApiException;
                                alertError(error.response);
                            }

                            setLoadingShare(false);
                        }}
                    >
                        <div className="my-3">
                            <div className="form-floating">
                                <SmartForm.Input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="-"
                                    options={{
                                        required: {
                                            value: true,
                                            message: "Title is required",
                                        },
                                    }}
                                />

                                <label>Title</label>
                            </div>

                            <small className="mt-1 w-100 text-danger">
                                <SmartForm.Error name="title" />
                            </small>
                        </div>

                        <div className="my-3">
                            <div className="form-floating">
                                <SmartForm.Select
                                    name="postCategory"
                                    className="form-select"
                                >
                                    <option value={PostCategory.WorkoutSharing}>
                                        Sharing
                                    </option>

                                    <option
                                        value={PostCategory.WorkoutQuestion}
                                    >
                                        Question
                                    </option>
                                </SmartForm.Select>

                                <label>Post Category</label>
                            </div>
                        </div>

                        <div className="my-3">
                            <RteInput
                                name="description"
                                options={{
                                    validate: async (value) => {
                                        const text = value as string;

                                        if (text === "<p><br></p>") {
                                            return "Description is required";
                                        }

                                        if (text.length > 1_000_000) {
                                            return "Description is too long or the image is too big.";
                                        }

                                        return true;
                                    },
                                }}
                            />

                            <small className="mt-1 w-100 text-danger">
                                <SmartForm.Error name="description" />
                            </small>
                        </div>

                        <div className="text-end mt-3">
                            <button className="btn btn-primary">
                                {loadingShare && (
                                    <Fragment>
                                        <small className="spinner-border spinner-border-sm" />
                                        &nbsp;
                                    </Fragment>
                                )}
                                Post
                            </button>
                        </div>
                    </SmartForm.Form>
                </Modal.Body>
            </Modal>

            <Modal show={showTargetModal} onHide={handleCloseTarget} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Target</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="d-flex align-items-center justify-content-center mt-3">
                        <BsDashCircle
                            size={25}
                            onClick={() => {
                                if (target - 1 <= 0) {
                                    setTarget(1);
                                } else {
                                    setTarget(target - 1);
                                }
                            }}
                        />

                        <div className="mx-3">
                            <input
                                type="number"
                                value={target}
                                style={{ width: 40 }}
                                onChange={(e) => {
                                    if (parseInt(e.target.value) < 1) {
                                        setTarget(1);
                                    } else {
                                        setTarget(parseInt(e.target.value));
                                    }
                                }}
                            />
                        </div>

                        <BsPlusCircle
                            size={25}
                            onClick={() => setTarget(target + 1)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        disabled={target < 1 || isNaN(target)}
                        className="btn btn-primary"
                        onClick={async () => {
                            try {
                                await createApiClient().userWorkout_UpdateTarget(
                                    selectedWorkoutDetailId ?? "",
                                    target
                                );
                                mutate();
                                alertSuccess();
                                setShowTargetModal(false);
                            } catch (err) {
                                console.error(err);
                                alertError();
                            }
                        }}
                    >
                        Save
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showProgressModal}
                onHide={handleCloseProgress}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Progress</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="d-flex align-items-center justify-content-center mt-3">
                        <BsDashCircle
                            size={25}
                            onClick={() => {
                                if (progress - 1 < 0) {
                                    setProgress(0);
                                } else {
                                    setProgress(progress - 1);
                                }
                            }}
                        />

                        <div className="mx-3">
                            <input
                                type="number"
                                value={progress}
                                style={{ width: 40 }}
                                onChange={(e) => {
                                    if (parseInt(e.target.value) < 0) {
                                        setProgress(0);
                                    } else {
                                        setProgress(parseInt(e.target.value));
                                    }
                                }}
                            />
                        </div>

                        <BsPlusCircle
                            size={25}
                            onClick={() => setProgress(progress + 1)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-primary"
                        disabled={
                            progress < 0 || isNaN(progress) || loadingProgress
                        }
                        onClick={async () => {
                            try {
                                setLoadingProgress(true);
                                await createApiClient().userWorkout_InsertProgress(
                                    data?.items.find(
                                        (w) => w.id == selectedWorkoutDetailId
                                    )?.workoutId ?? "",
                                    progress
                                );
                                mutate();
                                alertSuccess();
                                setShowProgressModal(false);
                                setLoadingProgress(false);
                            } catch (err) {
                                console.error(err);
                                alertError();
                            }
                        }}
                    >
                        Save
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showDescriptionModal}
                onHide={() => {
                    setShowDescriptionModal(false);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Description</Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-0">
                    <ModalBody workoutId={selectedWorkoutForDesc} />
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

const ModalBody: FunctionComponent<{
    workoutId: string;
}> = (props) => {
    const { data } = useSWR(
        [nameof<ApiClient>("userWorkout_GetWorkoutDesc"), props.workoutId],
        async () =>
            await createApiClient().userWorkout_GetWorkoutDesc(props.workoutId)
    );

    if (data === undefined) {
        return (
            <div className="text-center py-3">
                <LoadingIndicator />
            </div>
        );
    }

    return (
        <Fragment>
            <div className="bg-secondary py-3">
                <div className="text-center">
                    <img
                        src={data?.src}
                        alt=""
                        height={100}
                        width={100}
                        className="rounded-circle"
                    />
                </div>

                {/* <div className="d-flex align-items-center justify-content-center mt-3">
                    <BsDashCircle
                        size={25}
                        onClick={() => {
                            if (total - 1 <= 0) {
                                setTotal(1);
                            } else {
                                setTotal(total - 1);
                            }
                        }}
                    />

                    <div className="mx-3">
                        <input
                            type="number"
                            value={total}
                            style={{ width: 40 }}
                            onChange={(e) => {
                                if (parseInt(e.target.value) < 1) {
                                    setTotal(1);
                                } else {
                                    setTotal(parseInt(e.target.value));
                                }
                            }}
                        />
                    </div>

                    <BsPlusCircle
                        size={25}
                        onClick={() => setTotal(total + 1)}
                    />
                </div> */}
            </div>

            <div className="container">
                <h1>{data?.name}</h1>
                <a href={data?.url} target="_new" className="text-primary">
                    Video Tutorial
                </a>

                <div
                    className="my-3"
                    dangerouslySetInnerHTML={{
                        __html: data?.desc ?? "",
                    }}
                />
            </div>
        </Fragment>
    );
};

const DaysButton: FunctionComponent<{
    className: string;
    dayName: string;
    dayIndex: number;
    disabled: boolean;
    onSuccessUpdate: () => void;
}> = (props) => {
    const [loading, setLoading] = useState(false);

    return (
        <Fragment>
            <button
                disabled={loading || props.disabled}
                className={props.className}
                onClick={async () => {
                    setLoading(true);

                    try {
                        await createApiClient().userWorkout_SubmitDays(
                            "",
                            props.dayIndex
                        );

                        await props.onSuccessUpdate();
                    } catch (err) {
                        console.error(err);
                    }

                    setLoading(false);
                }}
            >
                <LoadingIndicator loading={loading} />
                {loading === false && props.dayName}
            </button>
        </Fragment>
    );
};

WorkoutPage.getLayout = createAuthorizeLayout({ withContainer: false });
export default WorkoutPage;
