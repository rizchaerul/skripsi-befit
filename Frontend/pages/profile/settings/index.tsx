import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import {
    BsArrowRightSquare,
    BsBell,
    BsPersonCircle,
    BsQuestionCircle,
    BsShieldLock,
} from "react-icons/bs";
import { SimpleAppBar } from "../../../src/components/AppBar";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import { signOut } from "../../../src/functions/auth";
import { NextPageWithLayout } from "../../_app";

const SettingsPage: NextPageWithLayout = () => {
    const session = useSession();
    function handleSignOut() {
        signOut({ callbackUrl: "/" });
    }

    return (
        <Fragment>
            <SimpleAppBar backHref="/profile" title="Settings" />

            <div className="d-flex flex-column">
                {session.data?.token.isAdmin !== true && (
                    <Link href="/profile/settings/notification">
                        <a className="py-3 d-flex justify-content-between fw-bold text-decoration-none text-black">
                            <div>
                                <BsBell className="me-2" size={30} />
                                Notification
                            </div>

                            <div>
                                <BsArrowRightSquare size={30} />
                            </div>
                        </a>
                    </Link>
                )}

                <Link href="/profile/settings/privacy">
                    <a className="py-3 d-flex justify-content-between fw-bold text-decoration-none text-black">
                        <div>
                            <BsShieldLock className="me-2" size={30} />
                            Privacy
                        </div>

                        <div>
                            <BsArrowRightSquare size={30} />
                        </div>
                    </a>
                </Link>

                {!session.data?.token.isAdmin && (
                    <Link href="/profile/settings/account">
                        <a className="py-3 d-flex justify-content-between fw-bold text-decoration-none text-black">
                            <div>
                                <BsPersonCircle className="me-2" size={30} />
                                Account
                            </div>

                            <div>
                                <BsArrowRightSquare size={30} />
                            </div>
                        </a>
                    </Link>
                )}

                {session.data?.token.isAdmin !== true && (
                    <Link href="/guide">
                        <a className="py-3 d-flex justify-content-between fw-bold text-decoration-none text-black">
                            <div>
                                <BsQuestionCircle className="me-2" size={30} />
                                Guide
                            </div>

                            <div>
                                <BsArrowRightSquare size={30} />
                            </div>
                        </a>
                    </Link>
                )}
            </div>

            <button
                type="button"
                className="btn btn-link fw-bold text-decoration-none mt-3 p-0"
                onClick={handleSignOut}
            >
                Logout Account
            </button>
        </Fragment>
    );
};

SettingsPage.getLayout = createAuthorizeLayout();

export default SettingsPage;
