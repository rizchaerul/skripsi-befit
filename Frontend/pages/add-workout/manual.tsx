import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { ApiException } from "../../src/clients/ApiClient";
import { SimpleAppBar } from "../../src/components/AppBar";
import SmartForm from "../../src/components/forms/SmartForm";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { UnitConstants } from "../../src/constants/UnitConstants";
import { alertError, alertSuccess } from "../../src/functions/alert";
import { createApiClient } from "../../src/functions/create-api-client";
import { NextPageWithLayout } from "../_app";

const ManualPage: NextPageWithLayout = () => {
    const session = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    return (
        <Fragment>
            <SmartForm.Form
                disabled={loading}
                onSubmit={async (data) => {
                    const a: any = data;

                    setLoading(true);
                    try {
                        await createApiClient().userWorkout_AddManualWorkout({
                            workoutName: a.name as string,
                            unit: a.isMinute,
                            repetition: a.repetition as number,
                            userAccountId: session.data?.token.sub ?? "",
                        });

                        alertSuccess();
                        router.push("/add-workout");
                    } catch (err) {
                        console.error(err);

                        const error = err as ApiException;
                        alertError(error.response);
                    }
                    setLoading(false);
                }}
            >
                <SimpleAppBar
                    backHref="/add-workout"
                    title="Add Your Own Workout"
                    buttonTitle="Save"
                />

                <div className="my-3">
                    <div className="form-floating">
                        <SmartForm.Input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="-"
                            options={{
                                required: {
                                    value: true,
                                    message: "Workout Name is required",
                                },
                            }}
                        />

                        <label>Workout Name</label>
                    </div>

                    <small className="mt-1 w-100 text-danger">
                        <SmartForm.Error name="name" />
                    </small>
                </div>

                <div className="my-3">
                    <div className="form-floating">
                        <SmartForm.Select
                            name="isMinute"
                            className="form-select"
                            options={{
                                required: {
                                    value: true,
                                    message: "Workout Repetition is required",
                                },
                            }}
                        >
                            <option value={UnitConstants.time}>Time(s)</option>
                            <option value={UnitConstants.minute}>
                                Minute(s)
                            </option>
                            <option value={UnitConstants.distanceMeter}>
                                Distance (meter)
                            </option>
                            <option value={UnitConstants.distanceKilometer}>
                                Distance (kilometer)
                            </option>
                        </SmartForm.Select>

                        <label>Workout Repetition Unit</label>
                    </div>

                    <small className="mt-1 w-100 text-danger">
                        <SmartForm.Error name="isMinute" />
                    </small>
                </div>

                <div className="my-3">
                    <div className="form-floating">
                        <SmartForm.Input
                            type="number"
                            name="repetition"
                            className="form-control"
                            placeholder="-"
                            options={{
                                required: {
                                    value: true,
                                    message: "Target is required",
                                },
                                min: {
                                    value: 1,
                                    message: "The minimum amount is one.",
                                },
                            }}
                        />

                        <label>Target Per Day</label>
                    </div>

                    <small className="mt-1 w-100 text-danger">
                        <SmartForm.Error name="repetition" />
                    </small>
                </div>
            </SmartForm.Form>
        </Fragment>
    );
};

ManualPage.getLayout = createAuthorizeLayout();
export default ManualPage;
