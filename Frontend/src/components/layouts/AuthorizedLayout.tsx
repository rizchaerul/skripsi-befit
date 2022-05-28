import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionalComponent } from "react";
import {
    BsBarChartLine,
    BsBarChartLineFill,
    BsCalendarCheck,
    BsCalendarCheckFill,
    BsGear,
    BsGearFill,
    BsHouseDoor,
    BsHouseDoorFill,
    BsPeople,
    BsPeopleFill,
    BsPerson,
    BsPersonFill,
    BsPlusCircle,
    BsPlusCircleFill,
} from "react-icons/bs";
import { ConditionalRender } from "../ConditionalRender";

interface AuthorizedLayoutProps {
    isNavbarFixed?: boolean;
    withContainer?: boolean;
    withBottomNav?: boolean;
    darkMode?: boolean;
}

const iconSize = 24;
const bottomBarHeight = 56;

let navs = [
    {
        href: "/home",
        regularIcon: <BsHouseDoor size={iconSize} />,
        filledIcon: <BsHouseDoorFill size={iconSize} />,
    },
    {
        href: "/workout",
        regularIcon: <BsCalendarCheck size={iconSize} />,
        filledIcon: <BsCalendarCheckFill size={iconSize} />,
    },
    {
        href: "/add-workout",
        regularIcon: <BsPlusCircle size={iconSize} />,
        filledIcon: <BsPlusCircleFill size={iconSize} />,
    },
    {
        href: "/report",
        regularIcon: <BsBarChartLine size={iconSize} />,
        filledIcon: <BsBarChartLineFill size={iconSize} />,
    },
    {
        href: "/profile",
        regularIcon: <BsPerson size={iconSize} />,
        filledIcon: <BsPersonFill size={iconSize} />,
    },
];

const adminNavs = [
    {
        href: "/home",
        regularIcon: <BsHouseDoor size={iconSize} />,
        filledIcon: <BsHouseDoorFill size={iconSize} />,
    },
    {
        href: "/admin/workout-category",
        regularIcon: <BsGear size={iconSize} />,
        filledIcon: <BsGearFill size={iconSize} />,
    },
    {
        href: "/admin/user",
        regularIcon: <BsPeople size={iconSize} />,
        filledIcon: <BsPeopleFill size={iconSize} />,
    },
    {
        href: "/profile",
        regularIcon: <BsPerson size={iconSize} />,
        filledIcon: <BsPersonFill size={iconSize} />,
    },
];

/**
 * Layout component for authorized page.
 */
export const AuthorizedLayout: FunctionalComponent<AuthorizedLayoutProps> = (
    props
) => {
    const {
        withContainer = true,
        withBottomNav = true,
        darkMode = false,
    } = props;
    const router = useRouter();

    const session = useSession({
        required: true,
    });

    if (session.data?.token.isAdmin) {
        navs = adminNavs;
    }

    return (
        <ConditionalRender condition={session.status === "authenticated"}>
            <ConditionalRender
                condition={withContainer}
                alternative={props.children}
            >
                <div className="container">{props.children}</div>
            </ConditionalRender>

            {withBottomNav && <div style={{ height: bottomBarHeight }} />}

            {withBottomNav && (
                <div
                    className={`fixed-bottom ${
                        darkMode ? "bg-dark" : "bg-primary"
                    }`}
                >
                    <div className="container">
                        <div
                            className="d-flex justify-content-around align-items-center"
                            style={{ height: bottomBarHeight }}
                        >
                            {navs.map((n) => (
                                <Link key={n.href} href={n.href} passHref>
                                    <a className="text-black">
                                        <ConditionalRender
                                            condition={router.route.startsWith(
                                                n.href
                                            )}
                                            alternative={n.regularIcon}
                                        >
                                            {n.filledIcon}
                                        </ConditionalRender>
                                    </a>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </ConditionalRender>
    );
};

/**
 * @deprecated please don't use this. Use createAuthorizeLayout instead.
 */
export const getAuthorizedLayout = (page: React.ReactElement) => (
    <AuthorizedLayout>{page}</AuthorizedLayout>
);

/**
 * @deprecated please don't use this. Use createAuthorizeLayout instead.
 */
export const getFixedNavbarAuthorizedLayout = (page: React.ReactElement) => (
    <AuthorizedLayout isNavbarFixed>{page}</AuthorizedLayout>
);

export function createAuthorizeLayout(options?: AuthorizedLayoutProps) {
    const getAuthorizedLayout = (page: React.ReactElement) => (
        <AuthorizedLayout {...options}>{page}</AuthorizedLayout>
    );

    return getAuthorizedLayout;
}
