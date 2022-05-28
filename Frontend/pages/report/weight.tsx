import {
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { useRouter } from "next/router";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Modal, ProgressBar } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import ReactDatePicker from "react-datepicker";
import { BsChevronLeft, BsDash, BsGear, BsPlus } from "react-icons/bs";
import useSWR from "swr";
import { ApiClient, ProgressCategory } from "../../src/clients/ApiClient";
import SmartForm from "../../src/components/forms/SmartForm";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { alertError, alertSuccess } from "../../src/functions/alert";
import { createApiClient } from "../../src/functions/create-api-client";
import { getMonthName } from "../../src/functions/get-month-name";
import { nameof } from "../../src/functions/nameof";
import { useBg } from "../../src/hooks/useBg";
import { NextPageWithLayout } from "../_app";

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WeightPage: NextPageWithLayout = () => {
    return (
        <Fragment>
            <ReportComponent
                category={ProgressCategory.Weight}
                reportName="Weight"
                unit="kg"
                imgsrc="/images/weight.jpeg"
                tips="Skipping breakfast will not help you lose weight. You could miss out on essential nutrients and you may end up snacking more throughout the day because you'll feel hungry."
            />
        </Fragment>
    );
};

export const ReportComponent: FunctionComponent<{
    reportName: string;
    unit: string;
    imgsrc: string;
    tips: string;
    category: ProgressCategory;
}> = (props) => {
    const { reportName, unit, imgsrc, tips, category } = props;

    const router = useRouter();
    useBg("bg-black");

    const [menu, setMenu] = useState(0);
    const [loading, setLoading] = useState(false);
    // const [loadingData, setLoadingData] = useState(true);
    const [value, setValue] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [settingLoading, setSettingLoading] = useState(false);

    const { data, mutate } = useSWR(
        [nameof<ApiClient>("report_GetCurrentReport"), props.category],
        async () => createApiClient().report_GetCurrentReport(category)
    );

    const date = new Date();
    const current = data?.current ?? 0;
    const targetData = data?.target ?? 0;

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await createApiClient().report_GetCurrentReport(
                    category
                );

                setValue(res.current ?? 0);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        })();
    }, []);

    function getNow() {
        const current = data?.current ?? 0;
        const target = data?.target ?? 0;
        const constant = 25;

        if (current <= target) {
            const calculation =
                ((current - (target - constant)) / constant) * 100;

            if (calculation >= 0) {
                return ((current - (target - constant)) / constant) * 100;
            }

            return 0;
        }

        if (category === ProgressCategory.MuscleMass) {
            return 100;
        }

        return ((current - target) / constant) * 100;
    }

    function getClassName() {
        if (props.category === ProgressCategory.Weight) {
            if (current < targetData) {
                return "abu";
            }

            if (current === targetData) {
                return "success";
            }

            if (current > targetData) {
                return "danger";
            }
        }

        if (props.category === ProgressCategory.MuscleMass) {
            if (current < targetData) {
                return "danger";
            }

            if (current === targetData) {
                return "success";
            }

            if (current > targetData) {
                return "success";
            }
        }

        if (props.category === ProgressCategory.FatPercentage) {
            if (current < targetData) {
                return "success";
            }

            if (current === targetData) {
                return "success";
            }

            if (current > targetData) {
                return "danger";
            }
        }

        return current <= targetData ? "primary" : "danger";
    }

    return (
        <Fragment>
            <div
                className="text-black top-cover"
                style={{
                    // height: getHeight(),
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url('${imgsrc}')`,
                }}
            >
                <BsChevronLeft
                    size={32}
                    className="ms-1 mt-2"
                    onClick={() => router.push("/report")}
                />
            </div>

            {/* <div className="d-flex text-black">
                <div className="bg-secondary flex-grow-1 fs-3">
                    <h6>CURRENT HEIGHT</h6>
                    <h1>160 CM</h1>
                </div>

                <div className="bg-secondary flex-grow-1 fs-3">
                    <h6>CURRENT </h6>
                    <h1>160 CM</h1>
                </div>
            </div> */}

            <div className="container">
                <div className="text-center text-white pt-3">
                    <h1>
                        {reportName} Report{" "}
                        <BsGear onClick={() => setShowModal(true)} />
                    </h1>
                </div>
            </div>

            {data === undefined && (
                <div className="text-center">
                    <LoadingIndicator loading className="text-white" />
                </div>
            )}

            {data !== undefined && (
                <Fragment>
                    {(data?.target === null || data?.target === undefined) && (
                        <Fragment>
                            <div className="container pt-3">
                                <div className="alert alert-warning">
                                    You haven&apos;t set a target for your{" "}
                                    {reportName.toLowerCase()} report, please
                                    click the gear icon to setting up target.
                                </div>
                            </div>
                        </Fragment>
                    )}

                    {data?.target !== null && data?.target !== undefined && (
                        <Fragment>
                            <div className="d-flex text-white mt-3">
                                <div
                                    className={`${
                                        menu === 0 ? "bg-dark" : "bg-secondary"
                                    } flex-grow-1 text-center fs-3`}
                                    onClick={() => setMenu(0)}
                                >
                                    Input
                                </div>
                                <div
                                    className={`${
                                        menu === 1 ? "bg-dark" : "bg-secondary"
                                    } flex-grow-1 text-center fs-3`}
                                    onClick={() => setMenu(1)}
                                >
                                    Chart
                                </div>
                            </div>

                            {menu === 1 && (
                                <ChartComponent
                                    target={targetData}
                                    category={category}
                                    reportName={reportName}
                                />
                            )}

                            {menu === 0 && (
                                <Fragment>
                                    {data?.target !== null &&
                                        data?.target !== undefined && (
                                            <Fragment>
                                                <div className="container text-white mt-3">
                                                    <h5>
                                                        {data?.current ?? 0} of{" "}
                                                        {data?.target} {unit}
                                                    </h5>

                                                    <ProgressBar
                                                        className="rounded-pill"
                                                        now={getNow()}
                                                        variant={getClassName()}
                                                    />
                                                </div>
                                                <h1 className="text-center text-white mt-3">
                                                    {getMonthName(date)}{" "}
                                                    {date.getFullYear()}
                                                </h1>
                                                <h3 className="text-center text-muted mt-3">
                                                    Input your {reportName}
                                                </h3>

                                                <fieldset disabled={loading}>
                                                    <div className=" mt-0 py-3 d-flex justify-content-center align-items-center">
                                                        <button
                                                            className="btn btn-primary text-white rounded-circle me-3 p-0"
                                                            style={{
                                                                height: 48,
                                                                width: 48,
                                                            }}
                                                            disabled={loading}
                                                            onClick={() => {
                                                                if (
                                                                    value - 1 >=
                                                                    1
                                                                ) {
                                                                    setValue(
                                                                        value -
                                                                            1
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {/* {loading && <LoadingIndicator />} */}
                                                            <BsDash size={32} />
                                                        </button>

                                                        <div
                                                            className="text-center text-white flex-shrink-1"
                                                            style={{
                                                                width: 100,
                                                            }}
                                                        >
                                                            <input
                                                                type="number"
                                                                step="any"
                                                                className="form-control form-control-lg bg-black text-white"
                                                                value={value}
                                                                onChange={(e) =>
                                                                    setValue(
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                            />

                                                            {/* <BsWater size={64} /> */}
                                                            {/* <h1>{data?.perGlass} ml/glass</h1> */}
                                                        </div>

                                                        <button
                                                            className="btn btn-primary text-white rounded-circle ms-3 p-0"
                                                            style={{
                                                                height: 48,
                                                                width: 48,
                                                            }}
                                                            disabled={loading}
                                                            onClick={() =>
                                                                setValue(
                                                                    value + 1
                                                                )
                                                            }

                                                            // onClick={() => updateProgress(true)}
                                                        >
                                                            {/* {loading && <LoadingIndicator />} */}
                                                            <BsPlus size={32} />
                                                        </button>
                                                    </div>
                                                </fieldset>

                                                <h1 className="text-center text-muted  mb-3">
                                                    {unit}
                                                </h1>
                                                <div className="text-center">
                                                    <button
                                                        className="btn btn-primary rounded-pill"
                                                        disabled={
                                                            loading ||
                                                            isNaN(value) ||
                                                            value === 0
                                                        }
                                                        onClick={async () => {
                                                            setLoading(true);

                                                            try {
                                                                await createApiClient().report_InsertReportData(
                                                                    category,
                                                                    value
                                                                );
                                                                await mutate();
                                                            } catch {
                                                                alertError();
                                                            } finally {
                                                                setLoading(
                                                                    false
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {loading && (
                                                            <LoadingIndicator className="me-2" />
                                                        )}
                                                        Save {reportName}
                                                    </button>
                                                </div>
                                            </Fragment>
                                        )}
                                </Fragment>
                            )}

                            <div className="bg-secondary fixed-bottom-res">
                                <div className="container">
                                    <h3 className="border-bottom border-dark py-1 ms-1">
                                        {reportName} Tips
                                    </h3>
                                    <p className="p-2 small mb-0">{tips}</p>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </Fragment>
            )}

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
                fullscreen
            >
                <Modal.Header closeButton>
                    <Modal.Title>Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="container">
                        <SmartForm.FormV2
                            disabled={settingLoading}
                            onSubmit={async (data) => {
                                setSettingLoading(true);
                                try {
                                    await createApiClient().report_SetReportTarget(
                                        category,
                                        data.target
                                    );
                                    await mutate();
                                    alertSuccess("Setting is saved!");
                                } catch (err) {
                                    console.error(err);
                                } finally {
                                    setSettingLoading(false);
                                }
                            }}
                            initialValues={{
                                target: data?.target,
                            }}
                        >
                            <div className="mb-3">
                                <label htmlFor="target" className="form-label">
                                    Set target {unit ? `(${unit})` : ""}
                                </label>

                                <SmartForm.Input
                                    type="number"
                                    name="target"
                                    step="any"
                                    id="target"
                                    className="form-control"
                                    // pattern="^\d*(\.\d{0,2})?$"
                                    options={{
                                        // pattern: {
                                        //     value: new RegExp("^d*(.d{0,2})?$"),
                                        //     message: "Must be a number",
                                        // },
                                        required: {
                                            value: true,
                                            message: "Target is required.",
                                        },
                                        min: {
                                            value: 0,
                                            message: "minimum target is 0.",
                                        },
                                    }}
                                />

                                <small className="mt-1 w-100 text-danger">
                                    <SmartForm.Error name="target" />
                                </small>
                            </div>

                            <div className="text-center">
                                <button className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </SmartForm.FormV2>
                    </div>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

const ChartComponent: FunctionComponent<{
    reportName: string;
    category: ProgressCategory;
    target: number;
}> = (props) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showModal, setShowModal] = useState(false);

    const { data } = useSWR(
        [
            nameof<ApiClient>("report_GetChartData"),
            selectedDate?.getFullYear(),
            props.category,
        ],
        async () =>
            createApiClient().report_GetChartData(
                selectedDate?.toISOString(),
                props.category
            )
    );

    // console.log(data);

    return (
        <Fragment>
            <h4 className="text-white text-center mt-3">
                {selectedDate?.getFullYear()}{" "}
                <BsGear onClick={() => setShowModal(true)} />
            </h4>

            <div>
                <div className="bg-secondary py-3">
                    <div
                        className="container"
                        style={{ maxHeight: 750, maxWidth: 750 }}
                    >
                        <Line
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                        // position: "top" as const,
                                    },
                                    title: {
                                        display: false,
                                        // text: "Chart.js Bar Chart",
                                    },
                                },
                            }}
                            data={{
                                labels: data?.map((d) =>
                                    getMonthName(
                                        new Date(
                                            new Date().getFullYear(),
                                            d.month - 1
                                        )
                                    )
                                ),
                                datasets: [
                                    {
                                        label: props.reportName,
                                        data: data?.map((d) => d.progress),
                                        // @ts-expect-error i dont know
                                        backgroundColor: data?.map((p) => {
                                            // const isOnTarget =
                                            //     p.progress <=
                                            //         props.target + 1 &&
                                            //     p.progress >= props.target - 1;

                                            // const lessThanTarget =
                                            //     p.progress < props.target - 1;

                                            // const moreThanTarget =
                                            //     p.progress > props.target + 1;

                                            const isOnTarget =
                                                p.progress === props.target;
                                            const lessThanTarget =
                                                p.progress < props.target;
                                            const moreThanTarget =
                                                p.progress > props.target;

                                            if (
                                                props.category ===
                                                ProgressCategory.Weight
                                            ) {
                                                if (isOnTarget) {
                                                    return "#5be5ba";
                                                }

                                                if (lessThanTarget) {
                                                    return "#808080";
                                                }

                                                if (moreThanTarget) {
                                                    return "#cf2e2e";
                                                }
                                            }

                                            if (
                                                props.category ===
                                                ProgressCategory.MuscleMass
                                            ) {
                                                if (lessThanTarget) {
                                                    return "#cf2e2e";
                                                }

                                                if (isOnTarget) {
                                                    return "#5be5ba";
                                                }

                                                if (moreThanTarget) {
                                                    return "#5be5ba";
                                                }
                                            }

                                            if (
                                                props.category ===
                                                ProgressCategory.FatPercentage
                                            ) {
                                                if (lessThanTarget) {
                                                    return "#5be5ba";
                                                }

                                                if (isOnTarget) {
                                                    return "#5be5ba";
                                                }

                                                if (moreThanTarget) {
                                                    return "#cf2e2e";
                                                }
                                            }

                                            return p.progress <=
                                                props.target + 1 &&
                                                p.progress >= props.target - 1
                                                ? "#5be5ba"
                                                : "#cf2e2e";
                                        }),
                                    },
                                ],
                            }}
                        />
                    </div>
                </div>
            </div>

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change Year</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ReactDatePicker
                        className="form-control"
                        selected={selectedDate}
                        onChange={(e) => setSelectedDate(e)}
                        dateFormat="yyyy"
                        maxDate={
                            new Date(
                                new Date().getFullYear(),
                                new Date().getMonth()
                            )
                        }
                        showYearPicker
                        onChangeRaw={(e) => e.preventDefault()}
                    />
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

WeightPage.getLayout = createAuthorizeLayout({
    withContainer: false,
    withBottomNav: false,
});

export default WeightPage;
