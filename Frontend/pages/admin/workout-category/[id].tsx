import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import {
    ApiException,
    WorkoutCategoryForm,
} from "../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../src/components/AppBar";
import { ConditionalRender } from "../../../src/components/ConditionalRender";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import { CreateEditWorkoutCategory } from "../../../src/components/pages/CreateEditWorkoutCategory";
import { alertError, alertSuccess } from "../../../src/functions/alert";
import { createApiClient } from "../../../src/functions/create-api-client";
import { NextPageWithLayout } from "../../_app";

const EditWorkoutCategoryPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<WorkoutCategoryForm>();

    useEffect(() => {
        (async () => {
            try {
                if (typeof id === "string") {
                    const result =
                        await createApiClient().workoutCategory_GetById(id);

                    setInitialValues({
                        name: result.name ?? "",
                    });
                }
            } catch (err) {
                console.error(err);

                const error = err as ApiException;
                alertError(error.response);
            }
        })();
    }, []);

    return (
        <Fragment>
            <ConditionalRender
                condition={!!initialValues}
                alternative={
                    <div className="flex-center mt-5">
                        <small className="spinner-border spinner-border-sm ms-3" />
                    </div>
                }
            >
                <CreateEditWorkoutCategory
                    initialValues={initialValues}
                    disabled={isLoading}
                    onSubmit={async (data, methods) => {
                        setIsLoading(true);

                        try {
                            if (typeof id === "string") {
                                await createApiClient().workoutCategory_Update(
                                    id,
                                    data
                                );

                                alertSuccess();
                                methods.reset(data);
                            }
                        } catch (err) {
                            console.error(err);

                            const error = err as ApiException;
                            alertError(error.response);
                        }

                        setIsLoading(false);
                    }}
                >
                    <SimpleAppBar
                        title="Edit Workout Category"
                        backHref="/admin/workout-category"
                        buttonTitle="Save"
                        isLoading={isLoading}
                    />
                </CreateEditWorkoutCategory>
            </ConditionalRender>
        </Fragment>
    );
};

EditWorkoutCategoryPage.getLayout = createAuthorizeLayout();

export default EditWorkoutCategoryPage;
