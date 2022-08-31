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
import { Fragment, FunctionComponent, useState } from "react";
import { Modal, ProgressBar } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import {
    BsChevronLeft,
    BsCupStraw,
    BsDash,
    BsGear,
    BsPlus,
} from "react-icons/bs";
import useSWR from "swr";
import { ApiClient } from "../../src/clients/ApiClient";
import SmartForm from "../../src/components/forms/SmartForm";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { alertSuccess } from "../../src/functions/alert";
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

const DrinkPage: NextPageWithLayout = () => {
    const router = useRouter();
    useBg("bg-black");

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [settingLoading, setSettingLoading] = useState(false);

    const [menu, setMenu] = useState(0);
    const { data, mutate } = useSWR(
        nameof<ApiClient>("report_GetDrinkReport"),
        async () => createApiClient().report_GetDrinkReport()
    );

    // console.log(data);

    async function updateProgress(isPlus: boolean) {
        const progress = data?.progress ?? 0;
        const value = isPlus ? progress + 1 : progress - 1;

        setLoading(true);

        try {
            await createApiClient().report_AddDrinkProgress(value);
            await mutate();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: 700 }}>
            <div
                className="text-white"
                style={{
                    height: 150,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: "url('/images/drink.jpeg')",
                }}
            >
                <BsChevronLeft
                    size={32}
                    className="ms-1 mt-2"
                    onClick={() => router.push("/report")}
                />
            </div>

            <div className="container">
                <div className="text-center text-white pt-3">
                    <h1>
                        Drink Report{" "}
                        <BsGear onClick={() => setShowModal(true)} />
                    </h1>
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

            {menu === 0 && (
                <Fragment>
                    <div className="container text-white mt-3">
                        <h5>
                            {data?.progress} of {data?.target} Glasses
                        </h5>
                        <ProgressBar
                            className="rounded-pill"
                            now={
                                ((data?.progress ?? 0) / (data?.target ?? 0)) *
                                100
                            }
                        />
                    </div>

                    <div className="bg-dark mt-4 py-3 d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-light rounded-circle me-3 p-0"
                            style={{ height: 48, width: 48 }}
                            disabled={loading}
                            onClick={() => updateProgress(false)}
                        >
                            {loading && <LoadingIndicator />}
                            {!loading && <BsDash size={32} />}
                        </button>
                        <div className="text-center text-white">
                            <BsCupStraw size={64} />
                            <h1>{data?.perGlass} ml/glass</h1>
                        </div>
                        <button
                            className="btn btn-light rounded-circle ms-3 p-0"
                            style={{ height: 48, width: 48 }}
                            disabled={loading}
                            onClick={() => updateProgress(true)}
                        >
                            {loading && <LoadingIndicator />}
                            {!loading && <BsPlus size={32} />}
                        </button>
                    </div>

                    <div className="bg-secondary fixed-bottom">
                        <div className="container">
                            <h3 className="border-bottom border-dark py-1 ms-1">
                                Drink Tips
                            </h3>
                            <p className="p-2">
                                Keeping a water bottle with you throughout the
                                day can help you drink more water.
                            </p>
                        </div>
                    </div>
                </Fragment>
            )}

            {menu === 1 && <ChartGraph />}

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
                                    await createApiClient().report_SetDrinkTarget(
                                        data.perGlass,
                                        data.glass
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
                                glass: data?.target,
                                perGlass: data?.perGlass,
                            }}
                        >
                            <div className="mb-3">
                                <label htmlFor="glass" className="form-label">
                                    Water Intake Target (Glasses)
                                </label>

                                <SmartForm.Input
                                    type="number"
                                    name="glass"
                                    id="glass"
                                    className="form-control"
                                    options={{
                                        required: {
                                            value: true,
                                            message:
                                                "Water Intake is required.",
                                        },
                                        min: {
                                            value: 0,
                                            message:
                                                "Water Intake minimum value is 0.",
                                        },
                                    }}
                                />

                                <small className="mt-1 w-100 text-danger">
                                    <SmartForm.Error name="glass" />
                                </small>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="glass" className="form-label">
                                    Milliliter per glass
                                </label>

                                <SmartForm.Input
                                    type="number"
                                    name="perGlass"
                                    id="perGlass"
                                    className="form-control"
                                    options={{
                                        required: {
                                            value: true,
                                            message:
                                                "Milliliter per glass is required.",
                                        },
                                        min: {
                                            value: 0,
                                            message:
                                                "Milliliter per glass minimum value is 0.",
                                        },
                                    }}
                                />

                                <small className="mt-1 w-100 text-danger">
                                    <SmartForm.Error name="perGlass" />
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
        </div>
    );
};

const ChartGraph: FunctionComponent = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showModal, setShowModal] = useState(false);

    const { data } = useSWR(
        [
            nameof<ApiClient>("report_GetDrinkChart"),
            selectedDate?.getFullYear(),
            selectedDate?.getMonth(),
        ],
        async () =>
            createApiClient().report_GetDrinkChart(selectedDate?.toISOString())
    );

    // console.log(data);

    return (
        <Fragment>
            <h4 className="text-white text-center mt-3">
                {getMonthName(selectedDate)} {selectedDate?.getFullYear()}{" "}
                <BsGear onClick={() => setShowModal(true)} />
            </h4>
            {[...Array(Math.ceil((data?.length ?? 0) / 7))].map(
                (item, index) => (
                    <div key={index}>
                        <div className="container">
                            <h1 className="text-white mt-3">
                                Week {index + 1}
                            </h1>
                        </div>
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
                                        labels: data
                                            ?.slice(index * 7, index * 7 + 7)
                                            .map((d) =>
                                                new Date(d.date)
                                                    .toDateString()
                                                    .slice(0, 3)
                                            ),
                                        datasets: [
                                            {
                                                label: "Drinks",
                                                data: data
                                                    ?.slice(
                                                        index * 7,
                                                        index * 7 + 7
                                                    )
                                                    .map((d) => d.progress),
                                                // backgroundColor: ["#5be5ba", "#cf2e2e"],
                                                // @ts-expect-error this should be working
                                                backgroundColor: data
                                                    ?.slice(
                                                        index * 7,
                                                        index * 7 + 7
                                                    )
                                                    .map((p) =>
                                                        p.pass
                                                            ? "#5be5ba"
                                                            : "#cf2e2e"
                                                    ),
                                            },
                                        ],
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            )}

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change Month</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <DatePicker
                        className="form-control"
                        selected={selectedDate}
                        onChange={(e) => setSelectedDate(e)}
                        dateFormat="MMMM"
                        maxDate={
                            new Date(
                                new Date().getFullYear(),
                                new Date().getMonth()
                            )
                        }
                        showMonthYearPicker
                        onChangeRaw={(e) => e.preventDefault()}
                    />
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

DrinkPage.getLayout = createAuthorizeLayout({
    darkMode: true,
    withContainer: false,
    withBottomNav: false,
});

export default DrinkPage;
