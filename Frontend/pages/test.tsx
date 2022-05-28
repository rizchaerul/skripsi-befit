import { FunctionComponent } from "react";
import SmartForm from "../src/components/forms/SmartForm";

const TestPage: FunctionComponent = () => {
    return (
        <div className="container">
            <SmartForm.Form>
                <div className="mb-3">
                    <SmartForm.Input
                        name="name"
                        className="form-control"
                        options={{
                            required: {
                                value: true,
                                message: "Name is required.",
                            },
                            minLength: {
                                value: 3,
                                message: "Minimum length for Name is 3.",
                            },
                            validate: (value) => {
                                if (value) {
                                    return "Password tidak sama";
                                }
                            },
                        }}
                    />

                    <small className="text-danger mt-1 w-100">
                        <SmartForm.Error name="name" />
                    </small>
                </div>

                <button className="btn btn-primary">Submit</button>
            </SmartForm.Form>
        </div>
    );
};

export default TestPage;
