import { useRouter } from "next/router";
import { useState } from "react";
import { ApiException } from "../../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../../src/components/AppBar";
import { createAuthorizeLayout } from "../../../../src/components/layouts/AuthorizedLayout";
import { CreateEditWorkout } from "../../../../src/components/pages/CreateEditWorkout";
import { alertError, alertSuccess } from "../../../../src/functions/alert";
import { createApiClient } from "../../../../src/functions/create-api-client";
import { getBase64 } from "../../../../src/functions/get-base64";
import { NextPageWithLayout } from "../../../_app";

const CreateWorkoutPage: NextPageWithLayout = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const { categoryId } = router.query;

    return (
        <CreateEditWorkout
            categoryId={categoryId as string}
            disabled={isLoading}
            initialValues={{
                categoryId: categoryId as string,
                description: "",
                iconBase64: "",
                isMinute: "false",
                name: "",
                videoUrl: "",
            }}
            onSubmit={async (data, methods) => {
                setIsLoading(true);

                try {
                    const fileList = data.iconBase64 as FileList;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const iconBase64 = await getBase64(fileList[0]!);

                    await createApiClient().workout_Create({
                        categoryId: data.categoryId,
                        description: data.description,
                        iconBase64: iconBase64,
                        isMinute: data.isMinute === "true",
                        name: data.name,
                        videoUrl: data.videoUrl,
                    });

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
                title="Workout"
                buttonTitle="Add New Workout"
                backHref={`/admin/workout-category/workout?categoryId=${categoryId}`}
            />
        </CreateEditWorkout>
    );
};

CreateWorkoutPage.getLayout = createAuthorizeLayout();

export default CreateWorkoutPage;
