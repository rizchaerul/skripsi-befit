import { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment } from "react";

const TestServicePage: NextPage = () => {
    const router = useRouter();
    const { json } = router.query;

    return <Fragment>{json?.toString()}</Fragment>;
};

export default TestServicePage;
