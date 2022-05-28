import { NextPage } from "next";
import { Fragment, useState } from "react";
import SmartForm from "../src/components/forms/SmartForm";
import { VerticalSpacer } from "../src/components/Spacer";

const Test3Page: NextPage = () => {
    const [form, setForm] = useState({
        petName: "Doggy",
    });

    return (
        <Fragment>
            <div className="container">
                <VerticalSpacer />
                <h1>Form</h1>
                <VerticalSpacer />

                <SmartForm.FormV2 initialValues={form} formValues={form}>
                    <SmartForm.Input name="petName" />
                    <button type="reset">Reset</button>
                </SmartForm.FormV2>

                <input
                    type="text"
                    onChange={(e) =>
                        setForm({ ...form, petName: e.target.value })
                    }
                />
            </div>
        </Fragment>
    );
};

export default Test3Page;
