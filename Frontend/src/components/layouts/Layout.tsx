import { Fragment, FunctionalComponent } from "react";
import { Navbar } from "../Navbar";

/**
 * Layout component for public page.
 */
export const Layout: FunctionalComponent<{
    isNavbarFixed?: boolean;
}> = (props) => {
    return (
        <Fragment>
            <Navbar isNavbarFixed={props.isNavbarFixed} />

            <div className="container">{props.children}</div>
        </Fragment>
    );
};

export const getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export const getFixedNavbarLayout = (page: React.ReactElement) => (
    <Layout isNavbarFixed>{page}</Layout>
);
