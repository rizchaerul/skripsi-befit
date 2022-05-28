import { useRouter } from "next/router";
import { createAuthorizeLayout } from "../../src/components/layouts/AuthorizedLayout";
import { useBg } from "../../src/hooks/useBg";
import { NextPageWithLayout } from "../_app";

const ReportPage: NextPageWithLayout = () => {
    const router = useRouter();

    useBg("bg-black");

    return (
        <div className="text-white">
            {/* {new Date().toLocaleString()} */}
            {/* <h1>Lorem ipsum, dolor sit amet consectetur adipisicing. 🔥</h1> */}

            <div className="row justify-content-evenly mt-3">
                {[
                    {
                        name: "Workout Report",
                        src: "/images/workout.jpeg",
                        url: "/report/workout",
                    },
                    {
                        name: "Drink Report",
                        src: "/images/drink.jpeg",
                        url: "report/drink",
                    },
                    {
                        name: "Body Weight Report",
                        src: "/images/weight.jpeg",
                        url: "report/weight",
                    },
                    {
                        name: "Height Report",
                        src: "/images/height.jpg",
                        url: "/report/height",
                    },
                    {
                        name: "Muscle Mass Report",
                        src: "/images/muscle.webp",
                        url: "/report/muscle-mass",
                    },
                    {
                        name: "Fat Percentage Report",
                        src: "/images/fat.jpeg",
                        url: "/report/fat-percentage",
                    },
                ].map((m) => (
                    <div key={m.name} className="col-6 col-md-4 mb-3">
                        <div
                            className="ratio ratio-1x1  border border-3 border-white"
                            style={{
                                borderRadius: 20,
                                cursor: "pointer",
                                // borderStyle: "solid",
                                // borderColor: "white",
                                background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${m.src}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                            onClick={() => router.push(m.url)}
                        >
                            <div className="position-relative">
                                <h4 className="position-absolute bottom-0 fw-bold text-white ps-1">
                                    {m.name}
                                </h4>
                            </div>
                        </div>
                    </div>
                    // <div  className="bg-white text-black">
                    // <div
                    //     key={m.name}
                    //     className="ratio ratio-1x1"
                    //     style={{ width: 200 }}
                    // >
                    //     <div className="bg-primary">{m.name}</div>
                    // </div>
                    // </div>
                    // <div key={m.name} className="col-6 col-lg-4 mt-4">
                    //     <div
                    //         className="bg-white text-black rounded-3 position-relative"
                    //         style={{
                    //             cursor: "pointer",
                    //             borderStyle: "solid",
                    //             borderColor: "white",
                    //             height: 150,
                    //             background:
                    //                 "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://static01.nyt.com/images/2018/09/18/well/family/sub18weight/sub18weight-superJumbo.jpg')",
                    //             backgroundSize: "cover",
                    //             backgroundPosition: "center",
                    //             backgroundRepeat: "no-repeat",
                    //             // backgroundImage:
                    //             //     'url("https://static01.nyt.com/images/2018/09/18/well/family/sub18weight/sub18weight-superJumbo.jpg")',
                    //         }}
                    //     >
                    //         <div className="position-absolute bottom-0 fw-bold text-white ps-1">
                    //             {m.name}
                    //         </div>
                    //     </div>
                    // </div>
                ))}
                {/* <div className="col-6">
                    <div className="" style={{ height: 200 }}></div>
                </div> */}
            </div>
        </div>
    );
};

ReportPage.getLayout = createAuthorizeLayout({ darkMode: true });

export default ReportPage;
