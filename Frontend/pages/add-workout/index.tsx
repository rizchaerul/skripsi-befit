import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsDashCircle, BsPlusCircle } from "react-icons/bs";
import useSWR from "swr";
import { ApiClient, WorkoutItem2 } from "../../src/clients/ApiClient";
import { SimpleAppBar } from "../../src/components/AppBar";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { alertError, alertSuccess } from "../../src/functions/alert";
import { createApiClient } from "../../src/functions/create-api-client";
import { nameof } from "../../src/functions/nameof";
import { NextPageWithLayout } from "../_app";

const AddWorkoutPage: NextPageWithLayout = () => {
    const session = useSession();

    const [categoryId, setCategoryId] = useState<string>();
    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem2>();
    const [showModal, setShowModal] = useState(false);
    const [total, setTotal] = useState(1);

    const { data: categories } = useSWR(
        [nameof<ApiClient>("workoutCategory_Get"), session.data?.token.sub],
        async () => await createApiClient().workoutCategory_Get()
    );

    const { data, mutate } = useSWR(
        [
            nameof<ApiClient>("userWorkout_GetWorkouts"),
            session.data?.token.sub,
            categoryId,
        ],
        async () =>
            await createApiClient().userWorkout_GetWorkouts(
                session.data?.token.sub ?? "",
                categoryId
            )
    );

    function handleClose() {
        setShowModal(false);
        setSelectedWorkout(undefined);
        setTotal(1);
    }

    return (
        <Fragment>
            <SimpleAppBar title="Add Workout" backHref="/workout" />

            <Link href="/add-workout/manual" passHref>
                <a className="btn btn-primary w-100 my-3">
                    Add your own workout
                </a>
            </Link>

            <div className="text-end">
                <select
                    onChange={(e) => {
                        if (e.target.value === "All") {
                            setCategoryId(undefined);
                        } else {
                            setCategoryId(e.target.value);
                        }
                    }}
                >
                    <option value={undefined}>All</option>
                    {categories?.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {data === undefined && (
                <div className="text-center mt-5">
                    <LoadingIndicator />
                </div>
            )}

            {data?.map((w) => (
                <div
                    key={w.id}
                    className="card mt-3 bg-secondary"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setSelectedWorkout(w);
                        setShowModal(true);
                    }}
                >
                    <div className="card-body d-flex align-items-center">
                        <BsPlusCircle />
                        <h1 className="ms-3">{w.name}</h1>
                        <img
                            src={w.iconBase64}
                            alt=""
                            className="ms-auto rounded-circle"
                            height={48}
                            width={48}
                        />
                    </div>
                </div>
            ))}

            <Modal show={showModal} onHide={handleClose} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>Add Workout</Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-0">
                    <div className="bg-secondary py-3">
                        <div className="text-center">
                            <img
                                src={selectedWorkout?.iconBase64}
                                alt=""
                                height={100}
                                className="rounded-circle"
                                width={100}
                            />
                        </div>
                        <div className="d-flex align-items-center justify-content-center mt-3">
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
                        </div>

                        <div className="text-center mt-2">
                            {selectedWorkout?.times}
                        </div>
                    </div>

                    <div className="container">
                        <h1>{selectedWorkout?.name}</h1>
                        <a
                            href={selectedWorkout?.url}
                            target="_new"
                            className="text-primary"
                        >
                            Video Tutorial
                        </a>

                        <div
                            className="my-3"
                            dangerouslySetInnerHTML={{
                                __html: selectedWorkout?.description ?? "",
                            }}
                        />

                        {/* <div className="ratio ratio-21x9">
                            <iframe
                                src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
                                title="YouTube video"
                                // allowFullScreen
                            ></iframe>
                        </div> */}

                        <div className="text-center mt-3">
                            <button
                                disabled={total < 1 || isNaN(total)}
                                className="btn btn-lg btn-secondary mb-3"
                                onClick={async () => {
                                    try {
                                        await createApiClient().userWorkout_AddWorkout(
                                            session.data?.token.sub ?? "",
                                            selectedWorkout?.id,
                                            total
                                        );

                                        mutate();
                                        alertSuccess();
                                        setShowModal(false);
                                    } catch (err) {
                                        console.error(err);
                                        alertError();
                                    }
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

AddWorkoutPage.getLayout = createAuthorizeLayout();
export default AddWorkoutPage;
