import { Fragment, FunctionalComponent } from "react";
import { WorkoutCategoryForm } from "../../clients/ApiClient";
import { nameof } from "../../functions/nameof";
import SmartForm, { SmartFormProps } from "../forms/SmartForm";

export const CreateEditWorkoutCategory: FunctionalComponent<
    SmartFormProps<WorkoutCategoryForm>
> = (props) => {
    return (
        <Fragment>
            <SmartForm.Form {...props}>
                {props.children}

                <div className="mt-3">
                    <div className="form-floating">
                        <SmartForm.Input
                            type="text"
                            name={nameof<WorkoutCategoryForm>("name")}
                            className="form-control"
                            placeholder="-"
                            options={{
                                required: {
                                    value: true,
                                    message: "Category Name is required",
                                },
                            }}
                        />

                        <label>Category Name</label>
                    </div>

                    <small className="mt-1 w-100 text-danger">
                        <SmartForm.Error
                            name={nameof<WorkoutCategoryForm>("name")}
                        />
                    </small>
                </div>
            </SmartForm.Form>
        </Fragment>
    );
};
