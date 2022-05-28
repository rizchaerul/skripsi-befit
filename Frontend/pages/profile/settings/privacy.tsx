import Joi from "joi";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { ApiException } from "../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../src/components/AppBar";
import SmartForm, {
    SmartFormSubmit,
} from "../../../src/components/forms/SmartForm";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import { alertError } from "../../../src/functions/alert";
import { createApiClient } from "../../../src/functions/create-api-client";
import { nameof } from "../../../src/functions/nameof";
import { NextPageWithLayout } from "../../_app";

interface ChangePasswordForm {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

const initialValues: ChangePasswordForm = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
};

const schema = Joi.object<ChangePasswordForm>({
    oldPassword: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Password doesn't match",
        }),
});

const PrivacyPage: NextPageWithLayout = () => {
    const session = useSession();

    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit: SmartFormSubmit<ChangePasswordForm> = async (data) => {
        setIsDisabled(true);

        try {
            if (session.data?.token.sub) {
                await createApiClient().userAccount_UpdatePassword(
                    session.data?.token.sub,
                    {
                        oldPassword: data.oldPassword,
                        newPassword: data.password,
                    }
                );
            }
        } catch (err) {
            const error = err as ApiException;
            alertError(error.response);
        }

        setIsDisabled(false);
    };

    return (
        <Fragment>
            <SimpleAppBar backHref="/profile/settings" title="Privacy" />

            <h3 className="fw-bold my-4">Change Password</h3>

            <SmartForm.Form
                initialValues={initialValues}
                schema={schema}
                disabled={isDisabled}
                onSubmit={handleSubmit}
            >
                <div className="mb-3">
                    <div className="form-floating">
                        <SmartForm.Input
                            type="password"
                            name={nameof<ChangePasswordForm>("oldPassword")}
                            className="form-control"
                            id="floatingInput"
                            placeholder="-"
                        />

                        <label htmlFor="floatingInput">Old Password</label>
                    </div>

                    <small className="mt-1 w-100 text-danger">
                        <SmartForm.Error
                            name={nameof<ChangePasswordForm>("oldPassword")}
                        />
                    </small>
                </div>

                <div className="mb-3">
                    <div className="form-floating">
                        <SmartForm.Input
                            type="password"
                            name={nameof<ChangePasswordForm>("password")}
                            className="form-control"
                            id="floatingInput"
                            placeholder="-"
                        />

                        <label htmlFor="floatingInput">New Password</label>
                    </div>

                    <small className="mt-1 w-100 text-danger">
                        <SmartForm.Error
                            name={nameof<ChangePasswordForm>("password")}
                        />
                    </small>
                </div>

                <div className="mb-3">
                    <div className="form-floating">
                        <SmartForm.Input
                            type="password"
                            name={nameof<ChangePasswordForm>("confirmPassword")}
                            className="form-control"
                            id="floatingInput"
                            placeholder="-"
                        />

                        <label htmlFor="floatingInput">Confirm Password</label>
                    </div>

                    <small className="mt-1 w-100 text-danger">
                        <SmartForm.Error
                            name={nameof<ChangePasswordForm>("confirmPassword")}
                        />
                    </small>
                </div>

                <div className="text-center mt-5">
                    <button
                        type="submit"
                        className="btn btn-dark fw-bold rounded-5"
                    >
                        Change Password
                        {isDisabled && (
                            <small className="spinner-border spinner-border-sm ms-3" />
                        )}
                    </button>
                </div>
            </SmartForm.Form>
        </Fragment>
    );
};

PrivacyPage.getLayout = createAuthorizeLayout();

export default PrivacyPage;
