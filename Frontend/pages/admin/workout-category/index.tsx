import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Dropdown } from "react-bootstrap";
import { BsGear } from "react-icons/bs";
import useSWR from "swr";
import { ApiClient } from "../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../src/components/AppBar";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import {
    alertConfirm,
    alertError,
    alertSuccess,
} from "../../../src/functions/alert";
import { createApiClient } from "../../../src/functions/create-api-client";
import { nameof } from "../../../src/functions/nameof";
import { NextPageWithLayout } from "../../_app";

const WorkoutCategoryPage: NextPageWithLayout = () => {
    const router = useRouter();

    const { data, mutate } = useSWR(
        [nameof<ApiClient>("workoutCategory_Get")],
        async () => await createApiClient().workoutCategory_Get()
    );

    return (
        <Fragment>
            <SimpleAppBar
                title="Workout Category"
                buttonTitle="Add New Category"
                onClick={() => router.push("/admin/workout-category/add")}
            />

            {data === undefined && (
                <div className="text-center mt-3">
                    <small className="spinner-border spinner-border-sm ms-3" />
                </div>
            )}

            {data &&
                data.map((workoutCategory) => (
                    <div className="card my-3" key={workoutCategory.id}>
                        <div className="card-body d-flex align-items-center">
                            <h3>{workoutCategory.name}</h3>

                            <Dropdown className="ms-auto">
                                <Dropdown.Toggle variant="secondary">
                                    <BsGear />
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end">
                                    <Link
                                        href={`/admin/workout-category/workout/?categoryId=${workoutCategory.id}`}
                                        passHref
                                    >
                                        <Dropdown.Item>
                                            Manage Workout
                                        </Dropdown.Item>
                                    </Link>

                                    <Link
                                        href={`/admin/workout-category/${workoutCategory.id}`}
                                        passHref
                                    >
                                        <Dropdown.Item>
                                            Edit Category
                                        </Dropdown.Item>
                                    </Link>

                                    <Dropdown.Item
                                        className="text-danger"
                                        onClick={async () => {
                                            const result = await alertConfirm();

                                            if (result.isConfirmed) {
                                                try {
                                                    await createApiClient().workoutCategory_Delete(
                                                        workoutCategory.id
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
                                        Delete Category
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                ))}
        </Fragment>
    );
};

WorkoutCategoryPage.getLayout = createAuthorizeLayout();

export default WorkoutCategoryPage;
