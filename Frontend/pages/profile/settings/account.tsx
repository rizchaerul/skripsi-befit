import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { UserAccountDetails } from "../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../src/components/AppBar";
import { ConditionalRender } from "../../../src/components/ConditionalRender";
import SmartForm from "../../../src/components/forms/SmartForm";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import { ImageConstants } from "../../../src/constants/ImageConstants";
import { alertError } from "../../../src/functions/alert";
import { createApiClient } from "../../../src/functions/create-api-client";
import { getBase64 } from "../../../src/functions/get-base64";
import { NextPageWithLayout } from "../../_app";

const AccountPage: NextPageWithLayout = () => {
    const session = useSession();

    const [isDisabled, setIsDisabled] = useState(true);
    // const [isModalOpened, setIsModalOpened] = useState(false);

    const [initialUserAccountForm, setInitialUserAccountForm] = useState<
        | (UserAccountDetails & {
              picture?: string;
          })
        | undefined
    >();

    useEffect(() => {
        fetchUserAccount();
    }, []);

    async function fetchUserAccount() {
        setIsDisabled(true);

        if (session.data?.token.sub) {
            try {
                const result =
                    await createApiClient().userAccount_GetUserAccountById(
                        session.data?.token.sub
                    );

                setInitialUserAccountForm(result);
            } catch {
                await alertError();
            }
        }

        setIsDisabled(false);
    }

    return (
        <Fragment>
            <SimpleAppBar backHref="/profile/settings" title="Edit Profile" />

            <div className="mt-3">
                <ConditionalRender
                    condition={!!initialUserAccountForm}
                    alternative={
                        <div className="text-center">
                            <small className="spinner-border spinner-border-sm ms-3" />
                        </div>
                    }
                >
                    <div className="text-center my-4">
                        <img
                            src={
                                `${
                                    initialUserAccountForm?.pictureBase64
                                }?dateTime=${new Date().toISOString()}` ??
                                ImageConstants.defaultPictureSource
                            }
                            className="rounded-circle shadow-sm"
                            alt="avatar"
                            height={100}
                            width={100}
                            // onClick={() => setIsModalOpened(true)}
                        />
                    </div>

                    <SmartForm.Form
                        disabled={isDisabled}
                        initialValues={initialUserAccountForm}
                        onSubmit={async (data, methods) => {
                            setIsDisabled(true);

                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            const files = data.picture as FileList;

                            const file = files[0];
                            let fileBase64String = "";

                            if (file) {
                                fileBase64String = await getBase64(file);
                            }

                            if (session.data?.token.sub) {
                                try {
                                    const result =
                                        await createApiClient().userAccount_UpdateUserAccount(
                                            session.data?.token.sub,
                                            {
                                                email: data.email ?? "",
                                                fullName: data.fullName ?? "",
                                                pictureBase64: fileBase64String,
                                            }
                                        );

                                    setInitialUserAccountForm(result);
                                    methods.reset(result);
                                } catch {
                                    await alertError();
                                }
                            }

                            setIsDisabled(false);
                        }}
                    >
                        {/* <Modal
                            show={isModalOpened}
                            onHide={() => setIsModalOpened(false)}
                        >
                            <Modal.Header closeButton>
                                <h5 className="modal-title">Upload Image</h5>
                            </Modal.Header>

                            <div className="modal-body">
                                <SmartForm.Input
                                    type="file"
                                    name="picture"
                                    className="form-control"
                                    options={{
                                        required: {
                                            value: true,
                                            message: "dwdd",
                                        },
                                        validate: async () => {
                                            await new Promise((r) =>
                                                setTimeout(r, 2000)
                                            );
                                            return "dwd";
                                        },
                                    }}
                                />

                                <small className="mt-1 w-100 text-danger">
                                    <SmartForm.Error name="picture" />
                                </small>
                            </div>
                        </Modal> */}

                        <div className="mb-3">
                            <label htmlFor="picture" className="form-label">
                                Upload Profile Picture
                            </label>

                            <SmartForm.Input
                                type="file"
                                accept="image/png,image/jpeg"
                                name="picture"
                                id="picture"
                                className="form-control"
                                options={{
                                    validate: async (value) => {
                                        const files = value as FileList;

                                        if (files.length > 0) {
                                            const file = value[0] as File;

                                            if (
                                                file.type !== "image/png" &&
                                                file.type !== "image/jpeg"
                                            ) {
                                                return "Must be a JPG or PNG file.";
                                            }

                                            if (file.size > 1_000_000) {
                                                return "Maximum file size is 1mb.";
                                            }
                                        }

                                        return true;
                                    },
                                }}
                            />

                            <small className="mt-1 w-100 text-danger">
                                <SmartForm.Error name="picture" />
                            </small>
                        </div>

                        <div className="mb-3">
                            <div className="form-floating">
                                <SmartForm.Input
                                    type="text"
                                    name="fullName"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="-"
                                    options={{
                                        required: {
                                            value: true,
                                            message: "Name is required.",
                                        },
                                    }}
                                />

                                <label htmlFor="floatingInput">Full Name</label>
                            </div>

                            <small className="mt-1 w-100 text-danger">
                                <SmartForm.Error name="fullName" />
                            </small>
                        </div>

                        <div className="mb-3">
                            <div className="form-floating">
                                <SmartForm.Input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="-"
                                    options={{
                                        required: {
                                            value: true,
                                            message: "Email is required.",
                                        },
                                    }}
                                />

                                <label htmlFor="floatingInput">
                                    Email address
                                </label>
                            </div>

                            <small className="mt-1 w-100 text-danger">
                                <SmartForm.Error name="email" />
                            </small>
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
                    </SmartForm.Form>
                </ConditionalRender>
            </div>
        </Fragment>
    );
};

AccountPage.getLayout = createAuthorizeLayout();

export default AccountPage;
