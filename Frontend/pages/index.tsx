import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Fragment } from "react";
import { signIn } from "../src/functions/auth";
import { NextPageWithLayout } from "./_app";

const IndexPage: NextPageWithLayout = () => {
    function handleClick(): void {
        signIn();
    }

    return (
        <Fragment>
            <div className="fixed-top mt-3 ms-3">
                <h3 className="display-3 fw-bold text-white">BeFit</h3>
            </div>

            <div className="fixed-top mt-3 me-3 text-end">
                <button
                    className="btn p-0 m-0 shadow-none"
                    style={{ color: "#28f1b5" }}
                    onClick={handleClick}
                >
                    <div className="display-4">Login</div>
                </button>
            </div>

            <div
                style={{
                    background:
                        'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/images/main.jpeg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="container">
                    <div className="row vh-100 justify-content-center align-items-center">
                        <div
                            className="col px-4 position-relative"
                            style={{ top: 100 }}
                        >
                            <h1 className="display-1 text-white fw-bold">
                                FIT <br /> YOUR <br /> PARTNER
                            </h1>

                            <h5 style={{ color: "#28f1b5" }}>
                                Be Fit everyday where ever you are
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
            props: {},
        };
    }

    return {
        props: {},
    };
};

export default IndexPage;
