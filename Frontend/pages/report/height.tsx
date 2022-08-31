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
import { Modal } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import ReactDatePicker from "react-datepicker";
import { BsChevronLeft, BsDash, BsGear, BsPlus } from "react-icons/bs";
import useSWR from "swr";
import { ApiClient, ProgressCategory } from "../../src/clients/ApiClient";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { alertError } from "../../src/functions/alert";
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

const HeightPage: NextPageWithLayout = () => {
    const router = useRouter();
    useBg("bg-black");

    const [menu, setMenu] = useState(0);
    const [loading, setLoading] = useState(false);
    // const [loadingData, setLoadingData] = useState(true);
    const [height, setHeight] = useState(0);

    const date = new Date();

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await createApiClient().report_GetLastHeight();
                setHeight(res);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        })();
    }, []);

    return (
        <Fragment>
            <div
                className="text-black"
                style={{
                    height: 150,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: "url('/images/height.jpg')",
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
                    <h1>Height Report</h1>
                </div>
            </div>

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

            {menu === 1 && <ChartComponent />}

            {menu === 0 && (
                <Fragment>
                    <h1 className="text-center text-white mt-3">
                        {getMonthName(date)} {date.getFullYear()}
                    </h1>
                    <h3 className="text-center text-muted mt-3">
                        Input your height
                    </h3>

                    <fieldset disabled={loading}>
                        <div className=" mt-4 py-3 d-flex justify-content-center align-items-center">
                            <button
                                className="btn btn-primary text-white rounded-circle me-3 p-0"
                                style={{ height: 48, width: 48 }}
                                disabled={loading}
                                onClick={() => {
                                    if (height - 1 >= 1) {
                                        setHeight(height - 1);
                                    }
                                }}
                            >
                                {/* {loading && <LoadingIndicator />} */}
                                <BsDash size={32} />
                            </button>

                            <div
                                className="text-center text-white flex-shrink-1"
                                style={{ width: 100 }}
                            >
                                <input
                                    type="number"
                                    // style={{ width: 80 }}
                                    className="form-control form-control-lg bg-black text-white"
                                    value={height}
                                    step="any"
                                    onChange={(e) =>
                                        setHeight(parseFloat(e.target.value))
                                    }
                                />

                                {/* <BsWater size={64} /> */}
                                {/* <h1>{data?.perGlass} ml/glass</h1> */}
                            </div>

                            <button
                                className="btn btn-primary text-white rounded-circle ms-3 p-0"
                                style={{ height: 48, width: 48 }}
                                disabled={loading}
                                onClick={() => setHeight(height + 1)}

                                // onClick={() => updateProgress(true)}
                            >
                                {/* {loading && <LoadingIndicator />} */}
                                <BsPlus size={32} />
                            </button>
                        </div>
                    </fieldset>

                    <h1 className="text-center text-muted  mb-3">cm</h1>
                    <div className="text-center">
                        <button
                            className="btn btn-primary rounded-pill"
                            disabled={loading || isNaN(height) || height === 0}
                            onClick={async () => {
                                setLoading(true);

                                try {
                                    await createApiClient().report_InsertReportData(
                                        ProgressCategory.Height,
                                        height
                                    );
                                } catch {
                                    alertError();
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {loading && <LoadingIndicator className="me-2" />}
                            Save Height
                        </button>
                    </div>

                    <div className="bg-secondary fixed-bottom-res">
                        <div className="container">
                            <h3 className="border-bottom border-dark py-1 ms-1">
                                Height Tips
                            </h3>
                            <p className="p-2 small mb-0">
                                Yoga can increase your height.
                            </p>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

const ChartComponent: FunctionComponent = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showModal, setShowModal] = useState(false);

    const { data } = useSWR(
        [
            nameof<ApiClient>("report_GetChartData"),
            selectedDate?.getFullYear(),
            ProgressCategory.Height,
        ],
        async () =>
            createApiClient().report_GetChartData(
                selectedDate?.toISOString(),
                undefined
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
                                        label: "Height",
                                        data: data?.map((d) => d.progress),
                                        // backgroundColor: ["#5be5ba", "#cf2e2e"],
                                        // backgroundColor: data
                                        //     ?.slice(index * 7, index * 7 + 7)
                                        //     .map((p) =>
                                        //         p.pass ? "#5be5ba" : "#cf2e2e"
                                        //     ),
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

HeightPage.getLayout = createAuthorizeLayout({
    withContainer: false,
    withBottomNav: false,
});

export default HeightPage;
