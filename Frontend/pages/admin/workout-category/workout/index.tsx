import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Dropdown } from "react-bootstrap";
import { BsGear } from "react-icons/bs";
import useSWR from "swr";
import { ApiClient } from "../../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../../src/components/AppBar";
import { createAuthorizeLayout } from "../../../../src/components/layouts/AuthorizedLayout";
import {
    alertConfirm,
    alertError,
    alertSuccess,
} from "../../../../src/functions/alert";
import { createApiClient } from "../../../../src/functions/create-api-client";
import { nameof } from "../../../../src/functions/nameof";
import { NextPageWithLayout } from "../../../_app";

const WorkoutPage: NextPageWithLayout = () => {
    const router = useRouter();

    const { categoryId } = router.query;

    const { data, mutate } = useSWR(
        [nameof<ApiClient>("userAccount_GetUserAccountById"), categoryId],
        async () =>
            await createApiClient().workout_Get(
                typeof categoryId === "string" ? categoryId : ""
            )
    );

    return (
        <Fragment>
            <SimpleAppBar
                title="Manage Workout"
                buttonTitle="Add New Workout"
                backHref="/admin/workout-category"
                onClick={() =>
                    router.push(
                        `/admin/workout-category/workout/add?categoryId=${categoryId}`
                    )
                }
            />

            {data === undefined && (
                <div className="text-center mt-3">
                    <small className="spinner-border spinner-border-sm ms-3" />
                </div>
            )}

            {data?.map((workout) => (
                <div className="card my-3" key={workout.id}>
                    <div className="card-body d-flex align-items-center">
                        <img
                            src={workout.iconBase64}
                            alt=""
                            height={32}
                            width={32}
                        />

                        <h3 className="ms-3">{workout.name}</h3>

                        <Dropdown className="ms-auto">
                            <Dropdown.Toggle variant="secondary">
                                <BsGear />
                            </Dropdown.Toggle>

                            <Dropdown.Menu align="end">
                                <Link
                                    href={`/admin/workout-category/workout/${workout.id}`}
                                    passHref
                                >
                                    <Dropdown.Item>Edit Workout</Dropdown.Item>
                                </Link>

                                <Dropdown.Item
                                    className="text-danger"
                                    onClick={async () => {
                                        const result = await alertConfirm();

                                        if (result.isConfirmed) {
                                            try {
                                                await createApiClient().workout_Delete(
                                                    workout.id
                                                );

                                                alertSuccess();
                                                mutate();
                                            } catch (err) {
                                                console.error(err);
                                                alertError();
                                            }
                                        }
                                    }}
                                >
                                    Delete Workout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            ))}
        </Fragment>
    );
};

WorkoutPage.getLayout = createAuthorizeLayout();

export default WorkoutPage;
