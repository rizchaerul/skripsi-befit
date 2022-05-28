import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionalComponent, MouseEventHandler } from "react";
import { signOut } from "../functions/auth";
import { ConditionalRender } from "./ConditionalRender";

export const Navbar: FunctionalComponent<{
    isNavbarFixed?: boolean;
}> = (props) => {
    const session = useSession();

    const handleSignOutClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();
        signOut({ callbackUrl: "/" });
    };

    let navbarClassName = "navbar navbar-dark navbar-expand";
    navbarClassName = props.isNavbarFixed
        ? navbarClassName.concat(" fixed-top")
        : navbarClassName.concat(" sticky-top");

    return (
        <div className={navbarClassName} style={{ backgroundColor: "#123f89" }}>
            <div className="container">
                <Link href="/" passHref>
                    <a className="navbar-brand">Befit</a>
                </Link>

                <div className="navbar-nav">
                    <ConditionalRender
                        condition={session.status === "authenticated"}
                    >
                        <NavLink href="/forum" name="Forum" />

                        <a
                            href=""
                            className="nav-link"
                            onClick={handleSignOutClick}
                        >
                            Sign Out
                        </a>
                    </ConditionalRender>
                </div>
            </div>
        </div>
    );
};

// TODO: Fix this.
// eslint-disable-next-line @typescript-eslint/member-delimiter-style
const NavLink: FunctionalComponent<{ href: string; name: string }> = (
    props
) => {
    const router = useRouter();

    function getNavLinkClassName(): string {
        if (router.pathname.includes(props.href)) {
            return "nav-link active";
        }

        return "nav-link";
    }

    return (
        <Link href={props.href} passHref>
            <a className={getNavLinkClassName()}>{props.name}</a>
        </Link>
    );
};
