import { Fragment } from "react";
import { ProgressCategory } from "../../src/clients/ApiClient";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { NextPageWithLayout } from "../_app";
import { ReportComponent } from "./weight";

const FatPercentagePage: NextPageWithLayout = () => {
    return (
        <Fragment>
            <ReportComponent
                category={ProgressCategory.FatPercentage}
                reportName="Fat Percentage"
                unit="%"
                imgsrc="/images/fat.jpeg"
                tips="Going to bed a bit earlier or setting your alarm clock a little later is a simple strategy to help you react and maintain a healthy weight."
            />
        </Fragment>
    );
};

FatPercentagePage.getLayout = createAuthorizeLayout({
    withContainer: false,
    withBottomNav: false,
});

export default FatPercentagePage;
