import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { NotificationSettingDetails } from "../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../src/components/AppBar";
import { ConditionalRender } from "../../../src/components/ConditionalRender";
import SmartForm from "../../../src/components/forms/SmartForm";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import { alertError } from "../../../src/functions/alert";
import { createApiClient } from "../../../src/functions/create-api-client";
import { NextPageWithLayout } from "../../_app";

const NotificationPage: NextPageWithLayout = () => {
    const session = useSession();

    const [isDisabled, setIsDisabled] = useState(true);

    const [initialSettingsForm, setInitialSettingsForm] = useState<
        NotificationSettingDetails | undefined
    >();

    useEffect(() => {
        fetchNotificationSettings();
    }, []);

    async function fetchNotificationSettings() {
        setIsDisabled(true);

        if (session.data?.token.sub) {
            try {
                const result =
                    await createApiClient().userAccount_GetNotificationSettings(
                        session.data?.token.sub
                    );

                setInitialSettingsForm(result);
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
                        }
                    );

                methods.reset(result);
            } catch {
                await alertError();
            }
        }

        setIsDisabled(false);
    }

    return (
        <Fragment>
            <SimpleAppBar backHref="/profile/settings" title="Notification" />

            <ConditionalRender
                condition={!!initialSettingsForm}
                alternative={
                    <div className="text-center mt-3">
                        <small className="spinner-border spinner-border-sm ms-3" />
                    </div>
                }
            >
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

                        <div className="text-center mt-5">
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
