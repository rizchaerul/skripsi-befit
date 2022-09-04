import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { NotificationSettingDetails } from "../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../src/components/AppBar";
import { ConditionalRender } from "../../../src/components/ConditionalRender";
import { CustomTimePicker } from "../../../src/components/CustomTimePicker";
import SmartForm from "../../../src/components/forms/SmartForm";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import { WebPushConstants } from "../../../src/constants/WebPushConstants";
import { alertError } from "../../../src/functions/alert";
import { createApiClient } from "../../../src/functions/create-api-client";
import { generatePushSubscription } from "../../../src/functions/push-subscription";
import { NextPageWithLayout } from "../../_app";

const NotificationPage: NextPageWithLayout = () => {
    const session = useSession();
    const { query } = useRouter();
    const [permission, setPermission] =
        useState<typeof Notification.permission>("granted");
    const [isDisabled, setIsDisabled] = useState(true);

    const [initialSettingsForm, setInitialSettingsForm] = useState<
        NotificationSettingDetails | undefined
    >();

    useEffect(() => {
        fetchNotificationSettings();
        setPermission(Notification.permission);
    }, []);

    async function fetchNotificationSettings() {
        setIsDisabled(true);

        if (session.data?.token.sub) {
            try {
                const result =
                    await createApiClient().userAccount_GetNotificationSettings(
                        session.data?.token.sub
                    );

                setInitialSettingsForm({
                    ...result,
                    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // // @ts-ignore
                    // workoutTimes: ["15:30", "15:20"],
                    // drinkTimes: ["15:30", "15:20"],
                });
            } catch {
                await alertError();
            }
        }

        setIsDisabled(false);
    }

    async function handleSubmit(
        data: NotificationSettingDetails,
        methods: UseFormReturn<NotificationSettingDetails>
    ) {
        setIsDisabled(true);

        if (session.data?.token.sub) {
            try {
                const result =
                    await createApiClient().userAccount_UpdateNotificationSettings(
                        session.data?.token.sub,
                        {
                            isCommentNotificationActive:
                                data.isCommentNotificationActive,
                            isDrinkNotificationActive:
                                data.isDrinkNotificationActive,
                            isReminderNotificationActive:
                                data.isReminderNotificationActive,
                            drinkNotificationTimes: data.drinkNotificationTimes,
                            workoutNotificationTimes:
                                data.workoutNotificationTimes,
                        }
                    );

                methods.reset({
                    ...result,
                    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // // @ts-ignore
                    // workoutTimes: ["15:30", "15:20"],
                    // drinkTimes: ["15:30", "15:20"],
                });
            } catch {
                await alertError();
            }
        }

        setIsDisabled(false);
    }

    return (
        <Fragment>
            <SimpleAppBar
                backHref={
                    query["backHref"]
                        ? `/${query["backHref"]}`
                        : "/profile/settings"
                }
                title="Notification"
            />

            <ConditionalRender
                condition={!!initialSettingsForm}
                alternative={
                    <div className="text-center mt-3">
                        <small className="spinner-border spinner-border-sm ms-3" />
                    </div>
                }
            >
                {permission === "default" && (
                    <div className="alert alert-warning mt-4" role="alert">
                        You haven&apos;t allowed BeFit to send notification in
                        your browser.{" "}
                        <span
                            className="text-decoration-underline"
                            onClick={async () => {
                                await Notification.requestPermission();
                                const sub = await generatePushSubscription();

                                if (sub) {
                                    const json = JSON.stringify(sub);

                                    const parsedSub = JSON.parse(json) as {
                                        endpoint: string;
                                        keys: {
                                            p256dh: string;
                                            auth: string;
                                        };
                                    };

                                    await createApiClient().notification_SaveNotificationData(
                                        "",
                                        parsedSub.endpoint,
                                        parsedSub.keys.p256dh,
                                        parsedSub.keys.auth
                                    );

                                    console.log(
                                        "submitted push notification token!"
                                    );

                                    localStorage.setItem(
                                        WebPushConstants.subscriptionKey,
                                        JSON.stringify(sub)
                                    );
                                }
                            }}
                        >
                            Click here
                        </span>{" "}
                        to enable notification. And then refresh the page.
                    </div>
                )}

                {permission === "denied" && (
                    <div className="alert alert-danger mt-4" role="alert">
                        You have blocked BeFit to permission to send
                        notification. You will not get reminder notification.
                    </div>
                )}

                <SmartForm.Form
                    initialValues={initialSettingsForm}
                    onSubmit={handleSubmit}
                    disabled={isDisabled}
                >
                    <div className="d-flex flex-column gap-2 mt-3">
                        <div className="d-flex justify-content-between">
                            <h6>Workout Reminder</h6>
                            <div className="form-check form-switch">
                                <SmartForm.Input
                                    type="checkbox"
                                    name="isReminderNotificationActive"
                                    className="form-check-input"
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <h6>Comment</h6>
                            <div className="form-check form-switch">
                                <SmartForm.Input
                                    type="checkbox"
                                    name="isCommentNotificationActive"
                                    className="form-check-input"
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <h6>Drink Reminder</h6>
                            <div className="form-check form-switch">
                                <SmartForm.Input
                                    type="checkbox"
                                    name="isDrinkNotificationActive"
                                    className="form-check-input"
                                />
                            </div>
                        </div>

                        <div className="border-bottom" />

                        <h6>Workout Reminder Times</h6>
                        <CustomTimePicker name="workoutNotificationTimes" />

                        <div className="border-bottom" />

                        <h6>Drink Reminder Times</h6>
                        <CustomTimePicker name="drinkNotificationTimes" />

                        <div className="text-center mt-3">
                            <button
                                type="submit"
                                className="btn btn-dark fw-bold rounded-5"
                            >
                                Update
                                {isDisabled && (
                                    <small className="spinner-border spinner-border-sm ms-3" />
                                )}
                            </button>
                        </div>
                    </div>
                </SmartForm.Form>
            </ConditionalRender>
        </Fragment>
    );
};

NotificationPage.getLayout = createAuthorizeLayout();

export default NotificationPage;
