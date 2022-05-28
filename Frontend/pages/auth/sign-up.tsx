import Joi from "joi";
import Link from "next/link";
import { FunctionalComponent, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BsEnvelope, BsLock, BsPerson } from "react-icons/bs";
import { ApiException } from "../../src/clients/ApiClient";
import SmartForm from "../../src/components/forms/SmartForm";
import { AuthInput } from "../../src/components/pages/auth/AuthInput";
import { alertError, alertSuccess } from "../../src/functions/alert";
import { signIn } from "../../src/functions/auth";
import { createApiClient } from "../../src/functions/create-api-client";

interface SignUpForm {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const initialValues: SignUpForm = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const schema = Joi.object<SignUpForm>({
    fullName: Joi.string().required(),
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "password doesn't match",
        }),
});

const SignUpPage: FunctionalComponent = () => {
    const [isDisabled, setDisabled] = useState(false);

    // Only runs on first render.
    useEffect(() => {
        const body = document.getElementsByTagName("body")[0];

        if (body) {
            body.classList.add("bg-primary");
        }
    }, []);

    async function handleSubmit(
        data: SignUpForm,
        methods: UseFormReturn<SignUpForm>
    ) {
        setDisabled(true);

        try {
            await createApiClient().userAccount_SignUp({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            });

            methods.reset();
            await alertSuccess("You will be redirected to login page.");
            signIn();
        } catch (err) {
            console.error(err);

            const error = err as { status: number };

            if (error.status == 400) {
                const error = err as ApiException;
                await alertError(error.response);
            } else {
                await alertError();
            }
        }

        setDisabled(false);
    }

    return (
        <div className="container">
            <div className="d-flex flex-column vh-100 align-items-center">
                <div className="mt-3 ms-3 w-100">
                    <Link href="/" passHref>
                        <a className="display-3 fw-bold text-white text-decoration-none">
                            BeFit
                        </a>
                    </Link>
                </div>

                <div className="w-100 px-4 mt-5 pt-4">
                    <SmartForm.Form
                        disabled={isDisabled}
                        schema={schema}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        <h3 className="display-3 fw-bold text-center text-white mb-5">
                            Sign Up
                        </h3>

                        <AuthInput
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            icon={<BsPerson size={30} />}
                        />

                        <AuthInput
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            icon={<BsEnvelope size={30} />}
                        />

                        <AuthInput
                            type="password"
                            name="password"
                            placeholder="Password"
                            icon={<BsLock size={30} />}
                        />

                        <AuthInput
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            icon={<BsLock size={30} />}
                        />

                        <div className="text-center mt-5">
                            <button
                                type="submit"
                                className="btn btn-dark w-75 text-white fw-bold shadow rounded-5"
                            >
                                Sign Up
                                {isDisabled && (
                                    <small className="spinner-border spinner-border-sm ms-3" />
                                )}
                            </button>
                        </div>

                        <div className="text-center text-white mt-4">
                            Already have an account?{" "}
                            <span
                                className="text-white text-decoration-underline"
                                style={{ cursor: "pointer" }}
                                onClick={signIn}
                            >
                                Login
                            </span>
                        </div>
                    </SmartForm.Form>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
