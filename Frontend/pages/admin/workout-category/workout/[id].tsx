import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { ApiException, WorkoutForm } from "../../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../../src/components/AppBar";
import { ConditionalRender } from "../../../../src/components/ConditionalRender";
import { createAuthorizeLayout } from "../../../../src/components/layouts/AuthorizedLayout";
import { CreateEditWorkout } from "../../../../src/components/pages/CreateEditWorkout";
import { alertError, alertSuccess } from "../../../../src/functions/alert";
import { createApiClient } from "../../../../src/functions/create-api-client";
import { getBase64 } from "../../../../src/functions/get-base64";
import { NextPageWithLayout } from "../../../_app";

const EditWorkoutPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<WorkoutForm>();

    useEffect(() => {
        (async () => {
            try {
                if (typeof id === "string") {
                    const result = await createApiClient().workout_GetById(id);

                    setInitialValues({
                        categoryId: result.categoryId,
                        description: result.description,
                        iconBase64: result.iconBase64,
                        unit: result.unit,
                        name: result.name,
                        videoUrl: result.videoUrl,
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
                <CreateEditWorkout
                    initialValues={{
                        categoryId: initialValues?.categoryId,
                        description: initialValues?.description,
                        iconBase64: initialValues?.iconBase64,
                        isMinute: initialValues?.unit,
                        name: initialValues?.name,
                        videoUrl: initialValues?.videoUrl,
                    }}
                    disabled={isLoading}
                    isEdit={true}
                    categoryId={initialValues?.categoryId ?? ""}
                    onSubmit={async (data, methods) => {
                        setIsLoading(true);

                        let icon = "";

                        if (typeof data.iconBase64 !== "string") {
                            const fileList = data.iconBase64 as FileList;
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            icon = await getBase64(fileList[0]!);
                        } else {
                            icon = data.iconBase64;
                        }

                        try {
                            if (typeof id === "string") {
                                const res =
                                    await createApiClient().workout_Update(id, {
                                        categoryId: data.categoryId,
                                        description: data.description,
                                        iconBase64: icon,
                                        unit: data.isMinute,
                                        name: data.name,
                                        videoUrl: data.videoUrl,
                                    });

                                alertSuccess();
                                methods.reset({
                                    categoryId: res.categoryId,
                                    description: res.description,
                                    iconBase64: res.iconBase64,

                                    isMinute: res.unit,
                                    name: res.name,
                                    videoUrl: res.videoUrl,
                                });
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
                        backHref={`/admin/workout-category/workout?categoryId=${initialValues?.categoryId}`}
                        buttonTitle="Save"
                        isLoading={isLoading}
                    />
                </CreateEditWorkout>
            </ConditionalRender>
        </Fragment>
    );
};

EditWorkoutPage.getLayout = createAuthorizeLayout();

export default EditWorkoutPage;
