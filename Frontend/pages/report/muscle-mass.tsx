import { Fragment } from "react";
import { ProgressCategory } from "../../src/clients/ApiClient";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { NextPageWithLayout } from "../_app";
import { ReportComponent } from "./weight";

const MuscleMassPage: NextPageWithLayout = () => {
    return (
        <Fragment>
            <ReportComponent
                category={ProgressCategory.MuscleMass}
                reportName="Muscle Mass"
                unit=""
                imgsrc="/images/muscle.webp"
                tips="Eating the right thing at the right time is crucial for helping you boost your muscle mass. The easiest way is to eat your breakfast, lunch and dinner as usual, interspersed with meals post workout, pre bed and with two snack in between."
            />
        </Fragment>
    );
};

MuscleMassPage.getLayout = createAuthorizeLayout({
    withContainer: false,
    withBottomNav: false,
});

export default MuscleMassPage;
