/* eslint-disable @next/next/no-html-link-for-pages */
import { GetServerSideProps } from "next";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionalComponent, useEffect, useRef, useState } from "react";
import { BsEnvelope, BsLock } from "react-icons/bs";
import { alertError } from "../../src/functions/alert";

interface LoginPageProps {
    csrfToken?: string;
}

const LoginPage: FunctionalComponent<LoginPageProps> = (props) => {
    const router = useRouter();
    const { error } = router.query;

    const [isDisabled, setDisabled] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const body = document.getElementsByTagName("body")[0];
        if (body) {
            body.classList.add("bg-primary");
        }

        if (error === "CredentialsSignin") {
            alertError("Wrong credentials.");
        }
    }, []);

    function handleSubmit() {
        setDisabled(true);
        formRef.current?.submit();
    }

    return (
        <div className="container">
            <div className="d-flex flex-column vh-100 align-items-center">
                <div className="mt-3 ms-3 w-100 mb-5">
                    <a
                        href="/"
                        className="display-3 fw-bold text-white text-decoration-none"
                    >
                        BeFit
                    </a>
                </div>

                <div className="mt-5 w-100 px-4">
                    <form
                        method="POST"
                        action="/api/auth/callback/credentials"
                        ref={formRef}
                    >
                        <fieldset disabled={isDisabled}>
                            <h3 className="display-3 fw-bold text-center text-white mb-5">
                                Login
                            </h3>

                            {/* <AuthInput
                                type="hidden"
                                name="csrfToken"
                                smart={false}
                                defaultValue={props.csrfToken}
                            /> */}

                            <input
                                type="hidden"
                                name="csrfToken"
                                defaultValue={props.csrfToken}
                            />

                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text bg-dark border-0 rounded-4">
                                        <BsEnvelope size={30} />
                                    </span>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        className="form-control form-control-lg shadow-none rounded-4"
                                        style={{ backgroundColor: "#ede8e2" }}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text bg-dark border-0 rounded-4">
                                        <BsLock size={30} />
                                    </span>

                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="form-control form-control-lg shadow-none rounded-4"
                                        style={{ backgroundColor: "#ede8e2" }}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="text-end text-white mb-4">
                                <a href="/guide" className="text-white">
                                    App guide
                                </a>
                            </div>

                            {/* <AuthInput
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                smart={false}
                                icon={<BsEnvelope size={30} />}
                                required
                            />

                            <AuthInput
                                type="password"
                                name="password"
                                placeholder="Password"
                                smart={false}
                                icon={<BsLock size={30} />}
                                required
                            /> */}

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    className="btn btn-dark w-75 text-white fw-bold shadow rounded-5"
                                    onClick={handleSubmit}
                                >
                                    Login
                                    {isDisabled && (
                                        <small className="spinner-border spinner-border-sm ms-3" />
                                    )}
                                </button>
                            </div>

                            <div className="text-center text-white mt-4">
                                Don&apos;t have an account yet?{" "}
                                <a href="/auth/sign-up" className="text-white">
                                    Sign Up
                                </a>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<LoginPageProps> = async (
    context
) => {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
};

export default LoginPage;
