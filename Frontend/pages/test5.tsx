import { NextPage } from "next";
import { Fragment } from "react";

const Test5Page: NextPage = () => {
    return (
        <Fragment>
            <div style={{ height: 50 }}>
                <div className="ratio ratio-1x1 bg-secondary">
                    <div>1x1</div>
                </div>
            </div>
        </Fragment>
    );
};

export default Test5Page;
