import { useRouter } from "next/router";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { NextPageWithLayout } from "./_app";

const GuidePage: NextPageWithLayout = () => {
    const router = useRouter();

    const className =
        "d-flex flex-column justify-content-center h-100 px-5 bg-primary";

    return (
        <div className="bg-primary">
            <h1 className="fixed-top p-3 text-white display-3 fw-bold">
                Befit
            </h1>

            <div className="fixed-top p-4 text-white fw-bold text-end">
                <button
                    type="button"
                    className="btn btn-close btn-close-white"
                    onClick={() => router.push("/profile/settings")}
                />
            </div>

            <Swiper
                pagination
                navigation
                modules={[Navigation, Pagination]}
                className="vh-100"
                effect="cards"
            >
                <SwiperSlide>
                    <div className={className}>
                        <div className="d-flex flex-center">
                            <img
                                src="/images/copy.png"
                                alt=""
                                className="my-auto"
                                height={250}
                            />
                        </div>

                        <div className="text-white mt-3">
                            <h1>Copy Training</h1>
                            <p>
                                You can easily copy a workout plan if user
                                confused with all the training choices in this
                                app. User can also edit a copied training to fit
                                with your workout plan.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={className}>
                        <div className="d-flex flex-center">
                            <img
                                src="images/workout-target.png"
                                alt=""
                                className="my-auto"
                                height={250}
                            />
                        </div>

                        <div className="text-white mt-3">
                            <h1>Workout Target</h1>

                            <p className="text-white-50 mt-3">
                                You can organized a workout plan according to
                                the your capability and set the target and days.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={className}>
                        <div className="d-flex flex-center">
                            <img
                                src="images/workout-report.png"
                                alt=""
                                className="my-auto"
                                height={250}
                            />
                        </div>

                        <div className="text-white mt-3">
                            <h1>Workout Report</h1>

                            <p className="text-white-50 mt-3">
                                You can see your workout result in this section
                                such as how much you reach your target and pass
                                the workout. You can also record your own
                                weight, height, muscle mass, and fat percentage.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={className}>
                        <div className="d-flex flex-center">
                            <img
                                src="images/drink-report.png"
                                alt=""
                                className="my-auto"
                                height={250}
                            />
                        </div>

                        <div className="text-white mt-3">
                            <h1>Drink Report</h1>

                            <p className="text-white-50 mt-3">
                                Record your drink habbit and then see the report
                                on how much water you&apos;re drinking in day.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={className}>
                        <div className="d-flex flex-center">
                            <img
                                src="/images/share.png"
                                alt=""
                                className="my-auto"
                                height={250}
                            />
                        </div>

                        <div className="text-white mt-3">
                            <h1>Workout Plan Sharing</h1>

                            <p className="text-white-50 mt-3">
                                You can share your workout plan to your friends.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default GuidePage;
