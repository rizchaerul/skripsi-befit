import { Fragment, useState } from "react";
import {
    ApiException,
    WorkoutCategoryForm,
} from "../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../src/components/AppBar";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import { CreateEditWorkoutCategory } from "../../../src/components/pages/CreateEditWorkoutCategory";
import { alertError, alertSuccess } from "../../../src/functions/alert";
import { createApiClient } from "../../../src/functions/create-api-client";
import { NextPageWithLayout } from "../../_app";

const initialValues: WorkoutCategoryForm = {
    name: "",
};

const CreateWorkoutCategoryPage: NextPageWithLayout = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Fragment>
            <CreateEditWorkoutCategory
                initialValues={initialValues}
                disabled={isLoading}
                onSubmit={async (data, methods) => {
                    setIsLoading(true);

                    try {
                        await createApiClient().workoutCategory_Insert(data);
                        alertSuccess();
                        methods.reset();
                    } catch (err) {
                        console.error(err);

                        const error = err as ApiException;
                        alertError(error.response);
                    }

                    setIsLoading(false);
                }}
            >
                <SimpleAppBar
                    title="Add Workout Category"
                    backHref="/admin/workout-category"
                    buttonTitle="Save"
                    isLoading={isLoading}
                />
            </CreateEditWorkoutCategory>
        </Fragment>
    );
};

CreateWorkoutCategoryPage.getLayout = createAuthorizeLayout();

export default CreateWorkoutCategoryPage;
