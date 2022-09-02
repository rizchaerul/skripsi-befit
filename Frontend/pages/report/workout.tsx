import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Modal } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import { BsChevronLeft, BsGear } from "react-icons/bs";
import useSWR from "swr";
import { ApiClient } from "../../src/clients/ApiClient";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { createApiClient } from "../../src/functions/create-api-client";
import { getMonthName } from "../../src/functions/get-month-name";
import { nameof } from "../../src/functions/nameof";
import { useBg } from "../../src/hooks/useBg";
import { NextPageWithLayout } from "../_app";

Chart.register(ArcElement, Tooltip, Legend);

const WorkoutPage: NextPageWithLayout = () => {
    const router = useRouter();
    useBg("bg-black");

    const [showModal, setShowModal] = useState(false);
    const [menu, setMenu] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const { data } = useSWR(
        [
            nameof<ApiClient>("report_GetWorkoutReport"),
            selectedDate?.getFullYear(),
            selectedDate?.getMonth(),
        ],
        async () =>
            createApiClient().report_GetWorkoutReport(
                new Date(
                    selectedDate?.getFullYear() ?? 0,
                    selectedDate?.getMonth() ?? 0
                ).toISOString() ?? undefined
            )
    );

    return (
        <Fragment>
            <div
                className="text-white"
                style={{
                    height: 150,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: "url('/images/workout.jpeg')",
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
                    <h1>Training Report</h1>
                    <h6>
                        {getMonthName(selectedDate)}{" "}
                        {selectedDate?.getFullYear()}{" "}
                        <BsGear onClick={() => setShowModal(true)} />
                    </h6>
                </div>

                {data?.workouts.length !== 0 || (
                    <div className="alert alert-warning">
                        You have no workout.
                    </div>
                )}
            </div>

            <div className="d-flex text-white mt-3">
                <div
                    className={`${
                        menu === 0 ? "bg-dark" : "bg-secondary"
                    } flex-grow-1 text-center fs-3`}
                    onClick={() => setMenu(0)}
                >
                    Table
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

            <div className="container mt-3">
                {menu === 1 && (
                    <Fragment>
                        <Pie
                            // style={{ maxHeight: 250, maxWidth: 250 }}
                            data={{
                                labels: ["Passed", "Failed"],
                                datasets: [
                                    {
                                        label: "# of Workouts",
                                        data: [data?.passed, data?.failed],
                                        backgroundColor: ["#5be5ba", "#cf2e2e"],
                                        // borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{ color: "white" }}
                        />
                    </Fragment>
                )}
            </div>

            <div className="container mt-3">
                {menu === 0 && (
                    <Fragment>
                        {!data && <LoadingIndicator className="text-white" />}
                        {data?.workouts.reverse().map((w, index) => (
                            <div key={index} className="text-white">
                                <table className="table table-dark">
                                    <thead>
                                        <tr>
                                            <th>
                                                {new Date(
                                                    w.date
                                                ).toDateString()}
                                            </th>
                                            <th>Target</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {w.workouts.map((ww) => (
                                            <tr key={ww.id}>
                                                <td>{ww.name}</td>
                                                <td>
                                                    {ww.target} {ww.unit}
                                                </td>
                                                <td
                                                    className={`${
                                                        ww.progress >= ww.target
                                                            ? "fw-bold text-light-green"
                                                            : "fw-bold text-danger"
                                                    }`}
                                                >
                                                    {ww.progress >= ww.target
                                                        ? "Passed"
                                                        : "Failed"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* <tbody>
                                        <tr>
                                            <td>Jumping Jack</td>
                                            <td>2 Minutes</td>
                                            <td className="text-success fw-bold">
                                                Passed
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>Jumping Jack</td>
                                            <td>2 Minutes</td>
                                            <td className="text-danger fw-bold">
                                                Failed
                                            </td>
                                        </tr>
                                    </tbody> */}
                                </table>
                            </div>
                        ))}
                    </Fragment>
                )}
            </div>

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

WorkoutPage.getLayout = createAuthorizeLayout({
    darkMode: true,
    withBottomNav: false,
    withContainer: false,
});

export default WorkoutPage;
